// components/agent/event-create-modal.tsx
import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";

type Props = {
  visible: boolean;
  eventText: string;                 // 사용자가 입력한 일정 제목
  onClose: () => void;
  onConfirm: (opt: { category: string; isTodo: boolean }) => void;
};

const CATEGORIES = ["업무", "개인", "건강", "여행", "기타"];

export default function EventCreateModal({ visible, eventText, onClose, onConfirm }: Props) {
  const [category, setCategory] = useState<string>("기타");
  const [isTodo, setIsTodo] = useState<boolean>(true);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>이 일정 어떻게 추가할까요?</Text>
          <Text style={styles.sub} numberOfLines={2}>{eventText}</Text>

          <Text style={styles.label}>카테고리</Text>
          <View style={styles.rowWrap}>
            {CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setCategory(c)}
                style={[styles.pill, category === c && styles.pillActive]}
              >
                <Text style={[styles.pillTxt, category === c && styles.pillTxtActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.label}>투두(체크박스 표시)</Text>
            <Switch value={isTodo} onValueChange={setIsTodo} />
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.btnGhost} onPress={onClose}>
              <Text style={styles.btnGhostTxt}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={() => onConfirm({ category, isTodo })}
            >
              <Text style={styles.btnPrimaryTxt}>추가</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex:1, backgroundColor:"rgba(0,0,0,0.35)", justifyContent:"center", alignItems:"center", padding:24 },
  card: { width:"100%", maxWidth:360, backgroundColor:"#fff", borderRadius:16, padding:18 },
  title: { fontSize:16, fontWeight:"700", color:"#111" },
  sub: { marginTop:6, color:"#6B7280" },
  label: { marginTop:14, fontSize:14, fontWeight:"700", color:"#111" },
  rowWrap: { flexDirection:"row", flexWrap:"wrap", gap:8, marginTop:8 },
  pill: { paddingHorizontal:12, paddingVertical:8, borderRadius:12, backgroundColor:"#F3F4F6" },
  pillActive: { backgroundColor:"#4C8BF5" },
  pillTxt: { color:"#111" },
  pillTxtActive: { color:"#fff", fontWeight:"700" },
  switchRow: { marginTop:12, flexDirection:"row", justifyContent:"space-between", alignItems:"center" },
  actions: { flexDirection:"row", gap:10, marginTop:16 },
  btnGhost: { flex:1, height:44, borderRadius:12, backgroundColor:"#F3F4F6", alignItems:"center", justifyContent:"center" },
  btnGhostTxt: { fontWeight:"700", color:"#111" },
  btnPrimary: { flex:1, height:44, borderRadius:12, backgroundColor:"#4C8BF5", alignItems:"center", justifyContent:"center" },
  btnPrimaryTxt: { fontWeight:"700", color:"#fff" },
});
