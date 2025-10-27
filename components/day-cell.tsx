import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface DayCellProps {
  monthPosition: "prev" | "current" | "next";
  date: number;
  isToday: boolean;
  daysInPrevMonth: number;
  onDateClick?: (date: Date) => void; // 날짜 클릭 시 호출될 함수 (선택적)
  selectedDate?: Date; // 현재 선택된 날짜 (선택적)
  calendarDate?: Date; // 달력이 표시하는 날짜 (년월 정보)
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
  // ===== 날짜 클릭 핸들러 =====
  // 사용자가 날짜를 클릭했을 때 호출되는 함수
  const handlePress = () => {
    if (onDateClick && monthPosition === "current" && calendarDate) {
      // 달력이 표시하는 년월을 기준으로 날짜 생성
      const clickedDate = new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth(),
        date
      );
      onDateClick(clickedDate);
    }
  };

  // ===== 선택된 날짜 확인 =====
  // 현재 날짜가 선택된 날짜와 일치하는지 확인
  const isSelected =
    selectedDate &&
    selectedDate.getDate() === date &&
    calendarDate &&
    selectedDate.getMonth() === calendarDate.getMonth() &&
    selectedDate.getFullYear() === calendarDate.getFullYear() &&
    monthPosition === "current";

  return (
    <View key={`${monthPosition}-${date}`} style={styles.dayCell}>
      <Pressable
        style={[
          styles.dayContainer,
          isToday && styles.todayContainer, // 오늘 날짜 스타일 (진한 회색)
          isSelected && styles.selectedContainer, // 선택된 날짜 스타일 (검은색)
        ]}
        // 달력에서 날짜 선택할 수 있는 터치 영역이 너무 좁아 hitSlop 추가함
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        onPress={handlePress}
        disabled={monthPosition !== "current"} // 현재 달이 아닌 날짜는 클릭 비활성화
      >
        <Text
          style={[
            monthPosition === "current"
              ? styles.dayText
              : styles.dayTextInactive,
            isToday && styles.todayText, // 오늘 날짜 텍스트 스타일
            isSelected && styles.selectedText, // 선택된 날짜 텍스트 스타일
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
    // height: `${100/5}%`,로 추후 변경

    // 이걸 줘서 최하단에 예상하지 않은 추가 공백이 생김
    // aspectRatio: 1, // To make the cells square
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 4,
    // borderRadius: 9999,
    borderTopWidth: 1,
    borderTopColor: "#D9D9D9",
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
    backgroundColor: "#6B7280", // 진한 회색 배경 (기존 검은색에서 변경)
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
    color: "white", // 오늘 날짜 텍스트는 흰색
  },
  // ===== 선택된 날짜 스타일 (검은색) =====
  selectedContainer: {
    backgroundColor: "#000000", // 검은색 배경
    borderRadius: 12,
  },
  selectedText: {
    color: "white", // 선택된 날짜 텍스트는 흰색
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
