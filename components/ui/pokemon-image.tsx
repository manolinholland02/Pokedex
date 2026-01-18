import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface PokemonImageProps {
  id: string | number;
  size?: number;
}

export function PokemonImage({ id, size = 200 }: PokemonImageProps) {
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  const [hasError, setHasError] = useState(false);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {hasError ? (
        <View style={[styles.fallback, { width: size, height: size }]}>
          <Text style={styles.fallbackText}>Image unavailable</Text>
        </View>
      ) : (
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, { width: size, height: size }]}
          resizeMode="contain"
          onError={() => setHasError(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    backgroundColor: 'transparent',
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F6FF',
    borderRadius: 12,
  },
  fallbackText: {
    color: '#9AA0A6',
    fontSize: 12,
  },
});
