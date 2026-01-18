import { InfiniteData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ChainLink, NamedAPIResource, NamedAPIResourceList, Pokemon } from 'pokenode-ts';

import { EvolutionApiService, PokeApiService } from '@/services/pokemon-api';

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

const getPokemonSpeciesIdFromUrl = (url: string): number | null => {
  if (!url) {
    return null;
  }

  const match = url.match(/\/pokemon-species\/(\d+)\/?$/);
  if (!match) {
    return null;
  }

  const id = Number(match[1]);
  return Number.isNaN(id) ? null : id;
};

const getEvolutionChainIdFromUrl = (url: string): number | null => {
  if (!url) {
    return null;
  }

  const match = url.match(/\/evolution-chain\/(\d+)\/?$/);
  if (!match) {
    return null;
  }

  const id = Number(match[1]);
  return Number.isNaN(id) ? null : id;
};

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

export type EvolutionEntry = {
  id: number;
  name: string;
};

const collectEvolutionEntries = (link: ChainLink, entries: EvolutionEntry[]) => {
  const idValue = getPokemonSpeciesIdFromUrl(link.species.url);

  if (idValue !== null) {
    entries.push({ id: idValue, name: link.species.name });
  }

  for (const next of link.evolves_to) {
    collectEvolutionEntries(next, entries);
  }
};

export const usePokemonEvolutionChain = (name: string) => {
  return useQuery<EvolutionEntry[], Error>({
    queryKey: ['pokemon-evolution', name],
    queryFn: async () => {
      const species = await PokeApiService.getPokemonSpeciesByName(name);
      const chainId = getEvolutionChainIdFromUrl(species.evolution_chain.url);

      if (!chainId) {
        return [];
      }

      const evolutionChain = await EvolutionApiService.getEvolutionChainById(chainId);
      const entries: EvolutionEntry[] = [];
      collectEvolutionEntries(evolutionChain.chain, entries);
      return entries;
    },
    enabled: Boolean(name),
  });
};
