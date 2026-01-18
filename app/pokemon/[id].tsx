import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { pokemonData } from '@/constants/pokemon';
import { AppFonts } from '@/constants/theme';

const typeColors: Record<string, string> = {
  electric: '#F7C12F',
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  ghost: '#705898',
  psychic: '#F85888',
};

function getTypeColor(type: string) {
  const color = typeColors[type.toLowerCase()];
  return color ?? '#9AA0A6';
}

export default function PokemonDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const idValue = Array.isArray(id) ? id[0] : id;
  const pokemonId = idValue ? Number(idValue) : Number.NaN;
  const pokemon = pokemonData.find((item) => item.id === pokemonId);
  let errorMessage: string | null = null;
  const headerTitle = idValue ? `#${String(idValue).padStart(3, '0')}` : 'Pokémon';

  if (!idValue || Number.isNaN(pokemonId)) {
    errorMessage = 'Invalid Pokemon ID.';
  } else if (!pokemon) {
    errorMessage = 'Pokemon not found.';
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back" size={20} color="#0E0940" />
        <Text style={styles.backText}>Back</Text>
      </Pressable>
      {pokemon ? (
        <View style={styles.content}>
          <Text style={styles.title}>{pokemon.name}</Text>
          <Text style={styles.subtitle}>#{String(pokemon.id).padStart(3, '0')}</Text>
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor(pokemon.type) }]}>
            <Text style={styles.typeText}>{pokemon.type}</Text>
          </View>
        </View>
      ) : errorMessage ? (
        <Text style={styles.error}>{errorMessage}</Text>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF6FF',
    padding: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  backText: {
    fontSize: 16,
    color: '#0E0940',
    fontFamily: AppFonts.rubikMedium,
  },
  content: {
    gap: 8,
  },
  title: {
    fontSize: 28,
    color: '#0E0940',
    fontFamily: AppFonts.cabinetGroteskExtraBold,
  },
  subtitle: {
    fontSize: 16,
    color: '#5631E8',
    fontFamily: AppFonts.rubikMedium,
  },
  type: {
    fontSize: 16,
    color: '#0E0940',
    fontFamily: AppFonts.rubikMedium,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: AppFonts.rubikMedium,
  },
  error: {
    fontSize: 16,
    color: '#0E0940',
    fontFamily: AppFonts.rubikMedium,
  },
});
