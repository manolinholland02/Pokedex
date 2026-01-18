import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppFonts } from '@/constants/theme';
import { pokemonData } from '@/constants/pokemon';

export default function PokemonScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Pokémon</Text>
      </View>
      <FlatList
        data={pokemonData}
        renderItem={({ item }) => (
          <Pressable
            style={styles.cardShadow}
            onPress={() => Alert.alert('Pokemon pressed', `You pressed ${item.name}.`)}>
            <View style={styles.card}>
              <View style={styles.cardBackground}>
                <View style={styles.idBadge}>
                  <Text style={styles.idText}>{String(item.id).padStart(3, '0')}</Text>
                </View>
              </View>
              <View style={styles.nameSection}>
                <Text style={styles.name}>{item.name}</Text>
              </View>
            </View>
          </Pressable>
        )}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        numColumns={2}
        columnWrapperStyle={styles.column}
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
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
  separator: {
    height: 12,
  },
  column: {
    gap: 12,
    marginBottom: 12,
  },
  cardShadow: {
    flex: 1,
    aspectRatio: 163 / 211,
    borderRadius: 8,
    shadowColor: '#303773',
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  card: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  cardBackground: {
    flex: 1,
    backgroundColor: '#F6F6FF',
    padding: 12,
  },
  nameSection: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  idBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#5631E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  idText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: AppFonts.rubikMedium,
  },
  name: {
    color: '#0E0940',
    fontSize: 22,
    fontFamily: AppFonts.rubikMedium,
  },
});
