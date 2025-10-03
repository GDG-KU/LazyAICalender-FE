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
import PlusText from "./plus-text";

// 일정 추가용 / AI 상호작용 대화창 component
export default function QueryInput() {
  const [text, setText] = useState<string>("");

  // TextInput의 변화를 감지해서 그 안의 내용을 text라는 state에 저장
  const onChangeText = (text: string) => {
    setText(text);
  };

  // 전송 버튼 누를 시 trigger되는 함수, 추후 백엔드와 연결 필요
  const addSchedule = () => {
    console.log("schedule added");
    setText("");
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[
        styles.inputContainer,
        // { paddingBottom: 16 + useSafeAreaInsets().bottom },
      ]}
    >
      <Pressable onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <TextInput
            value={text}
            placeholder="Input Anything"
            placeholderTextColor="#B3B3B3"
            returnKeyType="send"
            style={[styles.textInput, { paddingTop: 0 }]}
            multiline={true}
            submitBehavior="blurAndSubmit"
            onChangeText={onChangeText}
            onSubmitEditing={addSchedule}
          />
          {/* 전송 버튼 */}
          <Pressable style={styles.btnContainer}>
            <LinearGradient
              colors={["#F2A892", "#D79EBF", "#AC95F5"]}
              style={styles.addButton}
            >
              <PlusText />
            </LinearGradient>
          </Pressable>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "white",
    // position: "absolute",
    // bottom: 0,
    // flex: 1,
    padding: 16,
    gap: 8,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: "100%",
    // alignSelf: "center",
    // justifyContent: "center",
    // alignItems: "center",

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
    backgroundColor: "tomato",
    // inputContainer에 paddingBottom을 적용하는 건 KeyboardAvoidingView 때문에 안됨
    // 대신 inner에 paddingBottom을 적용하는 걸로 대체
    paddingBottom: 16,
    paddingLeft: 16,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  textInput: {
    backgroundColor: "white",
    borderColor: "#1b9bf0",
    borderWidth: 5,
    fontSize: 20,
    lineHeight: 20 * 1.4,
    // height: "100%",
    // width: "100%",
    // textAlignVertical: "bottom",
  },
  btnContainer: {
    backgroundColor: "white",
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  plusText: {
    fontSize: 50,
    color: "white",
    fontWeight: "bold",
  },
});
