import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator,
  KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    name: '', email: '', password: '', locality: '', address: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let e = {};
    if (!form.name.trim())          e.name     = 'Name is required';
    if (!form.email.includes('@'))   e.email    = 'Valid email required';
    if (form.password.length < 6)   e.password = 'Password min 6 characters';
    if (!form.locality.trim())       e.locality = 'Locality is required';
    if (!form.address.trim())        e.address  = 'Address is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await axios.post(API_ENDPOINTS.REGISTER, {
        name:     form.name,
        email:    form.email,
        password: form.password,
        locality: form.locality,
        address:  form.address,
      });
      Alert.alert('Success', 'Account created! You can now log in.', [
        { text: 'Login', onPress: () => navigation.navigate('UserLogin') }
      ]);
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed. Try again.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, field, placeholder, secureTextEntry = false, keyboardType = 'default' }) => (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, errors[field] && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={form[field]}
        onChangeText={(t) => setForm({ ...form, [field]: t })}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
      {errors[field] ? <Text style={styles.errorText}>{errors[field]}</Text> : null}
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>🧠</Text>
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Brain Tumor Detector</Text>
        </View>

        {/* Form */}
        <View style={styles.card}>
          <Field label="Full Name"    field="name"     placeholder="Enter full name" />
          <Field label="Email"        field="email"    placeholder="Enter email" keyboardType="email-address" />
          <Field label="Password"     field="password" placeholder="Min 6 characters" secureTextEntry />
          <Field label="Locality"     field="locality" placeholder="Enter locality" />
          <Field label="Full Address" field="address"  placeholder="Enter full address" />

          <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Register</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('UserLogin')}>
            <Text style={styles.linkText}>Already have an account? <Text style={styles.linkHighlight}>Login</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: '#ffffff',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(37,99,235,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(37,99,235,0.3)',
  },
  iconEmoji: { fontSize: 38 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f2937',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  fieldWrap: { marginBottom: 16 },
  label: {
    color: '#4b5563',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    color: '#1f2937',
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
  },
  inputError: { borderColor: '#ef4444' },
  errorText: { color: '#ef4444', fontSize: 12, marginTop: 4 },
  btn: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 0.5 },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#6b7280', fontSize: 14 },
  linkHighlight: { color: '#2563eb', fontWeight: '700' },
});
