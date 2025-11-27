import { StyleSheet, Text, View } from "react-native";

export interface TodoCalendarBlockProps {
  text: string;
}

export default function TodoCalendarBlock({ text }: TodoCalendarBlockProps) {
  return (
    <View
      style={[
        styles.todoBlock,
        { backgroundColor: text === "" ? "#FFF" : "#FDBEAD" },
      ]}
    >
      <Text style={styles.todoText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  todoBlock: {
    width: "92%",
    flex: 1, // todoContainer 높이에 따라 균등 분배
    maxHeight: 16, // 높이 제한
    borderRadius: 2,
    backgroundColor: "#358912",
    marginBottom: 2,
    paddingLeft: 4,
    justifyContent: "center",
    // 마지막 요소는 marginBottom을 1로 줘야 하마
  },
  todoText: {
    color: "white",
    fontSize: 10,
    lineHeight: 10 * 1.3,
  },
});
