import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import TodoCalendarBlock from "./todo-calendar-block";

interface TodoItem {
  id: string; // 투두의 고유 식별자 (각 투두를 구분하기 위한 유니크한 값)
  text: string; // 투두의 내용 텍스트 (사용자가 입력한 할 일 내용)
  completed: boolean; // 완료 여부 (true = 완료됨, false = 미완료)
  category: string; // 카테고리 정보 (예: "업무", "개인", "건강" 등)
  time?: string; // 예정 시간 (예: "오후 5시") - ?는 선택적 속성임을 의미
}

interface DayCellProps {
  monthPosition: "prev" | "current" | "next";
  date: number;
  isToday: boolean;
  daysInPrevMonth: number;
  onDateClick?: (date: Date) => void;
  selectedDate?: Date;
  calendarDate?: Date;
  todos: TodoItem[];
}

export default function DayCell({
  monthPosition,
  date,
  isToday,
  daysInPrevMonth,
  onDateClick,
  selectedDate,
  calendarDate,
  todos,
}: DayCellProps) {
  // 클릭 핸들러
  const handlePress = () => {
    if (onDateClick && monthPosition === "current" && calendarDate) {
      const clickedDate = new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth(),
        date
      );
      onDateClick(clickedDate);
    }
  };

  // 선택된 날짜 여부
  const isSelected =
    selectedDate &&
    selectedDate.getDate() === date &&
    calendarDate &&
    selectedDate.getMonth() === calendarDate.getMonth() &&
    selectedDate.getFullYear() === calendarDate.getFullYear() &&
    monthPosition === "current";

  const todosCnt = todos?.length ?? 0;
  // if (todos != undefined) console.log(todos[0], todos.length, "\n");
  // 위 로직으로 todos와 length를 받아올 수 있음

  const renderTodos = () => {
    if (todosCnt === 0) return null;
    else if (todosCnt <= 3) {
      todos.map((todo) => {
        <TodoCalendarBlock />;
        // {"category": "건강", "completed": false, "id": "4", "text": "병원 예약", "time": "오전 10시"}
        // todo 색상 list
        // "#AC95F5"
        // "#ED5755"
        // "#FDBEAD"
        // "#14AE5D"
      });
    } else {
    }
  };

  return (
    <Pressable
      key={`${monthPosition}-${date}`}
      style={styles.dayCellPressable}
      onPress={handlePress}
      disabled={monthPosition !== "current"}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
      {/* 날짜 + todo 영역 flex 배치 */}
      <View style={styles.dayContent}>
        <View
          style={[
            styles.dateCircle,
            isToday && styles.todayContainer,
            isSelected && styles.selectedContainer,
          ]}
        >
          <Text
            style={[
              monthPosition === "current"
                ? styles.dayText
                : styles.dayTextInactive,
              isToday && styles.todayText,
              isSelected && styles.selectedText,
            ]}
          >
            {monthPosition === "prev" ? daysInPrevMonth - date + 1 : date}
          </Text>
        </View>
        {/* todo 영역 */}
        <View style={styles.todoContainer}>
          {/* {todosCnt !== 0 ? (
            <>
              <TodoCalendarBlock />
              <TodoCalendarBlock />
              <TodoCalendarBlock />
            </>
          ) : null} */}
          {/* {renderTodos()} */}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dayCellPressable: {
    width: "14.28%", // 100% / 7
    height: "16.66%", // 100% / 6 rows
    justifyContent: "flex-start", // 위쪽부터 쌓기
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#D9D9D9",
    paddingHorizontal: 2,
  },

  dayContent: {
    flex: 1, // 셀 전체 높이를 사용
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  dateCircle: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  todayContainer: {
    backgroundColor: "#6B7280",
  },
  todayText: {
    color: "white",
  },

  selectedContainer: {
    backgroundColor: "#000000",
  },
  selectedText: {
    color: "white",
  },

  dayText: {
    fontSize: 11,
    lineHeight: 11 * 1.4,
    textAlign: "center",
    fontWeight: "400",
    color: "#1E1E1E",
  },
  dayTextInactive: {
    fontSize: 11,
    lineHeight: 11 * 1.4,
    textAlign: "center",
    fontWeight: "400",
    color: "#9ca3af",
  },
  todoContainer: {
    flex: 1, // 남은 공간 모두 차지
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 4,
    // backgroundColor: "#13579A",
  },
});
