import { useQuery } from '@tanstack/react-query';
import { NamedAPIResource, NamedAPIResourceList } from 'pokenode-ts';

import { PokeApiService } from '@/services/pokemon-api';

export type PokemonWithId = NamedAPIResource & {
  id: string;
};

type PokemonListWithId = Omit<NamedAPIResourceList, 'results'> & {
  results: PokemonWithId[];
};

export function getPokemonIdFromUrl(url: string): string | null {
  if (!url) {
    return null;
  }

  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? match[1] : null;
}

const mapWithResourceId = (resource: NamedAPIResource): PokemonWithId => {
  const id = getPokemonIdFromUrl(resource.url) || '';

  return {
    id,
    ...resource,
  };
};

export const usePokemonList = (limit: number = 20, offset: number = 0) => {
  return useQuery<NamedAPIResourceList, Error, PokemonListWithId>({
    queryKey: ['pokemon-list', limit, offset],
    queryFn: () => PokeApiService.listPokemons(limit, offset),
    select: (data) => ({
      ...data,
      results: data.results.map(mapWithResourceId),
    }),
  });
};
