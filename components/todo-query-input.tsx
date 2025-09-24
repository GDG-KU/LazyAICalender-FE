import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";

export default function QueryInput() {
  const [text, setText] = useState<string>("");

  const onChangeText = (text: string) => {
    setText(text);
  };

  const addSchedule = () => {
    console.log(text);
    setText("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.inputContainer}
    >
      <Pressable onPress={Keyboard.dismiss}>
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
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "tomato",
    position: "absolute",
    bottom: 0,
    // flex: 1,
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    // alignItems: "center",
  },
  textInput: {
    backgroundColor: "white",
    borderColor: "#1b9bf0",
    borderWidth: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    fontSize: 20,
    height: "100%",
    width: "100%",
    textAlignVertical: "center",
  },
});
