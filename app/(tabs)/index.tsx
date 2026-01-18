import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Pokemon, PokemonList, PokemonListSkeleton } from '@/components/ui/pokemon-list';
import { POKEMON_LABEL } from '@/constants/labels';
import { AppFonts, CardShadow, HeaderTitleStyle } from '@/constants/theme';
import { useInfinitePokemonList } from '@/hooks/use-pokemon';

const PAGE_LIMIT = 50;
export default function AllPokemonScreen() {
  const {
    data: pokemonList,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePokemonList(PAGE_LIMIT);
  const [searchQuery, setSearchQuery] = useState('');
  const showHeader = searchQuery.trim().length === 0;

  const searchBar = (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputWrapper}>
        <MaterialIcons name="search" size={24} color="#000000" />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search for ${POKEMON_LABEL}...`}
          placeholderTextColor="#b3b3b3"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        {searchBar}
        {showHeader ? (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{`All ${POKEMON_LABEL}`}</Text>
          </View>
        ) : null}
        <PokemonListSkeleton count={6} />
      </SafeAreaView>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.statusText}>{`Error loading ${POKEMON_LABEL}: ${errorMessage}`}</Text>
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

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredItems = normalizedQuery
    ? pokemonItems.filter((item) => item.name.toLowerCase().includes(normalizedQuery))
    : pokemonItems;

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
      {searchBar}
      {showHeader ? (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{`All ${POKEMON_LABEL}`}</Text>
        </View>
      ) : null}
      <PokemonList
        data={filteredItems}
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  searchInputWrapper: {
    ...CardShadow,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 16,
    paddingRight: 16,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#000000',
    fontFamily: AppFonts.interRegular,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerTitle: {
    ...HeaderTitleStyle,
  },
  headerCount: {
    color: '#5631E8',
    fontSize: 14,
    fontFamily: AppFonts.rubikMedium,
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
