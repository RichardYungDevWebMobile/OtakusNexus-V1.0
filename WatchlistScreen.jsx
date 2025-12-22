import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { fetchWatchlist } from './services/api';

export default function WatchlistScreen({ navigation }) {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchWatchlist()
      .then((data) => {
        if (mounted) setWatchlist(data || []);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Watchlist</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={watchlist}
          keyExtractor={(item) => item.id?.toString() || item.title}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('AnimeDetail', { animeId: item.id, anime: item })}
              style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' }}
            >
              <Text style={{ fontSize: 16 }}>{item.title}</Text>
              <Text style={{ color: '#666' }}>{item.status}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text>No items in watchlist.</Text>}
        />
      )}
    </View>
  );
}
