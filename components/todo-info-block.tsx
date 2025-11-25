// React 라이브러리 import (JSX 사용을 위해 필요)
import React from "react";
// React Native의 UI 컴포넌트들 import
import { Pressable, StyleSheet, Text, View } from "react-native";

// ===== 투두 아이템 데이터 타입 정의 =====
// 투두 아이템의 데이터 구조를 정의하는 인터페이스
export interface TodoItem {
  id: string; // 투두의 고유 식별자 (각 투두를 구분하기 위한 유니크한 값)
  text: string; // 투두의 내용 텍스트 (사용자가 입력한 할 일 내용)
  completed: boolean; // 완료 여부 (true = 완료됨, false = 미완료)
  category: string; // 카테고리 정보 (예: "업무", "개인", "건강" 등)
  time?: string; // 예정 시간 (예: "오후 5시") - ?는 선택적 속성임을 의미
}

// ===== TodoBlock 컴포넌트 Props 타입 정의 =====
// TodoBlock 컴포넌트가 부모 컴포넌트로부터 받을 데이터의 구조를 정의
interface TodoBlockProps {
  todo: TodoItem; // 표시할 투두 데이터 객체 (TodoItem 타입)
  onToggleTodo: (id: string) => void; // 체크박스 클릭 시 호출될 함수 (투두 id를 매개변수로 받음)
  onLongPressTodo?: (id: string) => void; // 해당 투두 길게 클릭 시 호출 함수
}

// ===== TodoBlock 컴포넌트 (메인 컴포넌트) =====
// 개별 투두 아이템을 표시하는 컴포넌트
// props: todo(투두 데이터), onToggleTodo(완료 상태 토글 함수), onLongPressTodo(투두 길게 클릭 함수)
export default function TodoInfoBlock({
  todo,
  onToggleTodo,
  onLongPressTodo,
}: TodoBlockProps) {
  return (
    <Pressable
      onLongPress={() => onLongPressTodo?.(todo.id)}
      delayLongPress={300} // 선택: 길게 누르기 지연 (ms)
    >
      <View style={styles.todoBlock}>
        {/* ===== 체크박스 영역 (터치 가능) ===== */}
        <Pressable
          style={[styles.checkbox, todo.completed && styles.checkedBox]}
          onPress={() => onToggleTodo(todo.id)}
        >
          {todo.completed && <Text style={styles.checkmark}>✓</Text>}
        </Pressable>

        {/* ===== 투두 텍스트 영역 ===== */}
        <View style={styles.todoInfoWrapper}>
          <Text
            style={[styles.todoText, todo.completed && styles.completedText]}
          >
            {todo.text}
          </Text>

          {/* ===== 시간 표시 영역 (조건부 렌더링) ===== */}
          {todo.time && <Text style={styles.timeText}>{todo.time}</Text>}
        </View>
      </View>
    </Pressable>
  );
}

// ===== 스타일 정의 =====
// StyleSheet.create를 사용하여 컴포넌트의 스타일을 정의
const styles = StyleSheet.create({
  // ===== 투두 블록 전체 컨테이너 스타일 =====
  todoBlock: {
    width: "100%",
    flexDirection: "row", // 자식 요소들(체크박스, 텍스트, 시간)을 가로로 배열
    alignItems: "center", // 자식 요소들을 세로 중앙 정렬
    backgroundColor: "#FFF", // 밝은 회색 배경색 (투두 아이템의 배경)
    height: 54,
    paddingHorizontal: 16, // 좌우 내부 여백 16px
    paddingVertical: 8, // 상하 내부 여백 12px
    // marginBottom: 8, // 아래쪽 외부 여백 8px (다음 투두와의 간격)
    // marginHorizontal: 16, // 좌우 외부 여백 16px (화면 가장자리와의 간격)
    gap: 12,
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#AC95F5",
  },
  todoInfoWrapper: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    // flexGrow: 1, // Corresponds to the '1' in flex: 1 0 0;

    // flexBasis: 0,
    flex: 1,
  },
  // ===== 체크박스 스타일 =====
  checkbox: {
    width: 24, // 체크박스 너비 20px
    height: 24, // 체크박스 높이 20px
    borderRadius: 12, // 완전히 둥근 모양 (원형 체크박스)
    borderWidth: 2, // 테두리 두께 2px
    borderColor: "#E6E6E6", // 연한 회색 테두리 (미완료 상태)
    backgroundColor: "white", // 배경색 흰색 (미완료 상태)
    justifyContent: "center", // 체크마크를 가로 중앙 정렬
    alignItems: "center", // 체크마크를 세로 중앙 정렬
    // marginRight: 12, // 오른쪽 여백 12px (투두 텍스트와의 간격)
    gap: 12,
    padding: 5,
  },
  // ===== 완료된 체크박스 스타일 =====
  checkedBox: {
    backgroundColor: "#AC95F5", // 진한 회색 배경 (완료 상태)
    borderColor: "#AC95F5", // 진한 회색 테두리 (완료 상태)
  },
  // ===== 체크마크(✓) 텍스트 스타일 =====
  checkmark: {
    color: "white", // 흰색 텍스트 (진한 배경에 잘 보이도록)
    fontSize: 12, // 폰트 크기 12px
    fontWeight: "bold", // 굵은 글씨 (체크마크가 더 명확하게 보이도록)
  },
  // ===== 투두 텍스트 스타일 =====
  todoText: {
    flex: 1, // 남은 공간을 모두 차지 (체크박스와 시간 사이의 공간)
    fontSize: 16, // 폰트 크기 16px
    color: "#1F2937", // 진한 회색 텍스트 (가독성을 위한 색상)
    fontWeight: "500", // 중간 굵기 폰트 (적당한 두께)
  },
  // ===== 완료된 투두 텍스트 스타일 =====
  completedText: {
    textDecorationLine: "line-through", // 취소선 그리기 (완료된 투두임을 시각적으로 표시)
    color: "#9CA3AF", // 연한 회색으로 변경 (완료된 투두는 흐리게 표시)
  },
  // ===== 시간 텍스트 스타일 =====
  timeText: {
    fontSize: 14, // 폰트 크기 14px (투두 텍스트보다 작게)
    color: "#9CA3AF", // 연한 회색 시간 텍스트 (보조 정보임을 나타냄)
    fontWeight: "400", // 일반 굵기 폰트 (투두 텍스트보다 얇게)
  },
});
