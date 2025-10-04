import React from "react";
import { StyleSheet, Text, View } from "react-native";

// type MonthPosition = "prev" | "current" | "next";

interface DayCellProps {
  // MonthPosition: MonthPosition;
  monthPosition: "prev" | "current" | "next";
  date: number;
  isToday: boolean;
  daysInPrevMonth: number;
}

export default function DayCell({
  monthPosition,
  date,
  isToday,
  daysInPrevMonth,
}: DayCellProps) {
  return (
    <View key={`${monthPosition}-${date}`} style={styles.dayCell}>
      <View style={[styles.dayContainer, isToday && styles.todayContainer]}>
        <Text
          style={[
            monthPosition === "current"
              ? styles.dayText
              : styles.dayTextInactive,
            isToday && styles.todayText,
          ]}
        >
          {monthPosition === "prev" ? daysInPrevMonth - date + 1 : date}
        </Text>
      </View>
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
  todayContainer: {
    backgroundColor: "#2C2C2C",
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
    backgroundColor: "#2C2C2C",
    color: "white",
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
