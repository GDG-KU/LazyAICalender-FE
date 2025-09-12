import { StyleSheet } from "react-native";

import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

// The main App component that renders the calendar.
export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Function to get the number of days in a specific month and year.
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Function to get the first day of the week for a specific month and year.
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Function to get the last day of the month before the current one.
  const getDaysInPrevMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  // Render the calendar days.
  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInPrevMonth = getDaysInPrevMonth(year, month);
    const lastDay = new Date(year, month, daysInMonth).getDay();

    const days = [];

    // Fill leading empty cells with days from the previous month.
    for (let i = firstDay; i > 0; i--) {
      days.push(
        <View key={`prev-${i}`} style={styles.dayCellInactive}>
          <Text style={styles.dayTextInactive}>{daysInPrevMonth - i + 1}</Text>
        </View>
      );
    }

    // Fill with days of the current month.
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday =
        i === new Date().getDate() &&
        month === new Date().getMonth() &&
        year === new Date().getFullYear();

      days.push(
        <View
          key={`current-${i}`}
          style={[styles.dayCell, isToday && styles.todayCell]}
        >
          <Text style={[styles.dayText, isToday && styles.todayText]}>{i}</Text>
        </View>
      );
    }

    // Fill trailing empty cells with days from the next month.
    if (lastDay !== 6) {
      // If the last day is not Saturday
      const trailingDays = 6 - lastDay;
      for (let i = 1; i <= trailingDays; i++) {
        days.push(
          <View key={`next-${i}`} style={styles.dayCellInactive}>
            <Text style={styles.dayTextInactive}>{i}</Text>
          </View>
        );
      }
    }

    return days;
  };

  // Handle previous month navigation.
  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // Handle next month navigation.
  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

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

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header with Month, Year, and Navigation Buttons */}
        <View style={styles.header}>
          <TouchableOpacity onPress={prevMonth} style={styles.navButton}>
            <Text style={styles.navText}>&lt;</Text>
          </TouchableOpacity>
          <View style={styles.monthYearContainer}>
            <Text style={styles.monthText}>
              {monthNames[currentDate.getMonth()]}
            </Text>
            <Text style={styles.yearText}>{currentDate.getFullYear()}</Text>
          </View>
          <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
            <Text style={styles.navText}>&gt;</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <View style={styles.dayNameContainer}>
          {dayNames.map((day) => (
            <View key={day} style={styles.dayNameCell}>
              <Text style={styles.dayNameText}>{day}</Text>
            </View>
          ))}
        </View>
        <View style={styles.calendarGrid}>{renderCalendarDays()}</View>
      </View>
      <View>
        <Text style={styles.input}>Input Text</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // backgroundColor: "#f3f4f6",
    backgroundColor: "white",

    // 이 둘중 하나가 tab이랑 캘린더 위치 관계  조정하는 역할인듯
    // 왠지 이 둘 중 하나 빼고 flex 비율 조정하면 의도한 대로 될듯
    alignItems: "center",
    justifyContent: "center",
    // padding: 16,
  },
  card: {
    backgroundColor: "white",
    // borderRadius: 24,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.1,
    // shadowRadius: 10,
    // elevation: 8,

    padding: 24,
    width: "100%",
    maxWidth: 600,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    // flex: 1,
    alignItems: "center",
    padding: 8,
    //marginVertical: 10,
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
    width: "14.28%", // 100% / 7 days
    aspectRatio: 1, // To make the cells square
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderRadius: 9999,

    // added
    // 여기가 각 날짜의 세로 간격 벌리는 곳
    marginVertical: 20,
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
  dayCellInactive: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,

    // added
    marginVertical: 10,
  },
  dayTextInactive: {
    fontSize: 16,
    fontWeight: "500",
    color: "#9ca3af",
  },
  input: {
    marginTop: 100,
  },
});
