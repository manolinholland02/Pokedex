import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PokemonImage } from '@/components/ui/pokemon-image';
import { AppFonts } from '@/constants/theme';
import { usePokemonByName } from '@/hooks/use-pokemon';

const typeColors: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

const getTypeColor = (type: string) => typeColors[type.toLowerCase()] ?? '#9AA0A6';

const hasProp = (value: unknown, prop: string): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && prop in value;

const getErrorStatus = (err: unknown): number | null => {
  if (!hasProp(err, 'response')) {
    return null;
  }

  const response = err.response;
  if (!hasProp(response, 'status')) {
    return null;
  }

  const status = response.status;
  return typeof status === 'number' ? status : null;
};

export default function PokemonDetailScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name?: string | string[] }>();
  const nameValue = Array.isArray(name) ? name[0] : name;
  const pokemonName = nameValue ?? '';
  const { data: pokemon, isLoading, error, refetch, isFetching } = usePokemonByName(pokemonName);
  const isMissingName = pokemonName.trim().length === 0;
  const errorStatus = error ? getErrorStatus(error) : null;
  const retryLabel = isFetching ? 'Trying again...' : 'Try again';
  let errorMessage: string | null = null;
  let showRetry = false;

  if (isMissingName) {
    errorMessage = 'Missing Pokemon name.';
  } else if (error) {
    if (errorStatus === 404) {
      errorMessage = 'Pokemon not found';
    } else {
      errorMessage = 'Network error. Check your connection and try again.';
      showRetry = true;
    }
  } else if (!pokemon) {
    errorMessage = 'Pokemon not found';
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={20} color="#0E0940" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5631E8" />
          <Text style={styles.loadingText}>Loading Pokemon...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMessage) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={20} color="#0E0940" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
          {showRetry ? (
            <Pressable
              style={[styles.retryButton, isFetching ? styles.retryButtonDisabled : null]}
              onPress={() => refetch()}
              disabled={isFetching}
            >
              <Text style={styles.retryText}>{retryLabel}</Text>
            </Pressable>
          ) : null}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back" size={20} color="#0E0940" />
        <Text style={styles.backText}>Back</Text>
      </Pressable>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.pokemonName}>{pokemon.name}</Text>
          <Text style={styles.pokemonId}>#{String(pokemon.id).padStart(3, '0')}</Text>
        </View>

        <View style={styles.imageContainer}>
          <PokemonImage id={pokemon.id} size={200} />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Types</Text>
          <View style={styles.typesContainer}>
            {pokemon.types.map((typeInfo) => (
              <View
                key={typeInfo.type.name}
                style={[styles.typeBadge, { backgroundColor: getTypeColor(typeInfo.type.name) }]}
              >
                <Text style={styles.typeText}>{typeInfo.type.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF6FF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    color: '#0E0940',
    fontFamily: AppFonts.rubikMedium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#5631E8',
    fontFamily: AppFonts.rubikMedium,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#0E0940',
    fontFamily: AppFonts.rubikMedium,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#5631E8',
    borderRadius: 8,
  },
  retryButtonDisabled: {
    opacity: 0.6,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: AppFonts.rubikMedium,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  pokemonName: {
    fontSize: 32,
    color: '#0E0940',
    fontFamily: AppFonts.cabinetGroteskExtraBold,
    textTransform: 'capitalize',
  },
  pokemonId: {
    fontSize: 18,
    color: '#5631E8',
    marginTop: 4,
    fontFamily: AppFonts.rubikMedium,
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#0E0940',
    marginBottom: 12,
    fontFamily: AppFonts.rubikBold,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeBadge: {
    backgroundColor: '#5631E8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typeText: {
    color: '#FFFFFF',
    fontFamily: AppFonts.rubikBold,
    textTransform: 'capitalize',
  },
});
