import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Alert
} from 'react-native';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { getToken, getUser, clearAuth } from '../utils/auth';

export default function UserDashboardScreen({ navigation }) {
  const [user, setUser]         = useState(null);
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const storedUser = await getUser();
    setUser(storedUser);
    try {
      const token = await getToken();
      const res = await axios.get(API_ENDPOINTS.DASHBOARD, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setDashData(res.data);
    } catch (err) {
      // Could be unauthenticated - still show basic dashboard
      setDashData({ message: 'Welcome to your dashboard' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await clearAuth();
          navigation.replace('UserLogin');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Good day 👋</Text>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🧠</Text>
          <Text style={styles.statNum}>MRI</Text>
          <Text style={styles.statLabel}>Scans</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>✅</Text>
          <Text style={styles.statNum}>Safe</Text>
          <Text style={styles.statLabel}>Results</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>⚠️</Text>
          <Text style={styles.statNum}>Alert</Text>
          <Text style={styles.statLabel}>Results</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Predict')}
        >
          <Text style={styles.actionEmoji}>🔬</Text>
          <Text style={styles.actionTitle}>Analyze MRI</Text>
          <Text style={styles.actionSub}>Upload & predict tumor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => Alert.alert('History', 'Scan history coming soon!')}
        >
          <Text style={styles.actionEmoji}>📋</Text>
          <Text style={styles.actionTitle}>Scan History</Text>
          <Text style={styles.actionSub}>View past results</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => Alert.alert('Profile', 'Profile editing coming soon!')}
        >
          <Text style={styles.actionEmoji}>👤</Text>
          <Text style={styles.actionTitle}>My Profile</Text>
          <Text style={styles.actionSub}>Update your info</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => Alert.alert('Help', 'For medical assistance, consult a certified neurologist.')}
        >
          <Text style={styles.actionEmoji}>ℹ️</Text>
          <Text style={styles.actionTitle}>About</Text>
          <Text style={styles.actionSub}>App information</Text>
        </TouchableOpacity>
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Text style={styles.infoBannerTitle}>🧠 Brain Tumor Detector</Text>
        <Text style={styles.infoBannerText}>
          Upload a brain MRI scan to instantly detect the presence of a tumor using our
          AI-powered Convolutional Neural Network model.
        </Text>
        <TouchableOpacity style={styles.startBtn} onPress={() => navigation.navigate('Predict')}>
          <Text style={styles.startBtnText}>Start Analysis →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { color: '#6b7280', marginTop: 14, fontSize: 14 },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  greeting: { color: '#6b7280', fontSize: 14 },
  userName: { color: '#1f2937', fontSize: 22, fontWeight: '800', marginTop: 2 },
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
  statNum: { color: '#1f2937', fontWeight: '800', fontSize: 15 },
  statLabel: { color: '#6b7280', fontSize: 11, marginTop: 2 },

  sectionTitle: {
    color: '#1f2937',
    fontWeight: '700',
    fontSize: 17,
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 14,
    gap: 12,
    marginBottom: 28,
  },
  actionCard: {
    width: '46%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  actionEmoji: { fontSize: 30, marginBottom: 10 },
  actionTitle: { color: '#1f2937', fontWeight: '700', fontSize: 15, marginBottom: 4 },
  actionSub: { color: '#6b7280', fontSize: 12 },

  infoBanner: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(37,99,235,0.08)',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.2)',
  },
  infoBannerTitle: { color: '#1f2937', fontWeight: '800', fontSize: 17, marginBottom: 8 },
  infoBannerText: { color: '#4b5563', fontSize: 13, lineHeight: 20, marginBottom: 16 },
  startBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
