import {
  ActionSheetIOS,
  Alert,
  FlatList,
  FlatListProps,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import Favorite from '@/components/ui/favorite';
import { useIsFavorite, useToggleFavorite } from '@/hooks/use-favorites';
import { PokemonImage } from '@/components/ui/pokemon-image';
import { POKEMON_LABEL } from '@/constants/labels';
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

type PokemonListItemProps = {
  pokemon: Pokemon;
  onOpen: (pokemonName: string) => void;
};

function PokemonListItem({ pokemon, onOpen }: PokemonListItemProps) {
  const { data: isFavorite } = useIsFavorite(pokemon.id);
  const toggleFavorite = useToggleFavorite();
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  const isFavorited = Boolean(isFavorite);
  const favoriteLabel = isFavorited ? 'Remove from favorites' : 'Add to favorites';

  const handleToggleFavorite = () => {
    if (toggleFavorite.isPending) return;

    toggleFavorite.mutate({
      pokemonId: pokemon.id,
      name: pokemon.name,
      imageUrl,
      isCurrentlyFavorite: isFavorited,
    });
  };

  const showActions = () => {
    const options = [`Open ${POKEMON_LABEL}`, favoriteLabel, 'Share', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    const shareMessage = `Check out this ${POKEMON_LABEL}: ${formatName(
      pokemon.name
    )} #${String(pokemon.id).padStart(3, '0')} - ${imageUrl}`;

    const handleShare = () => {
      void Share.share({ message: shareMessage }).catch(() => {});
    };

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          userInterfaceStyle: 'light',
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            onOpen(pokemon.name);
          }
          if (buttonIndex === 1) {
            handleToggleFavorite();
          }
          if (buttonIndex === 2) {
            handleShare();
          }
        }
      );
      return;
    }

    Alert.alert('Actions', '', [
      { text: options[0], onPress: () => onOpen(pokemon.name) },
      { text: options[1], onPress: handleToggleFavorite },
      { text: options[2], onPress: handleShare },
      { text: options[3], style: 'cancel' },
    ]);
  };

  const formatName = (value: string) =>
    value
      .split(/[-\s]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

  return (
    <Pressable style={styles.cardShadow} onPress={() => onOpen(pokemon.name)}>
      <View style={styles.card}>
        <View style={styles.cardBackground}>
          <View style={styles.cardMetaRow}>
            <View style={styles.idBadge}>
              <Text style={styles.idText}>{String(pokemon.id).padStart(3, '0')}</Text>
            </View>
            <View style={styles.favoriteContainer}>
              <Favorite pokemonId={pokemon.id} pokemonName={pokemon.name} imageUrl={imageUrl} />
            </View>
          </View>
          <View style={styles.imageWrapper}>
            <PokemonImage id={pokemon.id} size="100%" />
          </View>
        </View>
        <View style={styles.nameSection}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {formatName(pokemon.name)}
          </Text>
          <Pressable
            style={styles.iconWrapper}
            onPress={(event) => {
              event.stopPropagation();
              showActions();
            }}
          >
            <MaterialIcons name="more-vert" size={24} color="#0E0940" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

export function PokemonList({
  data,
  onEndReached,
  onEndReachedThreshold,
  ListFooterComponent,
}: PokemonListProps) {
  const router = useRouter();

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
      renderItem={({ item }) => <PokemonListItem pokemon={item} onOpen={handlePokemonPress} />}
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
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  favoriteContainer: {
    height: 24,
    justifyContent: 'center',
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
    height: 24,
    alignSelf: 'flex-start',
    backgroundColor: '#5631E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    justifyContent: 'center',
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
