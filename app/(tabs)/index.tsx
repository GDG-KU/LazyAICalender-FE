import QueryInput from "@/components/todo-query-input";

import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

// 화면 너비 계산
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
// console.log(screenHeight);
// 스크린 전체 높이 896

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
  const insets = useSafeAreaInsets();
  //const usableHeight = screenHeight - insets.top - insets.bottom;
  const safeAreaHeight = insets.top;
  // console.log("실제 렌더링 가능한 높이:", usableHeight, insets.top);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    // setContainerHeight(height);
    console.log("Container height:", height);
  };

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
        <View
          key={`prev-${i}`}
          style={[
            styles.dayCell,
            { height: (screenHeight - 83 - 240.5 - safeAreaHeight) / 6 },
          ]}
        >
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
          style={[
            styles.dayCell,
            { height: (screenHeight - 83 - 240.5 - safeAreaHeight) / 6 },
            ////          896.     하단 tab 기타 값   노치
            isToday && styles.todayCell,
          ]}
        >
          <Text style={[styles.dayText, isToday && styles.todayText]}>{i}</Text>

          <View style={styles.todoContainer}>
            <Text key={1} style={styles.todoText}>
              todos
            </Text>

            <Text key={2} style={styles.todoText}>
              todos
            </Text>
            <Text key={3} style={styles.todoText}>
              todos
            </Text>
            <Text key={4} style={styles.todoText}>
              todos
            </Text>
          </View>
        </View>
      );
    }

    // 다음 달 날짜
    if (lastDay !== 6) {
      const trailingDays = 6 - lastDay;
      for (let i = 1; i <= trailingDays; i++) {
        days.push(
          <View
            key={`next-${i}`}
            style={[
              styles.dayCell,
              { height: (screenHeight - 83 - 240.5 - safeAreaHeight) / 6 },
            ]}
          >
            <Text style={styles.dayTextInactive}>{i}</Text>
          </View>
        );
      }
    }

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          {/* <TouchableOpacity
            onPress={handlePrevious}
            style={styles.navButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Optional: Increases the tappable area
          >
            <Text style={styles.navText}>{"<"}</Text>
          </TouchableOpacity> */}
          <View style={styles.monthYearContainer}>
            <Text style={styles.monthText}>{monthNames[month]}</Text>
            <Text style={styles.yearText}>{year}</Text>
          </View>
          {/* <TouchableOpacity
            onPress={handleNext}
            style={styles.navButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.navText}>{">"}</Text>
          </TouchableOpacity> */}
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
      <SafeAreaView style={styles.container} onLayout={handleLayout}>
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

        <QueryInput />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // 완전히 white로 하면 background가 안 보임
    backgroundColor: "#888",
    alignItems: "center",
    // justifyContent: "center",
    // 5주, 6주에 따른 높이가 다르기 때문에
    // calendarGrid를 세로 중앙 정렬시키는 justifyContent를 삭제하고
    // padding??으로 styles.card을 아래로 밀어줌
    // paddingTop으로 밀어주면 StatusBar를 가림
    // paddingTop: 30,
    // marginTop: 50,
  },
  card: {
    backgroundColor: "#000",
    // borderRadius: 24,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.1,
    // shadowRadius: 10,
    // elevation: 8,

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
  navButton: {
    padding: 8,
    borderRadius: 9999, // A large value for a circle
  },
  navText: {
    fontSize: 24,
    color: "#4b5563",
  },
  monthYearContainer: {
    alignItems: "center",
  },
  monthText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
  },
  yearText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
    marginTop: 4,
  },
  dayNameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayNameCell: {
    // flex: 1,
    alignItems: "center",
    padding: 8,
    //marginVertical: 10,

    //added
    width: "14.28%",
  },
  dayNameText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    textTransform: "uppercase",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  dayCell: {
    width: "14.28%", // 100% / 7 days

    // 이걸 줘서 최하단에 예상하지 않은 추가 공백이 생김
    // aspectRatio: 1, // To make the cells square
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 8,
    borderRadius: 9999,

    // added
    // 여기가 각 날짜의 세로 간격 벌리는 곳
    // marginVertical: 20,
    // marginBottom: 60,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  todayCell: {
    backgroundColor: "tomato",
  },
  todayText: {
    color: "white",
  },
  dayTextInactive: {
    fontSize: 16,
    fontWeight: "500",
    color: "#9ca3af",
  },
  todoContainer: {
    marginTop: 4,
    alignItems: "center",
    zIndex: 3,
    backgroundColor: "#6b7280",
  },
  todoText: {
    fontSize: 15,
    color: "#fff",
  },
});
