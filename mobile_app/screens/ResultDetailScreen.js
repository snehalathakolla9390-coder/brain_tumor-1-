import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity
} from 'react-native';

export default function ResultDetailScreen({ route, navigation }) {
  const { result, imageUri } = route.params || {};
  const isTumor = result?.prediction === 1;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={[styles.banner, isTumor ? styles.bannerDanger : styles.bannerSafe]}>
        <Text style={styles.bannerIcon}>{isTumor ? '⚠️' : '✅'}</Text>
        <Text style={styles.bannerTitle}>{result?.result_text || 'Result'}</Text>
        <Text style={styles.bannerSub}>
          {isTumor ? 'Please consult a specialist' : 'No tumor detected'}
        </Text>
      </View>

      {/* MRI Image */}
      {imageUri && (
        <View style={styles.imageBox}>
          <Text style={styles.sectionLabel}>Analyzed MRI Scan</Text>
          <Image source={{ uri: imageUri }} style={styles.mriImage} resizeMode="contain" />
        </View>
      )}

      {/* Report Card */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Diagnosis Report</Text>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Status</Text>
          <View style={[styles.statusBadge, isTumor ? styles.badgeDanger : styles.badgeSafe]}>
            <Text style={[styles.statusText, { color: isTumor ? '#f87171' : '#4ade80' }]}>
              {isTumor ? 'TUMOR DETECTED' : 'NO TUMOR'}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Prediction Code</Text>
          <Text style={styles.rowValue}>{result?.prediction ?? 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Model</Text>
          <Text style={styles.rowValue}>CNN (Brain Tumor Detection)</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Image Type</Text>
          <Text style={styles.rowValue}>Brain MRI Scan</Text>
        </View>
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          ⚕️ <Text style={{ fontWeight: '700' }}>Medical Disclaimer:</Text> This result is AI-generated and is for screening
          purposes only. Always consult a certified radiologist or neurologist for a clinical diagnosis.
        </Text>
      </View>

      {/* Actions */}
      <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
        <Text style={styles.btnText}>← Analyze Another Image</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    paddingBottom: 40,
  },
  banner: {
    paddingTop: 60,
    paddingBottom: 36,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  bannerDanger: { backgroundColor: 'rgba(239,68,68,0.12)' },
  bannerSafe:   { backgroundColor: 'rgba(34,197,94,0.10)' },
  bannerIcon:   { fontSize: 60, marginBottom: 10 },
  bannerTitle:  { fontSize: 24, fontWeight: '800', color: '#1f2937', textAlign: 'center' },
  bannerSub:    { color: '#6b7280', marginTop: 6, fontSize: 14 },

  imageBox: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  sectionLabel: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  mriImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },

  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  rowLabel: { color: '#6b7280', fontSize: 14 },
  rowValue: { color: '#1f2937', fontSize: 14, fontWeight: '600' },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeDanger: { backgroundColor: 'rgba(239,68,68,0.15)' },
  badgeSafe:   { backgroundColor: 'rgba(34,197,94,0.12)' },
  statusText:  { fontWeight: '800', fontSize: 12, letterSpacing: 0.5 },

  disclaimer: {
    margin: 20,
    backgroundColor: 'rgba(37,99,235,0.05)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.15)',
  },
  disclaimerText: {
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 20,
  },

  btn: {
    marginHorizontal: 20,
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
