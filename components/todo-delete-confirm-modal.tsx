import DeleteIcon from "@/assets/icons/delete-icon.svg";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
interface TodoDeleteConfirmModalProps {
  // 모달 표시 여부
  visible: boolean;
  // 모달 닫기 함수
  onClose: () => void;
  // '일정 삭제' 액션 함수 (삭제 확인 모달 열기)
  onConfirmDelete: () => void;
}

export default function TodoDeleteConfirmModal({
  visible,
  onClose,
  onConfirmDelete,
}: TodoDeleteConfirmModalProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={confirmStyles.center}>
        <View style={confirmStyles.card}>
          <View style={confirmStyles.iconCircle}>
            <DeleteIcon />
          </View>
          <Text style={confirmStyles.title}>1개의 일정을 삭제하시겠어요?</Text>
          <Text style={confirmStyles.sub}>삭제하면 복구가 불가능합니다.</Text>
          <View style={confirmStyles.actions}>
            <Pressable style={confirmStyles.btnGhost} onPress={onClose}>
              <Text style={confirmStyles.btnGhostText}>취소</Text>
            </Pressable>
            <Pressable
              style={confirmStyles.btnDanger}
              onPress={onConfirmDelete}
            >
              <Text style={confirmStyles.btnDangerText}>삭제</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const confirmStyles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF1F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  // icon: { width: 22, height: 22, tintColor: "#EC221F" },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginTop: 4,
    textAlign: "center",
  },
  sub: { fontSize: 13, color: "#6B7280", marginTop: 6, textAlign: "center" },
  actions: { flexDirection: "row", marginTop: 16, gap: 10 },
  btnGhost: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  btnGhostText: { fontSize: 15, fontWeight: "600", color: "#111827" },
  btnDanger: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F87171",
    alignItems: "center",
    justifyContent: "center",
  },
  btnDangerText: { fontSize: 15, fontWeight: "700", color: "#fff" },
});
