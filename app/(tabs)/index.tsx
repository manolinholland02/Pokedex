import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Pokemon, PokemonList, PokemonListSkeleton } from '@/components/ui/pokemon-list';
import { Skeleton } from '@/components/ui/skeleton';
import { AppFonts } from '@/constants/theme';
import { useInfinitePokemonList } from '@/hooks/use-pokemon';

const PAGE_LIMIT = 20;

export default function AllPokemonScreen() {
  const {
    data: pokemonList,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePokemonList(PAGE_LIMIT);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>All PokAcmon</Text>
          <Skeleton width={140} height={14} borderRadius={6} style={styles.headerSkeleton} />
        </View>
        <PokemonListSkeleton count={6} />
      </SafeAreaView>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.statusText}>Error loading Pokémon: {errorMessage}</Text>
      </SafeAreaView>
    );
  }

  const pokemonItems: Pokemon[] = [];
  for (const page of pokemonList?.pages ?? []) {
    for (const item of page.results ?? []) {
      if (!item.id) {
        continue;
      }

      const id = Number(item.id);
      if (!Number.isNaN(id)) {
        pokemonItems.push({ id, name: item.name, type: '' });
      }
    }
  }

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  const footer = isFetchingNextPage ? (
    <View style={styles.footer}>
      <ActivityIndicator size="small" />
      <Text style={styles.footerText}>Loading more...</Text>
    </View>
  ) : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Pokémon</Text>
        <Text style={styles.headerCount}>Pokémon ({pokemonItems.length})</Text>
      </View>
      <PokemonList
        data={pokemonItems}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        ListFooterComponent={footer}
      />
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
    color: '#0E0940',
    fontSize: 28,
    fontFamily: AppFonts.cabinetGroteskExtraBold,
  },
  headerCount: {
    color: '#5631E8',
    fontSize: 14,
    fontFamily: AppFonts.rubikMedium,
  },
  headerSkeleton: {
    marginTop: 6,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#EDF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  statusText: {
    marginTop: 12,
    color: '#0E0940',
    fontSize: 16,
    fontFamily: AppFonts.rubikMedium,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    marginTop: 6,
    color: '#0E0940',
    fontSize: 12,
    fontFamily: AppFonts.rubikMedium,
  },
});
