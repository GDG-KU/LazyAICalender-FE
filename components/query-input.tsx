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

  // 전송 버튼 누를 시 trigger되는 함수, 추후 백엔드/AI와 연결 필요
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
              <View style={styles.addButton}>
                {/* <Text style={styles.plusText}>+</Text> */}
                <PlusText />
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
    backgroundColor: "white",
    // position: "absolute",
    // bottom: 0,
    // flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 8,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: "100%",
    // alignSelf: "center",
    // justifyContent: "center",
    // alignItems: "center",
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
    backgroundColor: "#000",
  },
  addButton: {
    // 이렇게 해도 완전히 중앙정렬은 안됨
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 48,
    borderRadius: 24,
    // backgroundColor: "#1b9bf0",
  },
  plusText: {
    fontSize: 50,
    color: "white",
    fontWeight: "bold",
  },
});
