import QueryInput from "@/components/query-input";
import SettingButton from "@/components/ui/setting-button";

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

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const monthNames = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
];
const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

// 기준 월(오늘 날짜가 속한 달)의 index
const INITIAL_INDEX = 1000;

export default function Calendar() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(INITIAL_INDEX);

  // containerHeight: 최상단 SafeAreaView의 디스플레이 세로 픽셀 값 / _layout.tsx의 <Tabs> 높이 제외
  const [containerHeight, setContainerHeight] = useState(0);
  // 상단 notch 부분 높이
  const safeAreaHeight = useSafeAreaInsets().top;
  //
  const etcHeightPixels = 187;

  // SafeAreaView 구성 요소가 렌더링되고 React Native 엔진에 의해 레이아웃이 계산된 후 정확한 높이를 logging
  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setContainerHeight(height);
  };

  const baseDate = new Date();

  // 특정 인덱스에 대응되는 날짜 생성
  const getDateFromIndex = (index: number) => {
    const date = new Date(baseDate);
    date.setMonth(date.getMonth() + (index - INITIAL_INDEX));
    return date;
  };

  // 날짜 관련 함수
  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const getDaysInPrevMonth = (year: number, month: number) =>
    new Date(year, month, 0).getDate();

  // 스와이프로 달력 월 변경 시 index 업데이트
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const index = viewableItems[0].index ?? INITIAL_INDEX;
        setCurrentMonthIndex(index);
      }
    }
  ).current;

  // 달력 렌더링
  const renderCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInPrevMonth = getDaysInPrevMonth(year, month);
    const lastDay = new Date(year, month, daysInMonth).getDay();

    const days = [];

    // 이전 달의 날짜 component 추가
    for (let i = firstDay; i > 0; i--) {
      days.push(
        <View
          key={`prev-${i}`}
          style={[
            styles.dayCell,
            {
              // 화면 세로 픽셀 - 상단 노치 - 기타 padding, margin 등으로
              // 렌더링할 수 없는 부분 제외하고 날짜 칸의 높이가 최대가 되도록 계산
              // height: (containerHeight - safeAreaHeight - etcHeightPixels) / 6,
            },
          ]}
        >
          <View style={styles.dayContainer}>
            <Text style={styles.dayTextInactive}>
              {daysInPrevMonth - i + 1}
            </Text>
          </View>
        </View>
      );
    }

    // 현재 달 날짜 component 추가
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
            {
              // height: (containerHeight - safeAreaHeight - etcHeightPixels) / 6,
            },
            // ,isToday && styles.todayCell,
          ]}
        >
          <View style={[styles.dayContainer, isToday && styles.todayContainer]}>
            <Text style={[styles.dayText, isToday && styles.todayText]}>
              {i}
            </Text>
          </View>
          {/* <View style={styles.dailytodoContainer}>
            <Text key={1} style={styles.todoText}>
              todo
            </Text>
            <Text key={2} style={styles.todoText}>
              todo
            </Text>
            <Text key={3} style={styles.todoText}>
              todo
            </Text>
          </View> */}
        </View>
      );
    }

    // 다음 달의 날짜 component 추가
    if (lastDay !== 6) {
      // 이번 달이 토요일로 끝나지 않으면
      const trailingDays = 6 - lastDay;
      for (let i = 1; i <= trailingDays; i++) {
        days.push(
          <View
            key={`next-${i}`}
            style={[
              styles.dayCell,
              // {
              //   height:
              //     (containerHeight - safeAreaHeight - etcHeightPixels) / 6,
              // },
            ]}
          >
            <View style={styles.dayContainer}>
              <Text style={styles.dayTextInactive}>{i}</Text>
            </View>
          </View>
        );
      }
    }

    // 실제 calendar view를 구성하는 부분
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          {/* <View style={styles.monthYearContainer}> */}
          <Text style={styles.monthText}>{monthNames[month]}</Text>
          {/* </View> */}
          <SettingButton />
        </View>
        <View style={styles.dayNameContainer}>
          {dayNames.map((day) => (
            <View key={day} style={styles.dayNameCell}>
              <Text
                style={[styles.dayNameText, day === "일" && styles.sundayText]}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.calendarGrid}>{days}</View>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} onLayout={handleLayout}>
        {/* 월별 횡 스크롤 가능한 달력 */}
        <View style={styles.calendarWrapper}>
          <FlatList
            data={Array.from({ length: 2000 })}
            // horizontal: 횡 방향으로의 list 나열
            horizontal
            // pagingEnabled: 스와이프 시 전/후 월로 전환하는 props
            pagingEnabled
            // initialScrollIndex: 현재 월 기준으로 초기 달이 보이도록 설정
            initialScrollIndex={INITIAL_INDEX}
            // getItemLayout: 각 달의 달력 가로 길이는 모두 동일하므로 미리 계산하여 계산량 줄임
            getItemLayout={(_, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
            showsHorizontalScrollIndicator={false}
            // onViewableItemsChanged: 횡 스크롤로 보여야 하는 index가 바뀔 경우 trigger됨
            onViewableItemsChanged={onViewableItemsChanged}
            // viewabilityConfig: item이 언제 viewable하다고 결정할 지 정하는 부분
            // 횡스크롤하여 50% 이상 보일 때 'viewable'하다고 설정
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            keyExtractor={(_, index) => index.toString()}
            // renderItem: index 변화 시 실제 보일 내용을 렌더링하는 부분
            renderItem={({ index }) => {
              const date = getDateFromIndex(index);
              return (
                <View style={{ width: screenWidth }}>
                  {renderCalendar(date)}
                </View>
              );
            }}
          />
        </View>
        <View style={styles.todoContainer}></View>
        {/* 달력이랑 하단 todo listing 비율 3:4 */}
        <View style={styles.queryInputWrapper}>
          <QueryInput />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    // justifyContent: "center",
    // 5주, 6주에 따른 높이가 다르기 때문에
    // calendarGrid를 세로 중앙 정렬시키는 justifyContent를 삭제
  },
  calendarWrapper: {
    // 월 표시와 달력 칸을 합쳐 비율 6:7로 결정
    flex: 6,
    width: "100%",
  },
  card: {
    // 달력이랑 todo 비율 맞추기
    flex: 1,

    backgroundColor: "white",
    // borderRadius: 24,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.1,
    // shadowRadius: 10,
    // elevation: 8,
    // paddingVertical: 12,
    paddingHorizontal: 16,
    // paddingHorizontal: 6,
    width: screenWidth,
    maxWidth: 600,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  monthYearContainer: {
    alignItems: "center",
  },
  monthText: {
    // width: 36,
    height: 29,
    fontSize: 24,
    lineHeight: 24 * 1.2,
    fontWeight: "600",
    color: "#000",
  },
  // yearText: {
  //   fontSize: 18,
  //   // lineHeight: 상하 추가적인 여백 없이 fontSize와 최대한 동일하게 계산하기 위해
  //   lineHeight: 18,
  //   fontWeight: "500",
  //   color: "#000",
  //   marginTop: 4,
  // },
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
    fontSize: 14,
    lineHeight: 14 * 1.2,
    fontWeight: "500",
    color: "#1E1E1E",
    width: 13,
    height: 17,
  },
  calendarGrid: {
    // added
    flex: 1,

    flexDirection: "row",
    flexWrap: "wrap",
    // paddingHorizontal: 16,
    // marginTop: 8,
  },
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
  sundayText: {
    color: "#F0A796",
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
  dailytodoContainer: {
    marginTop: 4,
    alignItems: "center",
    // zIndex: 3,
    backgroundColor: "#6b7280",
  },
  todoText: {
    fontSize: 15,
    lineHeight: 15,
    color: "#fff",
  },
  todoContainer: {
    // 달력이랑 todo 비율 맞추기
    flex: 7,
    backgroundColor: "#F5F5F5",
    width: "100%",
  },
  queryInputWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});
