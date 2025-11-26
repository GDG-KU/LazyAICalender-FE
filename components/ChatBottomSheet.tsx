// components/ChatBottomSheet.tsx
import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet, View, Text, useWindowDimensions, LayoutChangeEvent, Keyboard } from "react-native";
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

interface ChatBottomSheetProps {
  onAddTodo: (text: string) => void;
}

export default function ChatBottomSheet({ onAddTodo }: ChatBottomSheetProps) {
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [queryInputHeight, setQueryInputHeight] = useState(80); // 기본값
  const queryInputHeightShared = useSharedValue(80); // 애니메이션용 shared value

  // 스냅 포인트를 메모이제이션하여 불필요한 재계산 방지
  // translateY는 시트의 상단 위치
  // FULL: translateY = 0, sheetHeight = SCREEN_HEIGHT (전체 화면)
  // MID: translateY = SCREEN_HEIGHT * 0.33, sheetHeight = SCREEN_HEIGHT * 0.67 (33%부터 하단까지)
  // MIN: translateY = SCREEN_HEIGHT - queryInputHeight, sheetHeight = queryInputHeight (쿼리 인풋만)
  const snapPoints = useMemo(() => {
    const FULL = 0;
    const MID = SCREEN_HEIGHT * 0.33;
    return { FULL, MID };
  }, [SCREEN_HEIGHT]);

  // useAnimatedStyle에서 사용할 수 있도록 상수 추출
  const FULL = snapPoints.FULL;
  const MID = snapPoints.MID;

  // 쿼리 인풋의 높이를 측정 (정확한 높이 측정)
  const handleQueryInputLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0) {
      // 높이가 변경되었을 때만 업데이트 (1px 이상 차이)
      if (Math.abs(height - queryInputHeight) > 1) {
        setQueryInputHeight(height);
        queryInputHeightShared.value = height;
        
        // MIN 상태에 있으면 즉시 업데이트
        const currentHeight = sheetHeight.value;
        if (SCREEN_HEIGHT > 0 && Math.abs(currentHeight - height) < 50) {
          sheetHeight.value = height;
        }
      }
    }
  };

  // 초기값 설정
  const sheetHeight = useSharedValue(80); // 초기값을 쿼리 인풋 높이로 설정
  const startY = useSharedValue(0);
  const queryInputTranslateY = useSharedValue(0); // 쿼리 인풋의 translateY 값
  const originalSheetHeight = useSharedValue(80); // 키보드가 올라오기 전의 원래 높이 저장

  // SCREEN_HEIGHT가 처음 설정될 때 초기 위치 업데이트
  useEffect(() => {
    if (SCREEN_HEIGHT > 0 && queryInputHeight > 0) {
      // 초기 상태일 때만 업데이트
      if (Math.abs(sheetHeight.value - queryInputHeight) > 10) {
        sheetHeight.value = queryInputHeight;
      }
    }
  }, [SCREEN_HEIGHT, queryInputHeight]);

  // queryInputHeight가 변경되면 MIN 상태 업데이트
  useEffect(() => {
    if (SCREEN_HEIGHT <= 0 || queryInputHeight <= 0) return;
    
    // MIN 상태 근처에 있으면 MIN으로 업데이트 (정확히 맞춤)
    const currentHeight = sheetHeight.value;
    if (Math.abs(currentHeight - queryInputHeight) < 50) {
      sheetHeight.value = queryInputHeight; // 정확히 queryInputHeight로 설정
    }
  }, [queryInputHeight, SCREEN_HEIGHT]);

  // 키보드 이벤트 처리
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      'keyboardWillShow',
      (e) => {
        const keyboardHeight = e.endCoordinates.height;
        const minHeight = queryInputHeightShared.value;
        const currentHeight = sheetHeight.value;
        
        // 현재 높이가 최소 사이즈인지 확인 (약간의 여유를 둠)
        const isMinSize = Math.abs(currentHeight - minHeight) < 10;
        
        if (isMinSize) {
          // 최소 사이즈일 때는 원래 높이를 저장하고 챗바텀시트 높이를 키보드 높이만큼 늘림
          originalSheetHeight.value = currentHeight;
          sheetHeight.value = withTiming(currentHeight + keyboardHeight, {
            duration: e.duration || 250,
          });
        }
        
        // 키보드 높이만큼 쿼리 인풋을 위로 이동
        queryInputTranslateY.value = withTiming(-keyboardHeight, {
          duration: e.duration || 250,
        });
      }
    );
    const keyboardWillHide = Keyboard.addListener(
      'keyboardWillHide',
      (e) => {
        // 키보드가 사라지면 원래 위치로
        queryInputTranslateY.value = withTiming(0, {
          duration: e.duration || 250,
        });
        
        // 최소 사이즈였으면 원래 높이로 복원
        const minHeight = queryInputHeightShared.value;
        const currentHeight = sheetHeight.value;
        const isMinSize = Math.abs(originalSheetHeight.value - minHeight) < 10;
        
        if (isMinSize && originalSheetHeight.value > 0) {
          sheetHeight.value = withTiming(originalSheetHeight.value, {
            duration: e.duration || 250,
          });
        }
      }
    );
    const keyboardDidShow = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        const keyboardHeight = e.endCoordinates.height;
        const minHeight = queryInputHeightShared.value;
        const currentHeight = sheetHeight.value;
        
        // 현재 높이가 최소 사이즈인지 확인
        const isMinSize = Math.abs(currentHeight - minHeight) < 10;
        
        if (isMinSize) {
          // 최소 사이즈일 때는 원래 높이를 저장하고 챗바텀시트 높이를 키보드 높이만큼 늘림
          originalSheetHeight.value = currentHeight;
          sheetHeight.value = withTiming(currentHeight + keyboardHeight, {
            duration: 250,
          });
        }
        
        // Android용
        queryInputTranslateY.value = withTiming(-keyboardHeight, {
          duration: 250,
        });
      }
    );
    const keyboardDidHide = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        // Android용
        queryInputTranslateY.value = withTiming(0, {
          duration: 250,
        });
        
        // 최소 사이즈였으면 원래 높이로 복원
        const minHeight = queryInputHeightShared.value;
        const isMinSize = Math.abs(originalSheetHeight.value - minHeight) < 10;
        
        if (isMinSize && originalSheetHeight.value > 0) {
          sheetHeight.value = withTiming(originalSheetHeight.value, {
            duration: 250,
          });
        }
      }
    );

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
      // bottom: 0을 사용하므로, 드래그 방향과 반대로 높이 조정
      // 위로 드래그 (translationY < 0) → 높이 증가
      // 아래로 드래그 (translationY > 0) → 높이 감소
      const next = startY.value - event.translationY;
      const minHeight = queryInputHeightShared.value;
      const maxHeight = SCREEN_HEIGHT;
      // MIN ~ FULL 사이로 clamp
      const clamped = Math.min(Math.max(next, minHeight), maxHeight);
      sheetHeight.value = clamped;
    })
    .onEnd(() => {
      const current = sheetHeight.value;
      const minHeight = queryInputHeightShared.value;
      const midHeight = SCREEN_HEIGHT - MID;
      const maxHeight = SCREEN_HEIGHT;

      // 각 스냅 포인트까지의 거리 계산
      const distToFULL = Math.abs(current - maxHeight);
      const distToMID = Math.abs(current - midHeight);
      const distToMIN = Math.abs(current - minHeight);

      // 가장 가까운 스냅 포인트 찾기
      let targetHeight: number;
      
      if (distToFULL <= distToMID && distToFULL <= distToMIN) {
        targetHeight = maxHeight; // FULL 상태: 전체 화면 높이
      } else if (distToMID <= distToMIN) {
        targetHeight = midHeight; // MID 상태: 화면 하단부터 MID까지
      } else {
        targetHeight = minHeight; // MIN 상태: 쿼리 인풋 높이만
      }

      sheetHeight.value = withSpring(targetHeight, {
        damping: 20,
        stiffness: 200,
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    height: sheetHeight.value,
  }));

  // 채팅 내용과 드래그 핸들의 opacity를 sheetHeight 값에 따라 조절
  const chatContentOpacity = useAnimatedStyle(() => {
    const minHeight = queryInputHeightShared.value;
    const midHeight = SCREEN_HEIGHT - MID;
    // MIN 상태에서는 0, MID 이상에서는 1
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
    // MIN 상태에서는 0, MID 이상에서는 1
    const opacity = interpolate(
      sheetHeight.value,
      [minHeight, midHeight],
      [0, 1],
      "clamp"
    );
    return { opacity };
  });

  // 쿼리 인풋의 translateY 애니메이션 스타일
  const queryInputAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: queryInputTranslateY.value }],
  }));

  // 아래바를 탭/포커스했을 때 중간 이상으로 올리기
  const expandToMid = () => {
    const midHeight = SCREEN_HEIGHT - MID;
    sheetHeight.value = withSpring(midHeight, {
      damping: 20,
      stiffness: 200,
    });
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.sheetContainer,
          animatedStyle,
        ]}
      >
        <View style={styles.sheetContent}>
          {/* 상단 드래그 핸들 - MID 이상일 때만 보임 */}
          <Animated.View style={[styles.handleWrapper, handleOpacity]}>
            <View style={styles.handle} />
          </Animated.View>

          {/* 2-2 / 2-3에서 보일 채팅 내용 영역 - MID 이상일 때만 보임 */}
          <Animated.View style={[styles.chatContent, chatContentOpacity]}>
            <View style={styles.chatBubbleMine}>
              <Text style={styles.chatBubbleMineText}>
                24일부터 26일까지 어떤 일정을 추가할까요?
              </Text>
            </View>
            <View style={styles.chatBubbleBot}>
              <Text style={styles.chatBubbleBotText}>
                동기들이랑 제주도 여행이라고 하셨죠.{"\n"}
                샘플 시나리오 텍스트가 들어갈 자리입니다.
              </Text>
            </View>
          </Animated.View>

          {/* 항상 맨 아래에 붙어있는 입력창 */}
          <Animated.View 
            onLayout={handleQueryInputLayout}
            style={[
              styles.queryInputContainer,
              queryInputAnimatedStyle,
            ]}
          >
            <QueryInput
              onAddTodo={onAddTodo}
              onExpand={expandToMid}
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
    bottom: 0, // 화면 하단에 고정
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
    backgroundColor: "#F2A892",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
  },
  chatBubbleMineText: {
    color: "#111",
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
