// import { View, type ViewProps } from 'react-native';

// import { useThemeColor } from '@/hooks/use-theme-color';

// export type ThemedViewProps = ViewProps & {
//   lightColor?: string;
//   darkColor?: string;
// };

// export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
//   const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

//   return <View style={[{ backgroundColor }, style]} {...otherProps} />;
// }

import React, { useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function QueryInput() {
  const [showInput, setShowInput] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  const inputOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(1)).current;

  const onChangeText = (text: string) => {
    setText(text);
  };

  const handlePressPlus = () => {
    setShowInput(true);
    Animated.parallel([
      Animated.timing(buttonOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(inputOpacity, {
        toValue: 1,
        duration: 300,
        delay: 150, // Slight delay to make the plus button disappear first
        useNativeDriver: true,
      }),
    ]).start();
  };
  const addSchedule = () => {
    console.log("schedule added");
    setText("");
    Keyboard.dismiss();
    // Optional: Animate back to the plus button
    Animated.parallel([
      Animated.timing(inputOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 300,
        delay: 150,
        useNativeDriver: true,
      }),
    ]).start(() => setShowInput(false));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.inputContainer}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          {!showInput && (
            <Animated.View
              style={[styles.plusButton, { opacity: buttonOpacity }]}
            >
              <TouchableOpacity onPress={handlePressPlus}>
                <Text style={styles.plusText}>+</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
          {showInput && (
            <Animated.View
            //style={[styles.textInput, { opacity: inputOpacity }]}
            >
              <TextInput
                onChangeText={onChangeText}
                value={text}
                placeholder="Input Anything"
                placeholderTextColor="#1b9bf0"
                returnKeyType="send"
                style={styles.textInput}
                // multiline일 경우 이 아래 3줄이 모두 쓰여야 작동함 -> multiline만 주고 다시. ㅔ스트
                multiline={true}
                submitBehavior="submit"
                onSubmitEditing={addSchedule}
                autoFocus={true} // Automatically focus the input when it appears
                onBlur={() => {
                  // Optional: If you want to revert to the plus button when the user blurs the input
                  // and the text is empty.
                  // 비어있을 때 blur하면 +버튼으로 돌아가고, 안 비어있으면 텍스트가 차 있는채로 그대로 내려옴
                  if (text === "") {
                    Animated.parallel([
                      Animated.timing(inputOpacity, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                      }),
                      Animated.timing(buttonOpacity, {
                        toValue: 1,
                        duration: 300,
                        delay: 150,
                        useNativeDriver: true,
                      }),
                    ]).start(() => setShowInput(false));
                  }
                }}
              />
            </Animated.View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "tomato",
    position: "absolute", // 뷰포트를 기준으로 위치를 고정
    bottom: 20, // 화면 하단에 위치
    width: "90%", // 너비를 전체로 설정
    alignSelf: "center",
    // paddingHorizontal: 20,
  },
  inner: {
    padding: 24,
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    // height: 40,

    backgroundColor: "white",
    borderColor: "#1b9bf0",
    borderWidth: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,

    // inputContainer의 크기만큼만 가로로 늘어남, 90%

    // marginTop: 20,
    // marginVertical: 20,
    fontSize: 18,

    // multilne일 때 글자 하나를 치면 잠깐 아래줄에 타이핑되는 것처럼 하다가 위로 올라오는 현상 방지
    width: "100%",
  },
  // btnContainer: {
  //   backgroundColor: "white",
  //   marginTop: 12,
  // },
  plusButton: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    height: 70,
    width: 70,
    borderRadius: 35,

    // 화면 하단과 버튼 사이의 간격을 벌리기 위해, 근데 달력의 최하단 줄을 방해하지 않는지 체크해야 함
    // marginBottom: 10,
    backgroundColor: "#1b9bf0",
  },
  plusText: {
    fontSize: 50,
    color: "white",
    fontWeight: "bold",
  },
});
