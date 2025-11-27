import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import QueryInput from "@/components/query-input";

type Msg = { id: string; role: "user" | "agent"; text: string; ts: number };

// 더미 답변 리스트
const DUMMY = [
  "네, 도와드릴게요. 무엇을 원하시나요?",
  "일정 제목/기간/장소를 말해주시면 준비해볼게요.",
  "카테고리나 투두 여부도 함께 지정할 수 있어요.",
  "겹치면 알려드릴게요. 계속 입력해보세요!",
];

const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export default function AgentDock({
  prompt,
  onSubmit,
  enableCreate, // true: 일정 생성 플로우(날짜 선택됨)
  enableReply,  // true: 에이전트 답장 보내기 (상담 모드)
}: {
  prompt: string;
  onSubmit: (text: string) => void;
  enableCreate: boolean;
  enableReply: boolean;
}) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const listRef = useRef<FlatList<Msg>>(null);

  const scrollEnd = () =>
    requestAnimationFrame(() =>
      listRef.current?.scrollToEnd({ animated: true })
    );

  // ✅ 프롬프트 문구(날짜 선택/해제)가 바뀔 때 안내 버블 추가
  useEffect(() => {
    const now = Date.now();
    setMsgs((prev) => [
      ...prev,
      { id: `p-${now}`, role: "agent", text: prompt, ts: now },
    ]);
    scrollEnd();
  }, [prompt]);

  // ✅ 실제 전송 로직 (QueryInput에서 텍스트를 받음)
  const handleSend = (raw: string) => {
    const text = raw.trim();
    if (!text) return;

    const now = Date.now();
    const userMsg: Msg = {
      id: `u-${now}`,
      role: "user",
      text,
      ts: now,
    };

    // 1) 유저 메시지 추가
    setMsgs((prev) => [...prev, userMsg]);
    scrollEnd();

    // 2) 일정 생성 모드라면 상위(index)로 전달 → 카테고리/투두 모달 띄우는 용도
    if (enableCreate) {
      onSubmit(text);
    }

    // 3) 상담 모드가 아니면(= enableReply가 false면) 여기서 끝
    if (!enableReply) return;

    // 4) 상담 모드일 때는 더미 에이전트 답장
    setTyping(true);
    setTimeout(() => {
      const a: Msg = {
        id: `a-${Date.now()}`,
        role: "agent",
        text: pick(DUMMY),
        ts: Date.now(),
      };
      setMsgs((prev) => [...prev, a]);
      setTyping(false);
      scrollEnd();
    }, 450 + Math.round(Math.random() * 400));
  };

  const renderItem = ({ item }: { item: Msg }) => {
    const isAgent = item.role === "agent";
    return (
      <View style={[styles.row, isAgent ? styles.left : styles.right]}>
        <View style={[styles.bubble, isAgent ? styles.agent : styles.user]}>
          <Text
            style={[
              styles.txt,
              isAgent ? styles.agentTxt : styles.userTxt,
            ]}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.panel}>
        {/* 위쪽 대화 로그 영역 */}
        <FlatList
          ref={listRef}
          data={msgs.slice(-6)} // 최근 6개만
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 6 }}
          style={{ maxHeight: 150 }}
          onContentSizeChange={scrollEnd}
        />
        {typing && <Text style={styles.typing}>입력 중…</Text>}

        {/* ✅ 아래 예쁜 인풋바: QueryInput 재사용 */}
        <QueryInput
          onAddTodo={handleSend}     // 엔터/버튼 클릭 시 호출
          onExpand={scrollEnd}       // 탭 시 위로 확장할 게 있으면 나중에 활용
          placeholder={prompt}       // 날짜 선택 여부에 따라 문구 변경
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  panel: {
    width: "100%",
    backgroundColor: "#0F0F10",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 0, // 아래 QueryInput 자체 패딩이 있어서 0으로 둬도 됨
  },
  row: {
    width: "100%",
    marginBottom: 8,
    flexDirection: "row",
  },
  left: { justifyContent: "flex-start" },
  right: { justifyContent: "flex-end" },
  bubble: {
    maxWidth: "82%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
  },
  agent: {
    backgroundColor: "#1C1C1F",
    borderTopLeftRadius: 4,
  },
  user: {
    backgroundColor: "#4C8BF5",
    borderTopRightRadius: 4,
  },
  txt: {
    fontSize: 14.5,
    lineHeight: 20,
  },
  agentTxt: {
    color: "#EDEDED",
  },
  userTxt: {
    color: "#fff",
  },
  typing: {
    color: "#bbb",
    marginLeft: 4,
    marginBottom: 4,
    fontSize: 12,
  },
});
