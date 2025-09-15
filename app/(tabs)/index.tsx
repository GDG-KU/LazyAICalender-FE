import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  KeyboardEvent,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
// The main App component that renders the calendar.
export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [text, setText] = useState<string>("");
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  // 애니메이션 값 (0은 초기 위치, 1은 중앙 위치)
  const animatedValue = useRef(new Animated.Value(0)).current;

  const onChangeText = (text: string) => {
    setText(text);
  };

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

  const useKeyboard = () => {
    // const [keyboardHeight, setKeyboardHeight] = useState(0);
    let height = 0;
    function onKeyboardDidShow(e: KeyboardEvent) {
      // setKeyboardHeight(e.endCoordinates.height);
      height = e.endCoordinates.height;
    }
    function onKeyboardDidHide() {
      // setKeyboardHeight(0);
    }

    useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        onKeyboardDidShow
      );
      const keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        onKeyboardDidHide
      );

      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }, []);

    // return keyboardHeight;
    return height;
  };

  // 애니메이션 효과
  const onHandleFocus = () => {
    // 입력창이 포커스되면 애니메이션 시작
    setIsInputFocused(true);
    Animated.timing(animatedValue, {
      toValue: 1, // 목표 값
      duration: 180, // 애니메이션 시간
      useNativeDriver: true, // 네이티브 드라이버 사용
    }).start();
  };

  const onHandleBlur = () => {
    // 입력창이 블러되면 애니메이션 역방향으로 시작
    setIsInputFocused(false);
    Animated.timing(animatedValue, {
      toValue: 0, // 목표 값
      duration: 180, // 애니메이션 시간
      useNativeDriver: true, // 네이티브 드라이버 사용
    }).start();
  };

  const addSchedule = () => {};

  // 애니메이션 값에 따라 Y축 위치 계산
  // const inputTranslateY =
  //   (Dimensions.get("window").height + useKeyboard()) / 2 - 68;
  // console.log("keyboard", useKeyboard());
  // console.log("height", Dimensions.get("window").height);
  // console.log("translate", inputTranslateY);
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    // outputRange: [0, -207], // 필요에 따라 이 값을 조절
    // outputRange: [0, -inputTranslateY], // 207이 되어야 하는게 맞는데 왜 값이 다르지?
    outputRange: [
      0,
      -((Dimensions.get("window").height + useKeyboard()) / 2 - 68),
    ],

    // useKeyboard() 하면 keyboard의 높이를 가져온다.
    // 디스플레이의 세로 높이: Dimensions.get('window').height;

    // styles.inputContainer.bottom: 20
    // textInput의 bottom 기준 현재 몇px이나 위로 떨어져있는지
    // inner에 padding이 24 있음,
    // textInput의 paddingVertial 15, 폰트 사이즈 18px -> 절반인 약 9픽셀

    // 세로 높이: 97
    // -> 97/2 +. 0
  });

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
        {/* <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[
            styles.inputContainer,
            // isInputFocused && {
            //   position: "absolute",
            //   bottom: 0,
            //   width: "100%",
            // },
          ]}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Animated.View
              style={[styles.inner, { transform: [{ translateY }] }]}
            >
              <TextInput
                onChangeText={onChangeText}
                value={text}
                placeholder="Input Anything"
                placeholderTextColor="#1b9bf0"
                returnKeyType="send"
                style={styles.textInput}
                onFocus={onHandleFocus} // 포커스 시 애니메이션 실행
                onBlur={onHandleBlur} // 블러 시 애니메이션 역방향 실행
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView> */}
        {/* <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.inputContainer}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.inner}>
              <TextInput
                onChangeText={onChangeText}
                value={text}
                placeholder="Input Anything"
                placeholderTextColor="#1b9bf0"
                returnKeyType="send"
                style={styles.textInput}
              />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView> */}
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {/* <Animated.View */}
          {/* <View style={[styles.inner, { transform: [{ translateY }] }]}> */}
          <View style={styles.inner}>
            <TextInput
              onChangeText={onChangeText}
              value={text}
              placeholder="Input Anything"
              placeholderTextColor="#1b9bf0"
              returnKeyType="send"
              style={styles.textInput}
              onFocus={onHandleFocus} // 포커스 시 애니메이션 실행
              onBlur={onHandleBlur} // 블러 시 애니메이션 역방향 실행
              onSubmitEditing={addSchedule}
            />
            {/* </Animated.View> */}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      {/* <View style={styles.inputContainer}>
        <TextInput 
        // onSubmitEditing={addTodo}
        >Input Text</TextInput>
      </View> */}
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
    // justifyContent: "center",
    // 5주, 6주가 다르기 때문에 justifyContent를 삭제하고
    // padding 기준으로 styles.card을 아래로 밀어줌
    paddingTop: 71,
    // padding: 16,
  },
  card: {
    // flex: 9,

    backgroundColor: "white",
    // borderRadius: 24,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.1,
    // shadowRadius: 10,
    // elevation: 8,

    paddingVertical: 24,
    paddingHorizontal: 6,
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

    //added
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
    width: "14.28%", // 100% / 7 days

    // 이걸 줘서 최하단에 예상하지 않은 추가 공백이 생김
    // aspectRatio: 1, // To make the cells square
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderRadius: 9999,

    // added
    // 여기가 각 날짜의 세로 간격 벌리는 곳
    // marginVertical: 20,
    marginBottom: 49.5,
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
    // aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,

    // added
    // marginVertical: 20,
    marginBottom: 49.5,
  },
  dayTextInactive: {
    fontSize: 16,
    fontWeight: "500",
    color: "#9ca3af",
  },
  inner: {
    padding: 24,
    // flex: 1,
    justifyContent: "space-around",
  },
  textInput: {
    // height: 40,
    // borderColor: "#000000",
    // borderBottomWidth: 1,
    // marginBottom: 36,
    backgroundColor: "#888",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    // marginTop: 20,
    // marginVertical: 20,
    fontSize: 18,
  },
  // btnContainer: {
  //   backgroundColor: "white",
  //   marginTop: 12,
  // },
  // input: {
  //   backgroundColor: "#888",
  //   paddingVertical: 15,
  //   paddingHorizontal: 20,
  //   borderRadius: 30,
  //   marginTop: 20,
  //   marginVertical: 20,
  //   fontSize: 18,
  // },
  // inputContainer: {
  //   // flex: 1,
  //   backgroundColor: "#1b9bf0",
  // },
  inputContainer: {
    backgroundColor: "#1b9bf0",
    position: "absolute", // 뷰포트를 기준으로 위치를 고정
    bottom: 20, // 화면 하단에 위치
    width: "90%", // 너비를 전체로 설정
    alignSelf: "center",
    // // left: 0,
    // // right: 0,
    // paddingHorizontal: 20,
  },
});
