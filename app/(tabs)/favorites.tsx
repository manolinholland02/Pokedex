import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PokemonList } from '@/components/ui/pokemon-list';
import { AppFonts } from '@/constants/theme';
import { pokemonData } from '@/constants/pokemon';

const favoritePokemon = pokemonData.slice(0, 2);

export default function FavoritesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
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
    color: '#0E0940',
    fontSize: 28,
    fontFamily: AppFonts.cabinetGroteskExtraBold,
  },
});
