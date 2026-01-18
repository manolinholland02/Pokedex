import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PokemonList } from '@/components/ui/pokemon-list';
import { RetryButton } from '@/components/ui/retry-button';
import { POKEMON_LABEL } from '@/constants/labels';
import { AppFonts, HeaderTitleStyle } from '@/constants/theme';
import { useFavorites } from '@/hooks/use-favorites';

export default function FavoritesScreen() {
  const { data: favorites, isLoading, error, refetch, isFetching } = useFavorites();
  const favoritePokemon =
    favorites?.map((favorite) => ({
      id: favorite.id,
      name: favorite.name,
      type: '',
    })) ?? [];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My favorites</Text>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#5631E8" />
          <Text style={styles.statusText}>Loading favorites...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My favorites</Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.statusText}>Unable to load favorites</Text>
          <Text style={styles.statusSubtext}>Please try again in a moment.</Text>
          <RetryButton isFetching={isFetching} onPress={() => refetch()} />
        </View>
      </SafeAreaView>
    );
  }

  if (favoritePokemon.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My favorites</Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.statusText}>No favorites yet</Text>
          <Text style={styles.statusSubtext}>
            {`Tap the heart icon on any ${POKEMON_LABEL} to add it to your favorites.`}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My favorites</Text>
      </View>
      <PokemonList data={favoritePokemon} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF6FF',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerTitle: {
    ...HeaderTitleStyle,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statusText: {
    marginTop: 12,
    color: '#0E0940',
    fontSize: 16,
    fontFamily: AppFonts.rubikMedium,
    textAlign: 'center',
  },
  statusSubtext: {
    marginTop: 8,
    color: '#86839F',
    fontSize: 14,
    fontFamily: AppFonts.rubikRegular,
    textAlign: 'center',
  },
});
