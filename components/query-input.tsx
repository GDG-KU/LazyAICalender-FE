import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import SendButton from "./send-button";

import { useSafeAreaInsets } from "react-native-safe-area-context";

// 일정 추가용 / AI 상호작용 대화창 component
interface QueryInputProps {
  onAddTodo: (text: string) => void;
}   
export default function QueryInput({ onAddTodo }: QueryInputProps) {
  const [text, setText] = useState<string>("");
  const insets = useSafeAreaInsets();
  // TextInput의 변화를 감지해서 그 안의 내용을 text라는 state에 저장
  const onChangeText = (text: string) => {
    setText(text);
  };

  // 전송 버튼 누를 시 trigger되는 함수, 추후 백엔드와 연결 필요
  const addSchedule = () => {
    if (!text.trim()) return;
    onAddTodo(text);
    console.log("schedule added");
    setText("");
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.inputContainer, { paddingBottom: 8 + insets.bottom }]}
    >
      <Pressable onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <TextInput
            value={text}
            placeholder="어떤 일정을 추가할까요?"
            placeholderTextColor="#767676"
            returnKeyType="send"
            // multiline=true일 경우 iOS에 대해 RN가 자동적으로 paddingTop을 추가하기에
            // 그를 막기 위한 추가 CSS style
            // textAlignVertical: "top" 추가해야 하나 보기, multiline input에 대해 효과적인 스타일
            style={[styles.textInput, { paddingTop: 0 }]}
            multiline={true}
            submitBehavior="blurAndSubmit"
            onChangeText={onChangeText}
            onSubmitEditing={addSchedule}
          />
          {/* 전송 버튼 */}
          <Pressable style={styles.btnContainer} onPress={addSchedule}>
            {/* onPress prop 추가하기 */}
            <LinearGradient
              colors={["#F2A892", "#D79EBF", "#AC95F5"]}
              start={{ x: 0.0, y: 0.0 }}
              end={{ x: 1.0, y: 0.0 }}
              locations={[0.1531, 0.5024, 0.8517]}
              style={styles.gradientBorder}
            >
              <View style={styles.addButton}>
                <SendButton />
              </View>
            </LinearGradient>
          </Pressable>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    position: "absolute",
    bottom: 8,
    backgroundColor: "#1E1E1E",
    // flex: 1,
    paddingTop: 8,
    paddingHorizontal: 8,

    gap: 8,

    borderRadius: 100,
    width: "91%",
    alignSelf: "center",

    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    // Web CSS에서 사용하는 아래와 같은 스타일은 사용 불가
    // boxShadow: "0 0 50 10 rgba(12,12,13,0.16)",
    // Shadow Styles for iOS
    shadowColor: "#0C0C0D",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.16,
    shadowRadius: 25, // Figma Blur 값 / 2 정도가 일반적 계산

    // Shadow Styles for Android
    // 추가로 더 설정할 수 있는 부분이 있음
    // RN docs
    // dropShadow: Adds a shadow around the alpha mask of the View (only non-zero alpha pixels in the View will cast a shadow). Takes an optional color representing the shadow color, and 2 or 3 lengths. If 2 lengths are specified they are interperted as offsetX and offsetY which will translate the shadow in the X and Y dimensions respectfully. If a 3rd length is given it is interpreted as the standard deviation of the Guassian blur used on the shadow - so a larger value will blur the shadow more. Read more about the arguments in
    // https://reactnative.dev/docs/view-style-props#filter
    elevation: 15,
  },
  inner: {
    // inputContainer에 paddingBottom을 적용하는 건 KeyboardAvoidingView 때문에 안됨
    // 대신 inner에 paddingBottom을 적용하는 걸로 대체
    // paddingBottom: 16,
    paddingLeft: 16,
    // 원래는 inputContainer에 적용되어야 하는 스타일인데 SafeAreaView issue로 부득이하게 여기에 적용
    paddingBottom: 8,
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
  },
  textInput: {
    backgroundColor: "#1E1E1E",
    fontSize: 20,
    lineHeight: 20 * 1.4,
    // height: "100%",
    // width: "100%",
    // textAlignVertical: "bottom",
  },
  btnContainer: {
    backgroundColor: "1E1E1E",
  },
  // borderColor에 LinearGradient를 적용하는 것은 어려움,
  // gradientBorder에 비해 addButton을 약간 작게 만들어 마치 테두리를 준 것처럼 보이게 하기
  gradientBorder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1E1E1E",
    // borderWidth: 0.857,
    // borderColor: "#FFF",
  },
  plusText: {
    fontSize: 50,
    color: "white",
    fontWeight: "bold",
  },
});
