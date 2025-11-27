import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  LayoutChangeEvent,
  Keyboard,
  ScrollView,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import QueryInput from "./query-input";

// ===== 채팅 메시지 타입 =====
type MsgRole = "user" | "agent";
type Msg = {
  id: string;
  role: MsgRole;
  text: string;
};

// 더미 에이전트 답변들
const DUMMY_REPLIES = [
  "네, 어떤 일정인지 조금 더 자세히 말씀해 주세요.",
  "좋아요! 언제부터 언제까지 진행되는 일정인가요?",
  "혹시 위치나 이동 시간도 같이 고려해야 할까요?",
  "알겠습니다. 이 일정이 어떤 카테고리에 가장 어울릴까요?",
];

interface ChatBottomSheetProps {
  // 일정 추가 모드에서 실제 투두를 생성하는 콜백
  onAddTodo: (text: string) => void;

  // mode === "agent": 에이전트 대화 모드 (날짜 미선택)
  // mode === "schedule": 일정 추가 모드 (날짜 선택)
  mode: "agent" | "schedule";

  // 맨 위 에이전트 버블 텍스트 (예: "무엇을 도와드릴까요?")
  headerText: string;
}

export default function ChatBottomSheet({
  onAddTodo,
  mode,
  headerText,
}: ChatBottomSheetProps) {
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [queryInputHeight, setQueryInputHeight] = useState(80);
  const queryInputHeightShared = useSharedValue(80);

  // ======== 채팅 상태 관리 ========
  const [msgs, setMsgs] = useState<Msg[]>([]);

  // headerText 바뀔 때마다 에이전트 버블 하나 추가
  useEffect(() => {
    if (!headerText) return;
    setMsgs((prev) => [
      ...prev,
      {
        id: `header-${Date.now()}`,
        role: "agent",
        text: headerText,
      },
    ]);
  }, [headerText]);

  // 유저 입력 처리
  const handleSubmit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Msg = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
    };
    setMsgs((prev) => [...prev, userMsg]);

    if (mode === "schedule") {
      // ✅ 일정 추가 모드: 투두 추가만 하고 답장은 안 보냄
      onAddTodo(trimmed);
      return;
    }

    // ✅ 에이전트 모드: 랜덤 답장
    const replyText =
      DUMMY_REPLIES[Math.floor(Math.random() * DUMMY_REPLIES.length)];

    setTimeout(() => {
      const agentMsg: Msg = {
        id: `a-${Date.now()}`,
        role: "agent",
        text: replyText,
      };
      setMsgs((prev) => [...prev, agentMsg]);
    }, 400 + Math.random() * 400);
  };

  // ======== 아래부터는 서연님이 만든 바텀시트 높이/제스처 로직 ========

  const snapPoints = useMemo(() => {
    const FULL = 0;
    const MID = SCREEN_HEIGHT * 0.33;
    return { FULL, MID };
  }, [SCREEN_HEIGHT]);

  const FULL = snapPoints.FULL;
  const MID = snapPoints.MID;

  const handleQueryInputLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0) {
      if (Math.abs(height - queryInputHeight) > 1) {
        setQueryInputHeight(height);
        queryInputHeightShared.value = height;

        const currentHeight = sheetHeight.value;
        if (SCREEN_HEIGHT > 0 && Math.abs(currentHeight - height) < 50) {
          sheetHeight.value = height;
        }
      }
    }
  };

  const sheetHeight = useSharedValue(80);
  const startY = useSharedValue(0);
  const queryInputTranslateY = useSharedValue(0);
  const originalSheetHeight = useSharedValue(80);

  useEffect(() => {
    if (SCREEN_HEIGHT > 0 && queryInputHeight > 0) {
      if (Math.abs(sheetHeight.value - queryInputHeight) > 10) {
        sheetHeight.value = queryInputHeight;
      }
    }
  }, [SCREEN_HEIGHT, queryInputHeight]);

  useEffect(() => {
    if (SCREEN_HEIGHT <= 0 || queryInputHeight <= 0) return;
    const currentHeight = sheetHeight.value;
    if (Math.abs(currentHeight - queryInputHeight) < 50) {
      sheetHeight.value = queryInputHeight;
    }
  }, [queryInputHeight, SCREEN_HEIGHT]);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener("keyboardWillShow", (e) => {
      const keyboardHeight = e.endCoordinates.height;
      const minHeight = queryInputHeightShared.value;
      const currentHeight = sheetHeight.value;
      const isMinSize = Math.abs(currentHeight - minHeight) < 10;

      if (isMinSize) {
        originalSheetHeight.value = currentHeight;
        sheetHeight.value = withTiming(currentHeight + keyboardHeight, {
          duration: e.duration || 250,
        });
      }

      queryInputTranslateY.value = withTiming(-keyboardHeight, {
        duration: e.duration || 250,
      });
    });

    const keyboardWillHide = Keyboard.addListener("keyboardWillHide", (e) => {
      queryInputTranslateY.value = withTiming(0, {
        duration: e.duration || 250,
      });

      const minHeight = queryInputHeightShared.value;
      const currentHeight = sheetHeight.value;
      const isMinSize = Math.abs(originalSheetHeight.value - minHeight) < 10;

      if (isMinSize && originalSheetHeight.value > 0) {
        sheetHeight.value = withTiming(originalSheetHeight.value, {
          duration: e.duration || 250,
        });
      }
    });

    const keyboardDidShow = Keyboard.addListener("keyboardDidShow", (e) => {
      const keyboardHeight = e.endCoordinates.height;
      const minHeight = queryInputHeightShared.value;
      const currentHeight = sheetHeight.value;
      const isMinSize = Math.abs(currentHeight - minHeight) < 10;

      if (isMinSize) {
        originalSheetHeight.value = currentHeight;
        sheetHeight.value = withTiming(currentHeight + keyboardHeight, {
          duration: 250,
        });
      }

      queryInputTranslateY.value = withTiming(-keyboardHeight, {
        duration: 250,
      });
    });

    const keyboardDidHide = Keyboard.addListener("keyboardDidHide", () => {
      queryInputTranslateY.value = withTiming(0, {
        duration: 250,
      });

      const minHeight = queryInputHeightShared.value;
      const isMinSize = Math.abs(originalSheetHeight.value - minHeight) < 10;

      if (isMinSize && originalSheetHeight.value > 0) {
        sheetHeight.value = withTiming(originalSheetHeight.value, {
          duration: 250,
        });
      }
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, [queryInputTranslateY, queryInputHeightShared, sheetHeight, originalSheetHeight]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = sheetHeight.value;
    })
    .onUpdate((event) => {
      const next = startY.value - event.translationY;
      const minHeight = queryInputHeightShared.value;
      const maxHeight = SCREEN_HEIGHT;
      const clamped = Math.min(Math.max(next, minHeight), maxHeight);
      sheetHeight.value = clamped;
    })
    .onEnd(() => {
      const current = sheetHeight.value;
      const minHeight = queryInputHeightShared.value;
      const midHeight = SCREEN_HEIGHT - MID;
      const maxHeight = SCREEN_HEIGHT;

      const distToFULL = Math.abs(current - maxHeight);
      const distToMID = Math.abs(current - midHeight);
      const distToMIN = Math.abs(current - minHeight);

      let targetHeight: number;
      if (distToFULL <= distToMID && distToFULL <= distToMIN) {
        targetHeight = maxHeight;
      } else if (distToMID <= distToMIN) {
        targetHeight = midHeight;
      } else {
        targetHeight = minHeight;
      }

      sheetHeight.value = withSpring(targetHeight, {
        damping: 20,
        stiffness: 200,
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    height: sheetHeight.value,
  }));

  const chatContentOpacity = useAnimatedStyle(() => {
    const minHeight = queryInputHeightShared.value;
    const midHeight = SCREEN_HEIGHT - MID;
    const opacity = interpolate(
      sheetHeight.value,
      [minHeight, midHeight],
      [0, 1],
      "clamp"
    );
    return { opacity };
  });

  const handleOpacity = useAnimatedStyle(() => {
    const minHeight = queryInputHeightShared.value;
    const midHeight = SCREEN_HEIGHT - MID;
    const opacity = interpolate(
      sheetHeight.value,
      [minHeight, midHeight],
      [0, 1],
      "clamp"
    );
    return { opacity };
  });

  const queryInputAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: queryInputTranslateY.value }],
  }));

  const expandToMid = () => {
    const midHeight = SCREEN_HEIGHT - MID;
    sheetHeight.value = withSpring(midHeight, {
      damping: 20,
      stiffness: 200,
    });
  };

  // ✅ 여기서 모드에 따라 placeholder 문구 결정
  const placeholder =
    mode === "agent" ? "무엇을 도와드릴까요?" : "어떤 일정을 추가할까요?";

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.sheetContainer, animatedStyle]}>
        <View style={styles.sheetContent}>
          {/* 상단 드래그 핸들 */}
          <Animated.View style={[styles.handleWrapper, handleOpacity]}>
            <View style={styles.handle} />
          </Animated.View>

          {/* 채팅 내용 영역 */}
          <Animated.View style={[styles.chatContent, chatContentOpacity]}>
            <ScrollView
              contentContainerStyle={{ paddingBottom: 8 }}
              showsVerticalScrollIndicator={false}
            >
              {msgs.map((m) =>
                m.role === "user" ? (
                  <View key={m.id} style={styles.chatBubbleMine}>
                    <Text style={styles.chatBubbleMineText}>{m.text}</Text>
                  </View>
                ) : (
                  <View key={m.id} style={styles.chatBubbleBot}>
                    <Text style={styles.chatBubbleBotText}>{m.text}</Text>
                  </View>
                )
              )}
            </ScrollView>
          </Animated.View>

          {/* 항상 맨 아래에 붙어있는 입력창 */}
          <Animated.View
            onLayout={handleQueryInputLayout}
            style={[styles.queryInputContainer, queryInputAnimatedStyle]}
          >
            <QueryInput
              onAddTodo={handleSubmit}
              onExpand={expandToMid}
              placeholder={placeholder}
            />
          </Animated.View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#111111",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  sheetContent: {
    flex: 1,
  },
  handleWrapper: {
    paddingTop: 8,
    paddingBottom: 4,
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 999,
    backgroundColor: "#3A3A3A",
  },
  chatContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  chatBubbleMine: {
    alignSelf: "flex-end",
    backgroundColor: "#4B8CF4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
  },
  chatBubbleMineText: {
    color: "#fff",
    fontSize: 14,
  },
  chatBubbleBot: {
    alignSelf: "flex-start",
    backgroundColor: "#252525",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
  },
  chatBubbleBotText: {
    color: "#F5F5F5",
    fontSize: 14,
  },
  queryInputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
  },
});

