import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface DayCellProps {
  monthPosition: "prev" | "current" | "next";
  date: number;
  isToday: boolean;
  daysInPrevMonth: number;
  onDateClick?: (date: Date) => void;
  selectedDate?: Date;
  calendarDate?: Date;
}

export default function DayCell({
  monthPosition,
  date,
  isToday,
  daysInPrevMonth,
  onDateClick,
  selectedDate,
  calendarDate,
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
        {/* 날짜 원 */}
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
          <View style={styles.todoItem} />
          <View style={styles.todoItem} />
          <View style={styles.todoItem} />
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
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
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
    justifyContent: "flex-start",
    alignItems: "center",
    // marginTop: 4,
    backgroundColor: "#13579A",
  },

  todoItem: {
    width: "80%",
    flex: 1, // todoContainer 높이에 따라 균등 분배
    maxHeight: 16, // 높이 제한
    borderRadius: 2,
    backgroundColor: "#358912",
    marginBottom: 2,
    // 마지막 요소는 marginBottom을 1로 줘야 하마
  },
});
