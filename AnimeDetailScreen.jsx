import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, ScrollView } from 'react-native';
import { fetchAnimeById } from './services/api';

export default function AnimeDetailScreen({ route, navigation }) {
  const { animeId, anime } = route.params || {};
  const [details, setDetails] = useState(anime || null);
  const [loading, setLoading] = useState(!anime);

  useEffect(() => {
    let mounted = true;
    if (!details && animeId) {
      fetchAnimeById(animeId)
        .then((data) => mounted && setDetails(data))
        .catch(() => {})
        .finally(() => mounted && setLoading(false));
    }
    return () => (mounted = false);
  }, [animeId]);

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading...</Text>
    </View>
  );

  if (!details) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Anime not found.</Text>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {details.image && (
        <Image source={{ uri: details.image }} style={{ width: '100%', height: 240, borderRadius: 8 }} />
      )}
      <Text style={{ fontSize: 24, marginTop: 12 }}>{details.title}</Text>
      <Text style={{ color: '#666', marginVertical: 8 }}>{details.synopsis}</Text>
      <View style={{ marginTop: 12 }}>
        <Text>Episodes: {details.episodes ?? 'N/A'}</Text>
        <Text>Score: {details.score ?? 'N/A'}</Text>
      </View>
      <View style={{ marginTop: 20 }}>
        <Button title="Add to Watchlist" onPress={() => { /* stub: add to watchlist */ }} />
      </View>
    </ScrollView>
  );
}
