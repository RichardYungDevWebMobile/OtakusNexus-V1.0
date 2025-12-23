import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ConfirmModal({ visible, onClose, onConfirm, title = 'Confirmer', description }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.desc}>{description}</Text> : null}
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.cancel]} onPress={onClose}>
              <Text style={{ color: '#5B7CFA', fontWeight: '700' }}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.confirm]} onPress={onConfirm}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Confirmer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(6,8,23,0.45)', alignItems: 'center', justifyContent: 'center' },
  card: { width: '86%', backgroundColor: '#fff', padding: 18, borderRadius: 12 },
  title: { fontSize: 18, fontWeight: '800' },
  desc: { color: '#6b7280', marginTop: 8 },
  row: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 },
  btn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, marginLeft: 8 },
  cancel: { backgroundColor: '#f3f6ff' },
  confirm: { backgroundColor: '#5B7CFA' },
});
