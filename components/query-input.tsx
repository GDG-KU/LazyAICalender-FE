import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

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
        { paddingBottom: 16 + useSafeAreaInsets().bottom },
      ]}
    >
      <Pressable onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <TextInput
            value={text}
            placeholder="Input Anything"
            placeholderTextColor="#1b9bf0"
            returnKeyType="send"
            style={styles.textInput}
            multiline={true}
            submitBehavior="blurAndSubmit"
            onChangeText={onChangeText}
            onSubmitEditing={addSchedule}
          />
          {/* 전송 버튼 */}
          <Pressable style={styles.btnContainer}>
            <View style={styles.addButton}>
              <Text style={styles.plusText}>+</Text>
            </View>
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
    paddingTop: 16,
    paddingHorizontal: 16,
    gap: 8,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    // alignItems: "center",
  },
  inner: {
    backgroundColor: "tomato",
    paddingLeft: 16,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    backgroundColor: "white",
    borderColor: "#1b9bf0",
    borderWidth: 5,
    // paddingVertical: 10,
    // paddingHorizontal: 20,
    fontSize: 20,
    // height: "100%",
    // width: "100%",
    // textAlignVertical: "center",
  },
  btnContainer: {
    backgroundColor: "tomato",
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1b9bf0",
  },
  plusText: {
    fontSize: 50,
    color: "white",
    fontWeight: "bold",
  },
});
