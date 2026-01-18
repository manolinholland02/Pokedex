import { FlatList, FlatListProps, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppFonts } from '@/constants/theme';

export interface Pokemon {
  id: number;
  name: string;
  type: string;
}

type PokemonListProps = {
  data: Pokemon[];
  onEndReached?: FlatListProps<Pokemon>['onEndReached'];
  onEndReachedThreshold?: FlatListProps<Pokemon>['onEndReachedThreshold'];
  ListFooterComponent?: FlatListProps<Pokemon>['ListFooterComponent'];
};

export function PokemonList({
  data,
  onEndReached,
  onEndReachedThreshold,
  ListFooterComponent,
}: PokemonListProps) {
  const router = useRouter();

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.listContent}
      columnWrapperStyle={styles.column}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      ListFooterComponent={ListFooterComponent}
      renderItem={({ item }) => (
        <Pressable style={styles.cardShadow} onPress={() => router.push(`/pokemon/${item.id}`)}>
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
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
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
