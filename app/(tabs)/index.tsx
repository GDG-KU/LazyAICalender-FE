import QueryInput from "@/components/todo-query-input";

import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// 화면 너비 계산
const screenWidth = Dimensions.get("window").width;

// 월 및 요일 이름
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// 기준 월 인덱스
const INITIAL_INDEX = 1000;

// 달력 컴포넌트
export default function Calendar() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(INITIAL_INDEX);

  const baseDate = new Date();

  // 특정 인덱스로부터 날짜 생성
  const getDateFromIndex = (index: number) => {
    const date = new Date(baseDate);
    date.setMonth(date.getMonth() + (index - INITIAL_INDEX));
    return date;
  };

  // 날짜 관련 유틸 함수
  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const getDaysInPrevMonth = (year: number, month: number) =>
    new Date(year, month, 0).getDate();

  // 달력 렌더링
  const renderCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInPrevMonth = getDaysInPrevMonth(year, month);
    const lastDay = new Date(year, month, daysInMonth).getDay();

    const days = [];

    // 이전 달 날짜
    for (let i = firstDay; i > 0; i--) {
      days.push(
        <View key={`prev-${i}`} style={styles.dayCell}>
          <Text style={styles.dayTextInactive}>{daysInPrevMonth - i + 1}</Text>
        </View>
      );
    }

    // 현재 달 날짜
    for (let i = 1; i <= daysInMonth; i++) {
      const today = new Date();
      const isToday =
        i === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      days.push(
        <View
          key={`current-${i}`}
          style={[styles.dayCell, isToday && styles.todayCell]}
        >
          <Text style={[styles.dayText, isToday && styles.todayText]}>{i}</Text>
        </View>
      );
    }

    // 다음 달 날짜
    if (lastDay !== 6) {
      const trailingDays = 6 - lastDay;
      for (let i = 1; i <= trailingDays; i++) {
        days.push(
          <View key={`next-${i}`} style={styles.dayCell}>
            <Text style={styles.dayTextInactive}>{i}</Text>
          </View>
        );
      }
    }

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.monthYearContainer}>
            <Text style={styles.monthText}>{monthNames[month]}</Text>
            <Text style={styles.yearText}>{year}</Text>
          </View>
        </View>

        <View style={styles.dayNameContainer}>
          {dayNames.map((day) => (
            <View key={day} style={styles.dayNameCell}>
              <Text style={styles.dayNameText}>{day}</Text>
            </View>
          ))}
        </View>

        <View style={styles.calendarGrid}>{days}</View>
      </View>
    );
  };

  // 뷰 변경 시 월 인덱스 업데이트
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const index = viewableItems[0].index ?? INITIAL_INDEX;
        setCurrentMonthIndex(index);
      }
    }
  ).current;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />

        {/* 월별 스크롤 가능한 달력 */}
        <FlatList
          data={Array.from({ length: 2000 })}
          horizontal
          pagingEnabled
          initialScrollIndex={INITIAL_INDEX}
          getItemLayout={(_, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ index }) => {
            const date = getDateFromIndex(index);
            return (
              <View style={{ width: screenWidth }}>{renderCalendar(date)}</View>
            );
          }}
        />

        {/* 할 일 입력 */}
        <QueryInput />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#888",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    paddingVertical: 24,
    paddingHorizontal: 6,
    width: screenWidth,
    maxWidth: 600,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  monthYearContainer: {
    alignItems: "center",
  },
  monthText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },
  yearText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#6b7280",
    marginTop: 4,
  },
  dayNameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayNameCell: {
    alignItems: "center",
    padding: 8,
    width: "14.28%",
  },
  dayNameText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  dayCell: {
    width: "14.28%",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderRadius: 9999,
    marginBottom: 60,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  todayCell: {
    backgroundColor: "#4f46e5",
  },
  todayText: {
    color: "white",
  },
  dayTextInactive: {
    fontSize: 16,
    fontWeight: "500",
    color: "#9ca3af",
  },
});
