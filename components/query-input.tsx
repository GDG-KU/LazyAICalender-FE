// components/QueryInput.tsx
import React, { useState } from "react";
import { Keyboard, Pressable, StyleSheet, TextInput, View } from "react-native";

import SendButton from "@/assets/icons/send-icon.svg";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface QueryInputProps {
  onAddTodo: (text: string) => void;
  onExpand?: () => void;
}

export default function QueryInput({ onAddTodo, onExpand }: QueryInputProps) {
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
            placeholder="어떤 일정을 추가할까요?"
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

// 위는 서연님 코드, 이 파을 기준으로 main branch에 합칠거임

// import React, { useState } from "react";
// import {
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
//   StyleSheet,
//   TextInput,
//   View,
// } from "react-native";

// import SendIcon from "@/assets/icons/send-icon.svg";
// import { LinearGradient } from "expo-linear-gradient";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// // 일정 추가용 / AI 상호작용 대화창 component
// interface QueryInputProps {
//   onAddTodo: (text: string) => void;
// }
// export default function QueryInput({ onAddTodo }: QueryInputProps) {
//   const [text, setText] = useState<string>("");
//   const insets = useSafeAreaInsets();
//   // TextInput의 변화를 감지해서 그 안의 내용을 text라는 state에 저장
//   const onChangeText = (text: string) => {
//     setText(text);
//   };

//   // 전송 버튼 누를 시 trigger되는 함수, 추후 백엔드와 연결 필요
//   const addSchedule = () => {
//     if (!text.trim()) return;
//     onAddTodo(text);
//     console.log("schedule added");
//     setText("");
//     Keyboard.dismiss();
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={[
//         // styles.inputContainer,
//         // { paddingBottom: 8 + insets.bottom,
//         {
//           position: "absolute",
//           bottom: insets.bottom,
//           width: "100%",
//           zIndex: 8,
//         },
//         // 안전 영역 패딩을 KAV에 직접 적용
//         { paddingBottom: insets.bottom },
//       ]}
//     >
//       <View style={styles.styleWrapper}>
//         <Pressable onPress={Keyboard.dismiss}>
//           {/* <View style={styles.innerWrapper}> */}
//           <View style={styles.inner}>
//             <TextInput
//               value={text}
//               placeholder="어떤 일정을 추가할까요?"
//               placeholderTextColor="#767676"
//               returnKeyType="send"
//               // multiline=true일 경우 iOS에 대해 RN가 자동적으로 paddingTop을 추가하기에
//               // 그를 막기 위한 추가 CSS style
//               // textAlignVertical: "top" 추가해야 하나 보기, multiline input에 대해 효과적인 스타일
//               style={[styles.textInput, { paddingTop: 0 }]}
//               multiline={true}
//               submitBehavior="blurAndSubmit"
//               onChangeText={onChangeText}
//               onSubmitEditing={addSchedule}
//             />
//             {/* 전송 버튼 */}
//             <Pressable style={styles.btnContainer} onPress={addSchedule}>
//               {/* onPress prop 추가하기 */}
//               <LinearGradient
//                 colors={["#F2A892", "#D79EBF", "#AC95F5"]}
//                 start={{ x: 0.0, y: 0.0 }}
//                 end={{ x: 1.0, y: 0.0 }}
//                 locations={[0.1531, 0.5024, 0.8517]}
//                 style={styles.gradientBorder}
//               >
//                 <View style={styles.addButton}>
//                   <SendIcon />
//                 </View>
//               </LinearGradient>
//             </Pressable>
//           </View>
//           {/* </View> */}
//         </Pressable>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   styleWrapper: {
//     backgroundColor: "#1E1E1E",
//     paddingTop: 8,
//     paddingHorizontal: 8,
//     gap: 8,
//     borderRadius: 100,
//     width: "91%",
//     alignSelf: "center", // 중앙 정렬

//     // 그림자 스타일을 여기에 모두 옮깁니다.
//     shadowColor: "#0C0C0D",
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.16,
//     shadowRadius: 25,
//     elevation: 15,

//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   inputContainer: {
//     position: "absolute",
//     // bottom: 8,
//     backgroundColor: "#1E1E1E",
//     // backgroundColor: "transparent",
//     // flex: 1,
//     paddingTop: 8,
//     paddingHorizontal: 8,

//     gap: 8,
//     // alignSelf: "center",

//     borderRadius: 100,
//     // borderTopLeftRadius: 40,
//     // borderTopRightRadius: 40,

//     width: "91%",
//     alignSelf: "center",

//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",

//     // Web CSS에서 사용하는 아래와 같은 스타일은 사용 불가
//     // boxShadow: "0 0 50 10 rgba(12,12,13,0.16)",
//     // Shadow Styles for iOS
//     shadowColor: "#0C0C0D",
//     shadowOffset: {
//       width: 0,
//       height: 0,
//     },
//     shadowOpacity: 0.16,
//     shadowRadius: 25, // Figma Blur 값 / 2 정도가 일반적 계산

//     // Shadow Styles for Android
//     // 추가로 더 설정할 수 있는 부분이 있음
//     // RN docs
//     // dropShadow: Adds a shadow around the alpha mask of the View (only non-zero alpha pixels in the View will cast a shadow). Takes an optional color representing the shadow color, and 2 or 3 lengths. If 2 lengths are specified they are interperted as offsetX and offsetY which will translate the shadow in the X and Y dimensions respectfully. If a 3rd length is given it is interpreted as the standard deviation of the Guassian blur used on the shadow - so a larger value will blur the shadow more. Read more about the arguments in
//     // https://reactnative.dev/docs/view-style-props#filter
//     elevation: 15,
//     zIndex: 8,
//   },
//   // innerWrapper: {
//   //   backgroundColor: "#1E1E1E", // ✅ 진짜 배경색은 여기!
//   //   borderRadius: 100,
//   //   width: "100%",
//   // },
//   inner: {
//     // inputContainer에 paddingBottom을 적용하는 건 KeyboardAvoidingView 때문에 안됨
//     // 대신 inner에 paddingBottom을 적용하는 걸로 대체
//     // paddingBottom: 16,
//     paddingLeft: 16,
//     // 원래는 inputContainer에 적용되어야 하는 스타일인데 SafeAreaView issue로 부득이하게 여기에 적용
//     paddingBottom: 8,
//     alignItems: "center",
//     alignSelf: "stretch",
//     justifyContent: "space-between",
//     flexDirection: "row",
//     width: "100%",
//   },
//   textInput: {
//     backgroundColor: "#1E1E1E",
//     fontSize: 20,
//     lineHeight: 20 * 1.4,
//     // height: "100%",
//     // width: "100%",
//     // textAlignVertical: "bottom",
//   },
//   btnContainer: {
//     backgroundColor: "1E1E1E",
//   },
//   // borderColor에 LinearGradient를 적용하는 것은 어려움,
//   // gradientBorder에 비해 addButton을 약간 작게 만들어 마치 테두리를 준 것처럼 보이게 하기
//   gradientBorder: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     padding: 2,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   addButton: {
//     justifyContent: "center",
//     alignItems: "center",
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: "#1E1E1E",
//   },
// });
