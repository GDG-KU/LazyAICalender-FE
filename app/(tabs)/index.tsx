import CategoryTodoList from "@/components/category-todo-list";
import DayCell from "@/components/day-cell";
import QueryInput from "@/components/query-input";
import SettingButton from "@/components/setting-button";
import { TodoItem } from "@/components/todo-block";
import ViewConvertButton from "@/components/view-convert-button";

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

  // ===== 선택된 날짜 상태 관리 =====
  // 사용자가 클릭한 날짜를 저장하는 상태 (기본값: 오늘 날짜)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // ===== 날짜별 투두 데이터 관리 =====
  // 날짜를 키로 하고 해당 날짜의 투두 배열을 값으로 하는 객체
  // 형식: "2024-01-15" => [투두1, 투두2, ...]
  const [todosByDate, setTodosByDate] = useState<Record<string, TodoItem[]>>({
    // 오늘 날짜의 샘플 투두들
    [new Date().toISOString().split("T")[0]]: [
      {
        id: "1", // 투두의 고유 식별자
        text: "프로젝트 회의 준비", // 투두 내용
        completed: false, // 완료 여부 (false = 미완료)
        category: "업무", // 카테고리 분류
        time: "오후 2시", // 예정 시간 (선택사항)
      },
      {
        id: "2",
        text: "장보기",
        completed: true, // 완료된 투두 (체크박스에 체크됨)
        category: "개인",
        time: "오후 5시",
      },
      {
        id: "3",
        text: "운동하기",
        completed: false,
        category: "건강",
        // time이 없으면 시간 표시 안됨
      },
    ],
    // 내일 날짜의 샘플 투두들
    [new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]]: [
      {
        id: "4",
        text: "병원 예약",
        completed: false,
        category: "건강",
        time: "오전 10시",
      },
      {
        id: "5",
        text: "책 읽기",
        completed: false,
        category: "개인",
      },
    ],
  });

  // ===== 날짜 클릭 핸들러 함수 =====
  // 사용자가 달력의 날짜를 클릭했을 때 호출되는 함수
  // date: 클릭된 날짜 객체
  const handleDateClick = (date: Date) => {
    setSelectedDate(date); // 선택된 날짜 상태 업데이트
  };

  // ===== 투두 완료 상태 토글 함수 =====
  // 사용자가 투두의 체크박스를 클릭했을 때 호출되는 함수
  // id: 토글할 투두의 고유 식별자
  const toggleTodo = (id: string) => {
    const dateKey = selectedDate.toISOString().split("T")[0]; // 선택된 날짜를 키로 변환

    setTodosByDate((prevTodosByDate) => ({
      ...prevTodosByDate,
      [dateKey]:
        prevTodosByDate[dateKey]?.map((todo) =>
          // 클릭된 투두의 id와 일치하는 경우에만 completed 상태를 반대로 변경
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ) || [], // 해당 날짜에 투두가 없으면 빈 배열 반환
    }));
  };

  // ===== 선택된 날짜의 투두 가져오기 함수 =====
  // 현재 선택된 날짜에 해당하는 투두 배열을 반환하는 함수
  const getTodosForSelectedDate = (): TodoItem[] => {
    const dateKey = selectedDate.toISOString().split("T")[0]; // 선택된 날짜를 키로 변환
    return todosByDate[dateKey] || []; // 해당 날짜의 투두가 없으면 빈 배열 반환
  };

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

  const currentMonthDate = getDateFromIndex(currentMonthIndex);
  const currentMonthName = monthNames[currentMonthDate.getMonth()];

  // 달력 렌더링
  const renderCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const calendarDate = date; // 달력이 표시하는 날짜 저장

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInPrevMonth = getDaysInPrevMonth(year, month);
    const lastDay = new Date(year, month, daysInMonth).getDay();

    const days = [];

    // 이전 달의 날짜 component 추가
    for (let i = firstDay; i > 0; i--) {
      days.push(
        <DayCell
          key={`prev-${i}`}
          monthPosition={"prev"}
          date={i}
          isToday={false}
          daysInPrevMonth={daysInPrevMonth}
          onDateClick={handleDateClick} // 날짜 클릭 핸들러 전달
          selectedDate={selectedDate} // 선택된 날짜 전달
          calendarDate={calendarDate} // 달력 날짜 전달
        />
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
        <DayCell
          key={`current-${i}`}
          monthPosition={"current"}
          date={i}
          isToday={isToday}
          daysInPrevMonth={daysInPrevMonth}
          onDateClick={handleDateClick} // 날짜 클릭 핸들러 전달
          selectedDate={selectedDate} // 선택된 날짜 전달
          calendarDate={calendarDate} // 달력 날짜 전달
        />
      );
    }

    // 다음 달의 날짜 component 추가
    if (lastDay !== 6) {
      // 이번 달이 토요일로 끝나지 않으면
      const trailingDays = 6 - lastDay;
      for (let i = 1; i <= trailingDays; i++) {
        days.push(
          <DayCell
            key={`next-${i}`}
            monthPosition={"next"}
            date={i}
            isToday={false}
            daysInPrevMonth={daysInPrevMonth}
            onDateClick={handleDateClick} // 날짜 클릭 핸들러 전달
            selectedDate={selectedDate} // 선택된 날짜 전달
            calendarDate={calendarDate} // 달력 날짜 전달
          />
        );
      }
    }

    // 실제 calendar view를 구성하는 부분
    return (
      <View style={styles.card}>
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
          <View style={styles.header}>
            {/* <View style={styles.monthYearContainer}> */}
            <ViewConvertButton />
            <Text style={styles.monthText}>{currentMonthName}</Text>
            {/* </View> */}
            <SettingButton />
          </View>
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
        {/* ===== 투두 리스트 영역 ===== */}
        <View style={styles.todoContainer}>
          <CategoryTodoList
            todos={getTodosForSelectedDate()} // 선택된 날짜의 투두 전달
            onToggleTodo={toggleTodo} // 투두 토글 함수 전달
          />
        </View>
        {/* 달력이랑 하단 todo listing 비율 3:4 */}
      </SafeAreaView>
      <QueryInput />
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
  // calendarWrapper : todoContainer = 393: 386
  calendarWrapper: {
    // 월 표시와 달력 칸을 합쳐 비율 6:7로 결정
    flex: 393,
    width: "100%",
  },
  card: {
    // 달력이랑 todo 비율 맞추기, 이걸 지워야 DayCell이 세로로 꽉 차게 할 수 있다?
    // 확실하지 않음
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
    paddingHorizontal: 16,
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
  sundayText: {
    color: "#EC221F",
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
  // ===== 투두 컨테이너 스타일 =====
  todoContainer: {
    flex: 386, // 달력과 투두 영역의 비율 (달력:투두 = 6:7)
    backgroundColor: "#F5F5F5", // 회색 배경색 (달력 아래쪽 회색 영역)
    width: "100%", // 전체 너비 사용
    paddingHorizontal: 16,
    paddingTop: 24,
  },
});
