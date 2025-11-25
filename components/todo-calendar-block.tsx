import { StyleSheet, Text, View } from "react-native";
export default function TodoCalendarBlock() {
  return (
    <View style={styles.todoBlock}>
      <Text style={styles.todoText}>Yap!</Text>
      {/* 글자가 넘어가는 것 자체는 구현함, 그런데 이제 3개 이상의 content가 들어올 때가 관건 */}
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
