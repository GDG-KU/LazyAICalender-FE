import CopyIcon from "@/components/copy-icon";
import DeleteIcon from "@/components/delete-icon";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface TodoActionSheetModalProps {
  // 모달 표시 여부
  visible: boolean;
  // 모달 닫기 함수
  onClose: () => void;
  // '일정 삭제' 액션 함수 (삭제 확인 모달 열기)
  onAskDelete: () => void;
  // '일정 복사' 액션 함수
  onDuplicate: () => void;
}

export default function TodoActionSheetModal({
  visible,
  onClose,
  onAskDelete,
  onDuplicate,
}: TodoActionSheetModalProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={sheetStyles.backdrop} onPress={onClose}>
        <View style={sheetStyles.sheet}>
          <Pressable style={sheetStyles.rowDanger} onPress={onAskDelete}>
            <View style={sheetStyles.iconBox}>
              <DeleteIcon />
            </View>
            <Text style={sheetStyles.dangerText}>일정 삭제</Text>
          </Pressable>
          <Pressable style={sheetStyles.row} onPress={onDuplicate}>
            <View style={sheetStyles.iconBox}>
              <CopyIcon />
            </View>
            <Text style={sheetStyles.rowText}>일정 복사</Text>
          </Pressable>
          <Pressable style={sheetStyles.cancel} onPress={onClose}>
            <Text style={sheetStyles.cancelText}>취소</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const sheetStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  rowDanger: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  iconBox: { width: 28, alignItems: "center", marginRight: 12 },
  // 아이콘 스타일은 삭제하거나 주석 처리합니다.
  // icon: { width: 20, height: 20, tintColor: "#6B7280" },
  // iconDanger: { width: 20, height: 20, tintColor: "#EC221F" },
  dangerText: { color: "#EC221F", fontSize: 16, fontWeight: "600" },
  rowText: { color: "#111827", fontSize: 16, fontWeight: "600" },
  cancel: {
    marginTop: 8,
    marginHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    paddingVertical: 12,
  },
  cancelText: { fontSize: 16, color: "#111827", fontWeight: "600" },
});
