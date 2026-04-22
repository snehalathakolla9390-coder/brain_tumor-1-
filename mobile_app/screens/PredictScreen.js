import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView, Image, Alert, Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { getToken } from '../utils/auth';

export default function PredictScreen({ navigation }) {
  const [image, setImage]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission Required', 'Please grant photo library access.');
      return;
    }
    const picker = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    if (!picker.canceled && picker.assets.length > 0) {
      setImage(picker.assets[0]);
      setResult(null);
    }
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission Required', 'Please grant camera access.');
      return;
    }
    const cam = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });
    if (!cam.canceled && cam.assets.length > 0) {
      setImage(cam.assets[0]);
      setResult(null);
    }
  };

  const handlePredict = async () => {
    if (!image) {
      Alert.alert('No Image', 'Please select or capture an MRI image first.');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const token = await getToken();
      const formData = new FormData();
      const uriParts = image.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      formData.append('img', {
        uri: image.uri,
        name: `upload.${fileType}`,
        type: `image/${fileType}`,
      });

      const res = await axios.post(API_ENDPOINTS.PREDICT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      setResult(res.data);
    } catch (err) {
      const msg = err.response?.data?.error || 'Prediction failed. Try again.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const isTumor = result?.prediction === 1;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🧠 MRI Analysis</Text>
        <Text style={styles.subtitle}>Upload a brain MRI scan to detect tumor</Text>
      </View>

      {/* Image Preview */}
      <View style={styles.previewBox}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.previewImage} resizeMode="contain" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderEmoji}>🖼️</Text>
            <Text style={styles.placeholderText}>No image selected</Text>
          </View>
        )}
      </View>

      {/* Pick Buttons */}
      <View style={styles.pickRow}>
        <TouchableOpacity style={styles.pickBtn} onPress={pickImage}>
          <Text style={styles.pickBtnIcon}>📁</Text>
          <Text style={styles.pickBtnText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pickBtn} onPress={takePhoto}>
          <Text style={styles.pickBtnIcon}>📸</Text>
          <Text style={styles.pickBtnText}>Camera</Text>
        </TouchableOpacity>
      </View>

      {/* Predict Button */}
      <TouchableOpacity
        style={[styles.predictBtn, !image && styles.predictBtnDisabled]}
        onPress={handlePredict}
        disabled={loading || !image}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.predictBtnText}>🔍 Analyze MRI Image</Text>}
      </TouchableOpacity>

      {/* Result Card */}
      {result && (
        <View style={[styles.resultCard, isTumor ? styles.resultDanger : styles.resultSafe]}>
          <Text style={styles.resultIcon}>{isTumor ? '⚠️' : '✅'}</Text>
          <Text style={styles.resultTitle}>{result.result_text}</Text>
          <Text style={styles.resultMsg}>
            {isTumor
              ? 'A potential tumor has been detected in this MRI scan. Please consult a medical professional immediately.'
              : 'No tumor was detected. However, always consult a doctor for a professional diagnosis.'}
          </Text>
          <TouchableOpacity
            style={styles.resultBtn}
            onPress={() => navigation.navigate('ResultDetail', { result, imageUri: image.uri })}
          >
            <Text style={styles.resultBtnText}>View Full Report →</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  previewBox: {
    marginHorizontal: 20,
    height: 250,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: { alignItems: 'center' },
  placeholderEmoji: { fontSize: 56, marginBottom: 10 },
  placeholderText: { color: '#6b7280', fontSize: 14 },
  pickRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  pickBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  pickBtnIcon: { fontSize: 28, marginBottom: 4 },
  pickBtnText: { color: '#4b5563', fontSize: 13, fontWeight: '600' },
  predictBtn: {
    backgroundColor: '#2563eb',
    marginHorizontal: 20,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
  },
  predictBtnDisabled: { backgroundColor: '#94a3b8', shadowOpacity: 0 },
  predictBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  resultCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  resultDanger: {
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(239,68,68,0.2)',
  },
  resultSafe: {
    backgroundColor: 'rgba(34,197,94,0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(34,197,94,0.2)',
  },
  resultIcon: { fontSize: 48, marginBottom: 10 },
  resultTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultMsg: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  resultBtn: {
    backgroundColor: 'rgba(37,99,235,0.1)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.2)',
  },
  resultBtnText: { color: '#2563eb', fontWeight: '700', fontSize: 14 },
});
