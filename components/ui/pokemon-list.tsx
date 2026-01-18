import { FlatList, FlatListProps, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { PokemonImage } from '@/components/ui/pokemon-image';
import { AppFonts, CardShadow } from '@/constants/theme';
import { Skeleton } from '@/components/ui/skeleton';

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
  const formatName = (value: string) =>
    value
      .split(/[-\s]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  const handlePokemonPress = (pokemonName: string) => {
    router.push(`/pokemon/${pokemonName.toLowerCase()}`);
  };

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
        <Pressable style={styles.cardShadow} onPress={() => handlePokemonPress(item.name)}>
          <View style={styles.card}>
            <View style={styles.cardBackground}>
              <View style={styles.idBadge}>
                <Text style={styles.idText}>{String(item.id).padStart(3, '0')}</Text>
              </View>
              <View style={styles.imageWrapper}>
                <PokemonImage id={item.id} size="100%" />
              </View>
            </View>
            <View style={styles.nameSection}>
              <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                {formatName(item.name)}
              </Text>
              <View style={styles.iconWrapper}>
                <MaterialIcons name="more-vert" size={24} color="#0E0940" />
              </View>
            </View>
          </View>
        </Pressable>
      )}
    />
  );
}

type PokemonListSkeletonProps = {
  count?: number;
};

export function PokemonListSkeleton({ count = 6 }: PokemonListSkeletonProps) {
  const items = Array.from({ length: count }, (_, index) => index);

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.toString()}
      numColumns={2}
      contentContainerStyle={styles.listContent}
      columnWrapperStyle={styles.column}
      renderItem={() => (
        <View style={styles.cardShadow}>
          <View style={styles.card}>
            <View style={styles.cardBackground}>
              <Skeleton width={40} height={16} borderRadius={4} />
              <View style={styles.imageWrapper}>
                <Skeleton width="100%" height="100%" borderRadius={12} />
              </View>
            </View>
            <View style={styles.nameSection}>
              <Skeleton width="70%" height={18} borderRadius={6} />
            </View>
          </View>
        </View>
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
    gap: 16,
    marginBottom: 16,
  },
  cardShadow: {
    ...CardShadow,
    flex: 1,
    aspectRatio: 163 / 211,
    borderRadius: 8,
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
  imageWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameSection: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconWrapper: {
    width: 24,
    alignItems: 'flex-end',
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
    fontSize: 16,
    fontFamily: AppFonts.rubikMedium,
    flex: 1,
  },
});
