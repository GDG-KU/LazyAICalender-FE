// React 라이브러리 import (JSX 사용을 위해 필요)
import React from "react";
// React Native의 UI 컴포넌트들 import
import { ScrollView, StyleSheet, Text, View } from "react-native";
// 투두 관련 컴포넌트와 타입 import
import TodoBlock, { TodoItem } from "./todo-block";

// ===== CategoryTodoList 컴포넌트 Props 타입 정의 =====
// CategoryTodoList 컴포넌트가 부모 컴포넌트로부터 받을 데이터의 구조를 정의
interface CategoryTodoListProps {
  todos: TodoItem[]; // 표시할 투두 배열
  onToggleTodo: (id: string) => void; // 투두 완료 상태 토글 함수
}

// ===== 카테고리별 투두 그룹화 함수 =====
// 투두 배열을 카테고리별로 그룹화하여 반환하는 함수
const groupTodosByCategory = (
  todos: TodoItem[]
): Record<string, TodoItem[]> => {
  return todos.reduce((groups, todo) => {
    const category = todo.category; // 투두의 카테고리

    // 해당 카테고리가 없으면 빈 배열로 초기화
    if (!groups[category]) {
      groups[category] = [];
    }

    // 해당 카테고리에 투두 추가
    groups[category].push(todo);

    return groups;
  }, {} as Record<string, TodoItem[]>);
};

// ===== CategoryTodoList 컴포넌트 (메인 컴포넌트) =====
// 카테고리별로 그룹화된 투두 리스트를 표시하는 컴포넌트
export default function CategoryTodoList({
  todos,
  onToggleTodo,
}: CategoryTodoListProps) {
  // ===== 카테고리별 투두 렌더링 함수 =====
  // 카테고리별로 그룹화된 투두를 렌더링하는 함수
  const renderTodosByCategory = () => {
    const groupedTodos = groupTodosByCategory(todos); // 카테고리별로 그룹화

    // 투두가 없는 경우 빈 상태 표시
    if (todos.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            이 날짜에는 등록된 할 일이 없습니다
          </Text>
        </View>
      );
    }

    // 카테고리별로 렌더링
    return Object.entries(groupedTodos).map(([category, categoryTodos]) => (
      <View key={category} style={styles.categoryGroup}>
        {/* 카테고리 헤더 */}
        <Text style={styles.categoryTitle}>{category}</Text>
        {/* 해당 카테고리의 투두들 */}
        {categoryTodos.map((todo) => (
          <TodoBlock key={todo.id} todo={todo} onToggleTodo={onToggleTodo} />
        ))}
      </View>
    ));
  };

  return (
    <ScrollView
      contentContainerStyle={styles.todoListContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 카테고리별 렌더링 함수 호출 */}
      {renderTodosByCategory()}
    </ScrollView>
  );
}

// ===== 스타일 정의 =====
// StyleSheet.create를 사용하여 컴포넌트의 스타일을 정의
const styles = StyleSheet.create({
  // ===== 투두 리스트 컨테이너 스타일 =====
  todoListContainer: {
    paddingTop: 16, // 상단 여백 (투두 리스트와 달력 사이 간격)
    paddingBottom: 100, // 하단 여백 (하단 입력창과 겹치지 않도록 공간 확보)
    gap: 16,
  },
  // ===== 카테고리 그룹 스타일 =====
  categoryGroup: {
    // marginBottom: 20, // 카테고리 그룹 간의 여백
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
  },
  // ===== 카테고리 제목 스타일 =====
  categoryTitle: {
    fontSize: 14, // 폰트 크기 (투두 텍스트보다 크게)
    lineHeight: 14 * 1.2,
    fontWeight: 500,
    color: "#000",
  },
  // ===== 빈 상태 컨테이너 스타일 =====
  emptyStateContainer: {
    flex: 1, // 남은 공간을 모두 차지
    justifyContent: "center", // 세로 중앙 정렬
    alignItems: "center", // 가로 중앙 정렬
    paddingHorizontal: 32, // 좌우 패딩
  },
  emptyStateText: {
    fontSize: 16, // 폰트 크기
    color: "#9CA3AF", // 연한 회색 텍스트
    textAlign: "center", // 가운데 정렬
    lineHeight: 24, // 줄 간격
  },
});
