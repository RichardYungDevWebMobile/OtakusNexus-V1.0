import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import NewsCard from '../components/NewsCard';
import { fetchLatestNews } from '../features/news/newsService';

export default function NewsListScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetchLatestNews();
        if (mounted) setData(res);
      } catch (e) {
        // ignore for now
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <NewsCard item={item} onPress={(it) => navigation.navigate('NewsDetail', { item: it })} />
        )}
        ListEmptyComponent={() => <View style={styles.empty}><Text style={{ color: '#6b7280' }}>{loading ? 'Chargement...' : 'Aucune news'}</Text></View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  empty: { alignItems: 'center', marginTop: 32 },
});
