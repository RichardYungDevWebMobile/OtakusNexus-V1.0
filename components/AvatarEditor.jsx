import React, { useState } from 'react';
import { View, Image, Button, Text } from 'react-native';

export default function AvatarEditor({ initialUri, onChange }) {
  const [uri, setUri] = useState(initialUri || null);

  const pickImage = async () => {
    // Stub: integrate with ImagePicker (expo-image-picker or react-native-image-picker)
    // Here we just simulate picking by toggling a placeholder.
    const placeholder = 'https://placehold.co/128x128';
    setUri(placeholder);
    if (onChange) onChange(placeholder);
  };

  return (
    <View style={{ alignItems: 'center' }}>
      {uri ? (
        <Image source={{ uri }} style={{ width: 128, height: 128, borderRadius: 64 }} />
      ) : (
        <View style={{ width: 128, height: 128, borderRadius: 64, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' }}>
          <Text>No avatar</Text>
        </View>
      )}
      <View style={{ height: 12 }} />
      <Button title="Pick avatar (stub)" onPress={pickImage} />
    </View>
  );
}
