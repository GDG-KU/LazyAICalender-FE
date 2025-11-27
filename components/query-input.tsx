import React, { useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import SendButton from "./send-icon";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface QueryInputProps {
  onAddTodo: (text: string) => void;
  onExpand?: () => void;
  // 모드에 따라 placeholder 바꿀 수 있게 props 추가
  placeholder?: string;
}

export default function QueryInput({
  onAddTodo,
  onExpand,
  placeholder,
}: QueryInputProps) {
  const [text, setText] = useState<string>("");
  const insets = useSafeAreaInsets();

  const onChangeText = (val: string) => {
    setText(val);
  };

  const addSchedule = () => {
    if (!text.trim()) return;
    onAddTodo(text);
    console.log("schedule added");
    setText("");
    Keyboard.dismiss();
  };

  const handleFocus = () => {
    onExpand?.();
  };

  return (
    <View
      style={{
        paddingBottom: 8 + insets.bottom,
        paddingHorizontal: 16,
        paddingTop: 5,
        backgroundColor: "#111111",
      }}
    >
      <View style={styles.styleWrapper}>
        <Pressable style={styles.inner} onPress={handleFocus}>
          <TextInput
            value={text}
            // 아무 것도 안 넘어오면 일정 추가 문구, 넘어오면 그걸 사용
            placeholder={placeholder ?? "어떤 일정을 추가할까요?"}
            placeholderTextColor="#767676"
            returnKeyType="send"
            style={[styles.textInput, { paddingTop: 0 }]}
            multiline={true}
            onChangeText={onChangeText}
            onSubmitEditing={addSchedule}
            onFocus={handleFocus}
            blurOnSubmit={true}
          />
          <Pressable style={styles.btnContainer} onPress={addSchedule}>
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
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  styleWrapper: {
    backgroundColor: "#1E1E1E",
    paddingTop: 8,
    paddingHorizontal: 8,
    gap: 8,
    borderRadius: 100,
    width: "100%",
    alignSelf: "center",
    shadowColor: "#0C0C0D",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 25,
    elevation: 15,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  inner: {
    paddingLeft: 16,
    paddingBottom: 8,
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
  },
  textInput: {
    backgroundColor: "#1E1E1E",
    fontSize: 14,
    lineHeight: 14 * 1.4,
    flex: 1,
    color: "white",
  },
  btnContainer: {
    marginLeft: 8,
  },
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
  },
});
