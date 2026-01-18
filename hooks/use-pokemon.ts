import { InfiniteData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { NamedAPIResource, NamedAPIResourceList, Pokemon } from 'pokenode-ts';

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

const mapPageWithIds = (page: NamedAPIResourceList): PokemonListWithId => ({
  ...page,
  results: page.results.map(mapWithResourceId),
});

const getNextOffsetFromUrl = (url: string | null): number | undefined => {
  if (!url) {
    return undefined;
  }

  const match = url.match(/[\?&]offset=(\d+)/);
  if (!match) {
    return undefined;
  }

  const offset = Number(match[1]);
  return Number.isNaN(offset) ? undefined : offset;
};

export const usePokemonList = (offset: number = 0, limit: number = 20) => {
  return useQuery<NamedAPIResourceList, Error, PokemonListWithId>({
    queryKey: ['pokemon-list', offset, limit],
    queryFn: () => PokeApiService.listPokemons(offset, limit),
    select: (data) => ({
      ...data,
      results: data.results.map(mapWithResourceId),
    }),
  });
};

export const useInfinitePokemonList = (limit: number = 20) => {
  return useInfiniteQuery<
    NamedAPIResourceList,
    Error,
    InfiniteData<PokemonListWithId>,
    ['pokemon-list', number],
    number
  >({
    queryKey: ['pokemon-list', limit],
    queryFn: ({ pageParam }) => PokeApiService.listPokemons(pageParam, limit),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => getNextOffsetFromUrl(lastPage.next),
    select: (data) => ({
      pageParams: data.pageParams,
      pages: data.pages.map(mapPageWithIds),
    }),
  });
};

export const usePokemonByName = (name: string) => {
  return useQuery<Pokemon, Error>({
    queryKey: ['pokemon', name],
    queryFn: () => PokeApiService.getPokemonByName(name),
    enabled: Boolean(name),
    staleTime: 10 * 60 * 1000,
  });
};
