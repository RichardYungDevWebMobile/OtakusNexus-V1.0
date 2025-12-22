import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { register } from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (password !== confirm) return Alert.alert('Validation', 'Passwords do not match');
    setLoading(true);
    try {
      await register({ email, password });
      Alert.alert('Success', 'Account created (stub)');
      navigation.replace('Login');
    } catch (err) {
      Alert.alert('Registration failed', err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Register</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" style={{ borderWidth: 1, borderColor: '#ddd', padding: 8, marginBottom: 8 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, borderColor: '#ddd', padding: 8, marginBottom: 8 }} />
      <TextInput placeholder="Confirm Password" value={confirm} onChangeText={setConfirm} secureTextEntry style={{ borderWidth: 1, borderColor: '#ddd', padding: 8, marginBottom: 12 }} />
      <Button title={loading ? 'Creating...' : 'Create Account'} onPress={handleRegister} disabled={loading} />
    </View>
  );
}
