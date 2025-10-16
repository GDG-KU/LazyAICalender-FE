import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";

// type MonthPosition = "prev" | "current" | "next";

interface DayCellProps {
  // MonthPosition: MonthPosition;
  monthPosition: "prev" | "current" | "next";
  date: number;
  isToday: boolean;
  daysInPrevMonth: number;
  onDateClick?: (date: Date) => void;  // 날짜 클릭 시 호출될 함수 (선택적)
  selectedDate?: Date;                 // 현재 선택된 날짜 (선택적)
}

export default function DayCell({
  monthPosition,
  date,
  isToday,
  daysInPrevMonth,
  onDateClick,
  selectedDate,
}: DayCellProps) {
  // ===== 날짜 클릭 핸들러 =====
  // 사용자가 날짜를 클릭했을 때 호출되는 함수
  const handlePress = () => {
    if (onDateClick && monthPosition === "current") {
      // 현재 달의 날짜만 클릭 가능하도록 제한
      const currentDate = new Date();
      const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), date);
      onDateClick(clickedDate);
    }
  };

  // ===== 선택된 날짜 확인 =====
  // 현재 날짜가 선택된 날짜와 일치하는지 확인
  const isSelected = selectedDate && 
    selectedDate.getDate() === date && 
    selectedDate.getMonth() === new Date().getMonth() && 
    selectedDate.getFullYear() === new Date().getFullYear() &&
    monthPosition === "current";

  return (
    <View key={`${monthPosition}-${date}`} style={styles.dayCell}>
      <Pressable
        style={[
          styles.dayContainer, 
          isToday && styles.todayContainer,        // 오늘 날짜 스타일 (진한 회색)
          isSelected && styles.selectedContainer   // 선택된 날짜 스타일 (검은색)
        ]}
        onPress={handlePress}
        disabled={monthPosition !== "current"}  // 현재 달이 아닌 날짜는 클릭 비활성화
      >
        <Text
          style={[
            monthPosition === "current"
              ? styles.dayText
              : styles.dayTextInactive,
            isToday && styles.todayText,          // 오늘 날짜 텍스트 스타일
            isSelected && styles.selectedText,    // 선택된 날짜 텍스트 스타일
          ]}
        >
          {monthPosition === "prev" ? daysInPrevMonth - date + 1 : date}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  dayCell: {
    width: "14.28%", // 100% / 7 days
    height: "16.66%",
    // 이걸 줘서 최하단에 예상하지 않은 추가 공백이 생김
    // aspectRatio: 1, // To make the cells square
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 4,
    // borderRadius: 9999,
  },
  dayContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    // verticalAlign: "middle",
    // paddingHorizontal: 8,
    // paddingVertical: 4,
  },
  // ===== 오늘 날짜 스타일 (진한 회색) =====
  todayContainer: {
    backgroundColor: "#6B7280",  // 진한 회색 배경 (기존 검은색에서 변경)
    borderRadius: 12,
  },
  dayText: {
    fontSize: 11,
    lineHeight: 11 * 1.4,
    // width, height를 고정하니 dayText 정렬이 안됨
    // width: 15,
    // height: 15,
    textAlign: "center",
    fontWeight: "400",
    color: "#1E1E1E",
  },
  todayText: {
    color: "white",              // 오늘 날짜 텍스트는 흰색
  },
  // ===== 선택된 날짜 스타일 (검은색) =====
  selectedContainer: {
    backgroundColor: "#000000",  // 검은색 배경
    borderRadius: 12,
  },
  selectedText: {
    color: "white",              // 선택된 날짜 텍스트는 흰색
  },
  dayTextInactive: {
    fontSize: 11,
    lineHeight: 11 * 1.4,
    textAlign: "center",
    fontWeight: "400",
    // width: 5,
    // height: 15,
    color: "#9ca3af",
  },
});
