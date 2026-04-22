import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Alert
} from 'react-native';
import { clearAuth } from '../utils/auth';

export default function AdminDashboardScreen({ navigation }) {
  const handleLogout = async () => {
    Alert.alert('Logout', 'Logout from admin?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await clearAuth();
          navigation.replace('AdminLogin');
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Admin Portal 🛡️</Text>
          <Text style={styles.adminName}>Administrator</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { emoji: '👥', label: 'Total Users', color: '#2563eb' },
          { emoji: '📊', label: 'Total Scans', color: '#3b82f6' },
          { emoji: '⚠️', label: 'Tumor Cases', color: '#ef4444' },
        ].map((s, i) => (
          <View key={i} style={styles.statCard}>
            <Text style={styles.statEmoji}>{s.emoji}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Admin Actions */}
      <Text style={styles.sectionTitle}>Admin Actions</Text>
      {[
        { emoji: '👥', title: 'Manage Users', sub: 'View, activate, delete users', color: '#2563eb', action: () => Alert.alert('Info', 'User management opens the web admin panel.') },
        { emoji: '📂', title: 'View Scan Logs', sub: 'All uploaded MRI results', color: '#3b82f6', action: () => Alert.alert('Scan Logs', 'Feature coming soon!') },
        { emoji: '🧠', title: 'Model Info', sub: 'CNN model statistics', color: '#2563eb', action: () => Alert.alert('Model', 'CNN with 4 layers. Trained on brain tumor dataset.') },
        { emoji: '⚙️', title: 'Settings', sub: 'App configuration', color: '#64748b', action: () => Alert.alert('Settings', 'Admin settings coming soon!') },
      ].map((item, i) => (
        <TouchableOpacity key={i} style={styles.actionRow} onPress={item.action}>
          <View style={styles.actionIcon}>
            <Text style={styles.actionEmoji}>{item.emoji}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>{item.title}</Text>
            <Text style={styles.actionSub}>{item.sub}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  greeting: { color: '#2563eb', fontSize: 13, fontWeight: '600' },
  adminName: { color: '#1f2937', fontSize: 22, fontWeight: '800', marginTop: 2 },
  logoutBtn: {
    backgroundColor: 'rgba(37,99,235,0.1)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.3)',
  },
  logoutText: { color: '#2563eb', fontWeight: '700', fontSize: 13 },

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statEmoji: { fontSize: 26, marginBottom: 6 },
  statLabel: { color: '#6b7280', fontSize: 11, textAlign: 'center' },

  sectionTitle: {
    color: '#1f2937',
    fontWeight: '700',
    fontSize: 17,
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  actionIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    backgroundColor: 'rgba(37,99,235,0.1)',
    borderColor: 'rgba(37,99,235,0.3)',
  },
  actionEmoji: { fontSize: 22 },
  actionTitle: { color: '#1f2937', fontWeight: '700', fontSize: 15, marginBottom: 2 },
  actionSub: { color: '#6b7280', fontSize: 12 },
  chevron: { color: '#2563eb', fontSize: 22, fontWeight: '300' },
});
