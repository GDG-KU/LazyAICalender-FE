import CategoryTodoList from "@/components/category-todo-list";
import DayCell from "@/components/day-cell";
import QueryInput from "@/components/query-input";
import SettingButton from "@/components/setting-icon";
import { TodoItem } from "@/components/todo-block";
import ViewConvertButton from "@/components/view-convert-button";
import React, { useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform } from "react-native";

import TodoActionSheetModal from "@/components/todo-action-sheet-modal";
import TodoDeleteConfirmModal from "@/components/todo-delete-confirm-modal";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";
import "react-native-get-random-values";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

//  새로 추가
import AgentDock from "@/components/agent/agent-dock";
import EventCreateModal from "@/components/agent/event-create-modal";

// import { v4 as uuidv4 } from "uuid";

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
// 원래는 1000이었음
const INITIAL_INDEX = 3;

// YYYY-MM-DD (로컬 기준) 키 생성 유틸
const DateKey = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

// 날짜 재클릭 시 선택 해제
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();


//임시로 투두 id 생성
const genId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export default function Calendar() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(INITIAL_INDEX);

  // ===== 선택된 날짜 상태 관리 =====
  // ✅ 기본값: 아무 날짜도 선택되지 않은 상태(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const insets = useSafeAreaInsets();

  // ===== 날짜별 투두 데이터 관리 =====
  const todayKey = DateKey(new Date());
  const tomorrowKey = DateKey(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const [todosByDate, setTodosByDate] = useState<Record<string, TodoItem[]>>({
    [todayKey]: [
      {
        id: "1",
        text: "프로젝트 회의 준비",
        completed: false,
        category: "업무",
        time: "오후 2시",
      },
      {
        id: "6",
        text: "프로젝트 회의",
        completed: false,
        category: "업무",
        time: "오후 2시",
      },
      {
        id: "2",
        text: "장보기",
        completed: true,
        category: "개인",
        time: "오후 5시",
      },
      {
        id: "3",
        text: "운동하기",
        completed: false,
        category: "건강",
      },
    ],
    [tomorrowKey]: [
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

  // --- 액션 시트 & 확인 모달 상태 ---
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);

  // --- 에이전트 도크에서 넘어온 일정 텍스트 + 옵션 모달 상태 ---
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [pendingText, setPendingText] = useState("");

  // ===== 날짜 클릭 핸들러 함수 =====
  const handleDateClick = (date: Date) => {
    setSelectedDate((prev) => {
    if (prev && isSameDay(prev, date)) {
      // ✅ 같은 날짜를 다시 클릭 → 선택 해제 (null)
      return null;
    }
    // 다른 날짜를 클릭 → 그 날짜 선택
    return date;
  });

  // 선택 해제될 때 혹시 열려있던 일정 생성 모달은 닫아주기
  setCreateModalVisible(false);
  setPendingText("");
  };

  // ===== 투두 완료 상태 토글 함수 =====
  const toggleTodo = (id: string) => {
    if (!selectedDate) return; // 날짜가 없으면 아무 것도 하지 않음
    const dateKey = DateKey(selectedDate);

    setTodosByDate((prevTodosByDate) => ({
      ...prevTodosByDate,
      [dateKey]:
        prevTodosByDate[dateKey]?.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ) || [],
    }));
  };

  // ===== 길게 누르면 열리는 액션시트 =====
  const openActionSheet = (id: string) => {
    setSelectedTodoId(id);
    setActionSheetVisible(true);
  };
  const closeActionSheet = () => setActionSheetVisible(false);

  // ===== 액션시트에서 '삭제' 선택 → 확인 모달 열기 =====
  const askDelete = () => {
    closeActionSheet();
    setConfirmVisible(true);
  };

  // ===== 확인 모달에서 '삭제' 확정 =====
  const confirmDelete = () => {
    if (!selectedTodoId) return;
    deleteTodo(selectedTodoId);
    setConfirmVisible(false);
    setSelectedTodoId(null);
  };

  // ===== 액션시트에서 '복사' 선택 =====
  const duplicateTodo = () => {
    if (!selectedTodoId || !selectedDate) return;
    const dateKey = DateKey(selectedDate);
    const original = (todosByDate[dateKey] || []).find(
      (t) => t.id === selectedTodoId
    );
    if (!original) return;

    const copy: TodoItem = { ...original, id: genId() };
    setTodosByDate((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), copy],
    }));
    closeActionSheet();
  };

  // ===== 기존 단순 추가 함수 (필요 시 다른 곳에서 사용 가능) =====
  const addTodo = (text: string) => {
    if (!text.trim() || !selectedDate) return;

    const dateKey = DateKey(selectedDate);

    const newTodo: TodoItem = {
      id: genId(),
      text,
      completed: false,
      category: "기타",
    };

    setTodosByDate((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newTodo],
    }));
  };

  // ===== 투두 삭제 함수 =====
  const deleteTodo = (id: string) => {
    if (!selectedDate) return;
    const dateKey = DateKey(selectedDate);

    setTodosByDate((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey]?.filter((todo) => todo.id !== id) || [],
    }));
  };

  // ===== 선택된 날짜의 투두 가져오기 함수 =====
  const getTodosForSelectedDate = (): TodoItem[] => {
    if (!selectedDate) return [];
    const dateKey = DateKey(selectedDate);
    return todosByDate[dateKey] || [];
  };

  // === 에이전트 도크 → 일정 생성 플로우 ===

  // 도크에서 사용자가 텍스트를 전송했을 때 호출됨
  const onDockSubmit = (text: string) => {
    if (!selectedDate) {
      // 날짜 미선택 상태에서는 단순 대화만, 일정 생성 안 함
      return;
    }
    setPendingText(text);
    setCreateModalVisible(true);
  };

  const addScheduleWithOptions = (opt: { category: string; isTodo: boolean }) => {
    if (!selectedDate) return;
    const dateKey = DateKey(selectedDate);

    const newTodo: TodoItem = {
      id: genId(),
      text: pendingText,
      completed: false,
      category: opt.category,
      isTodo: opt.isTodo, // isTodo 필드를 쓰려면 TodoItem 타입과 CategoryTodoList에서 추가 처리
    };

    setTodosByDate((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newTodo],
    }));

    setCreateModalVisible(false);
    setPendingText("");
  };

  const baseDate = new Date();

  // 특정 인덱스에 대응되는 날짜 생성
  const getDateFromIndex = (index: number) => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth() + (index - INITIAL_INDEX);
    // 항상 1일로 고정
    return new Date(year, month, 1);
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
    const calendarDate = date;

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInPrevMonth = getDaysInPrevMonth(year, month);
    const lastDay = new Date(year, month, daysInMonth).getDay();

    const days = [];

    // 이전 달
    for (let i = firstDay; i > 0; i--) {
      days.push(
        <DayCell
          key={`prev-${i}`}
          monthPosition={"prev"}
          date={i}
          isToday={false}
          daysInPrevMonth={daysInPrevMonth}
          onDateClick={handleDateClick}
          // selectedDate가 null이면 달력 어디에도 선택표시 X
          selectedDate={selectedDate ?? new Date(2100, 0, 1)}
          calendarDate={calendarDate}
        />
      );
    }

    // 현재 달
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
          onDateClick={handleDateClick}
          selectedDate={selectedDate ?? new Date(2100, 0, 1)}
          calendarDate={calendarDate}
        />
      );
    }

    // 다음 달
    if (lastDay !== 6) {
      const trailingDays = 6 - lastDay;
      for (let i = 1; i <= trailingDays; i++) {
        days.push(
          <DayCell
            key={`next-${i}`}
            monthPosition={"next"}
            date={i}
            isToday={false}
            daysInPrevMonth={daysInPrevMonth}
            onDateClick={handleDateClick}
            selectedDate={selectedDate ?? new Date(2100, 0, 1)}
            calendarDate={calendarDate}
          />
        );
      }
    }

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
      <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0} 
    >
      <SafeAreaView style={styles.container}>
        {/* 월별 횡 스크롤 가능한 달력 */}
        <View style={styles.calendarWrapper}>
          <View style={styles.header}>
            <ViewConvertButton />
            <Text style={styles.monthText}>{currentMonthName}</Text>
            <SettingButton />
          </View>
          <FlatList
            data={Array.from({ length: 60 })}
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
                <View style={{ width: screenWidth }}>
                  {renderCalendar(date)}
                </View>
              );
            }}
          />
        </View>

        {/* ===== 투두 리스트 영역 ===== */}
        <View style={styles.todoContainer}>
          <View style={styles.dateInfoContainer}>
            {selectedDate ? (
              <Text style={styles.dateInfo}>
                {selectedDate.getDate()}일 {dayNames[selectedDate.getDay()]}
              </Text>
            ) : (
              <Text style={styles.dateInfo}>날짜를 선택해 주세요</Text>
            )}
          </View>
          <CategoryTodoList
            todos={getTodosForSelectedDate()}
            onToggleTodo={toggleTodo}
            onDeleteTodo={deleteTodo}
            onLongPressTodo={openActionSheet}
          />
        </View>

      {/* ===== 하단 에이전트 도크 ===== */}
      <AgentDock
        prompt={selectedDate ? "어떤 일정을 추가할까요?" : "무엇을 도와드릴까요?"}
        enableCreate={!!selectedDate}
        enableReply={!selectedDate}
        onSubmit={onDockSubmit}
      />
    </SafeAreaView>
  </KeyboardAvoidingView>

      {/* --- 하단 액션 시트: 삭제 / 복사 / 취소 --- */}
      <TodoActionSheetModal
        visible={actionSheetVisible}
        onClose={closeActionSheet}
        onAskDelete={askDelete}
        onDuplicate={duplicateTodo}
      />

      {/* --- 삭제 확인 모달: 취소 / 삭제 --- */}
      <TodoDeleteConfirmModal
        visible={confirmVisible}
        onClose={() => setConfirmVisible(false)}
        onConfirmDelete={confirmDelete}
      />

      {/* --- 일정 생성 옵션 모달: 카테고리 + 투두 여부 --- */}
      <EventCreateModal
        visible={createModalVisible}
        eventText={pendingText}
        onClose={() => setCreateModalVisible(false)}
        onConfirm={addScheduleWithOptions}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  calendarWrapper: {
    flex: 393,
    width: "100%",
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
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
    height: 29,
    fontSize: 24,
    lineHeight: 24 * 1.2,
    fontWeight: "600",
    color: "#000",
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
    fontSize: 14,
    lineHeight: 14 * 1.2,
    fontWeight: "500",
    color: "#1E1E1E",
    width: 13,
    height: 17,
  },
  calendarGrid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  sundayText: {
    color: "#EC221F",
  },
  dailytodoContainer: {
    marginTop: 4,
    alignItems: "center",
    backgroundColor: "#6b7280",
  },
  todoText: {
    fontSize: 15,
    lineHeight: 15,
    color: "#fff",
  },
  todoContainer: {
    flex: 300,
    backgroundColor: "#F5F5F5",
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  dateInfoContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 16,
  },
  dateInfo: {
    color: "#000",
    fontSize: 20,
    lineHeight: 20 * 1.2,
    fontWeight: "600",
  },
});

// 아래 sheetStyles / confirmStyles 는 이전 모달 디자인 잔재라
// 지금은 사용하지 않지만, 필요 시 참고용으로 남겨둠
const sheetStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  rowDanger: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  iconBox: { width: 28, alignItems: "center", marginRight: 12 },
  icon: { width: 20, height: 20, tintColor: "#6B7280" },
  iconDanger: { width: 20, height: 20, tintColor: "#EC221F" },
  dangerText: { color: "#EC221F", fontSize: 16, fontWeight: "600" },
  rowText: { color: "#111827", fontSize: 16, fontWeight: "600" },
  cancel: {
    marginTop: 8,
    marginHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    paddingVertical: 12,
  },
  cancelText: { fontSize: 16, color: "#111827", fontWeight: "600" },
});

const confirmStyles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF1F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginTop: 4,
    textAlign: "center",
  },
  sub: { fontSize: 13, color: "#6B7280", marginTop: 6, textAlign: "center" },
  actions: { flexDirection: "row", marginTop: 16, gap: 10 },
  btnGhost: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  btnGhostText: { fontSize: 15, fontWeight: "600", color: "#111827" },
  btnDanger: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F87171",
    alignItems: "center",
    justifyContent: "center",
  },
  btnDangerText: { fontSize: 15, fontWeight: "700", color: "#fff" },
});
