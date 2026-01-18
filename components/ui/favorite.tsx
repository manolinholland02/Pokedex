import { useIsFavorite, useToggleFavorite } from '@/hooks/use-favorites';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { CardShadow } from '@/constants/theme';

interface FavoriteProps {
  pokemonId: number;
  pokemonName: string;
  imageUrl?: string;
  variant?: 'list' | 'detail';
}

export default function Favorite({
  pokemonId,
  pokemonName,
  imageUrl,
  variant = 'list',
}: FavoriteProps) {
  const { data: isFavorited, isLoading } = useIsFavorite(pokemonId);
  const toggleFavorite = useToggleFavorite();
  const isDetail = variant === 'detail';
  const iconSize = isDetail ? 24 : 20;
  const iconColor = isFavorited ? '#FF6B6B' : isDetail ? '#0E0940' : '#666';

  const handleToggle = () => {
    if (isLoading) return;

    toggleFavorite.mutate({
      pokemonId,
      name: pokemonName,
      imageUrl,
      isCurrentlyFavorite: isFavorited || false,
    });
  };

  return (
    <TouchableOpacity
      style={[styles.favoriteButton, isDetail ? styles.detailButton : styles.listButton]}
      onPress={handleToggle}
      disabled={toggleFavorite.isPending}
    >
      <Ionicons
        name={isFavorited ? 'heart' : 'heart-outline'}
        size={iconSize}
        color={iconColor}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  favoriteButton: {
    ...CardShadow,
    width: 32,
    height: 24,
    borderRadius: 4,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  detailButton: {
    backgroundColor: 'transparent',
  },
});
