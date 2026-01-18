import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import {
  ActivityIndicator,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabView } from 'react-native-tab-view';
import Svg, { Line } from 'react-native-svg';

import Favorite from '@/components/ui/favorite';
import { PokemonImage } from '@/components/ui/pokemon-image';
import { RetryButton } from '@/components/ui/retry-button';
import { Skeleton } from '@/components/ui/skeleton';
import { AppFonts, CardShadow, ErrorTextStyle } from '@/constants/theme';
import { EvolutionEntry, usePokemonByName, usePokemonEvolutionChain } from '@/hooks/use-pokemon';

const typeColors: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

const whiteOverlap = 50;
const evolutionCardHeight = 80;
const evolutionConnectorHeight = 14;
const evolutionConnectorSpacing = 12;

const getTypeColor = (type: string) => typeColors[type.toLowerCase()] ?? '#9AA0A6';

const formatName = (value: string) =>
  value
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

type PokemonTabKey = 'about' | 'stats' | 'evolution';
type TabRoute = { key: PokemonTabKey; title: string };

const hasProp = (value: unknown, prop: string): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && prop in value;

const getErrorStatus = (err: unknown): number | null => {
  if (!hasProp(err, 'response')) {
    return null;
  }

  const response = err.response;
  if (!hasProp(response, 'status')) {
    return null;
  }

  const status = response.status;
  return typeof status === 'number' ? status : null;
};

export default function PokemonDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height: viewportHeight, width: viewportWidth } = useWindowDimensions();
  const { name } = useLocalSearchParams<{ name?: string | string[] }>();
  const nameValue = Array.isArray(name) ? name[0] : name;
  const pokemonName = nameValue ?? '';
  const { data: pokemon, isLoading, error, refetch, isFetching } = usePokemonByName(pokemonName);
  const evolutionName = (pokemon?.species?.name ?? '').toLowerCase();
  const {
    data: evolutionChain,
    isLoading: isEvolutionLoading,
    error: evolutionError,
    refetch: refetchEvolution,
    isFetching: isEvolutionFetching,
  } = usePokemonEvolutionChain(evolutionName);
  const [tabIndex, setTabIndex] = useState(0);
  const routes: TabRoute[] = [
    { key: 'about', title: 'About' },
    { key: 'stats', title: 'Stats' },
    { key: 'evolution', title: 'Evolution' },
  ];
  const [tabHeights, setTabHeights] = useState<Record<PokemonTabKey, number>>({
    about: 0,
    stats: 0,
    evolution: 0,
  });
  const [whiteTop, setWhiteTop] = useState<number | null>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const isMissingName = pokemonName.trim().length === 0;
  const errorStatus = error ? getErrorStatus(error) : null;
  let errorMessage: string | null = null;
  let showRetry = false;
  const handleImageLayout = (event: LayoutChangeEvent) => {
    const { y, height } = event.nativeEvent.layout;
    setWhiteTop(y + height - whiteOverlap);
  };
  const handleTabLayout = (key: PokemonTabKey) => (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setTabHeights((prev) => (prev[key] === height ? prev : { ...prev, [key]: height }));
  };
  const whiteHeight =
    whiteTop === null
      ? 0
      : Math.max(0, Math.max(contentHeight, viewportHeight) - whiteTop + viewportHeight);

  if (isMissingName) {
    errorMessage = 'Missing Pokemon name.';
  } else if (error) {
    if (errorStatus === 404) {
      errorMessage = 'Pokemon not found';
    } else {
      errorMessage = 'Network error. Check your connection and try again.';
      showRetry = true;
    }
  }

  if (isLoading) {
    const aboutSkeletonRows = Array.from({ length: 7 }, (_, index) => index);

    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={20} color="#000000" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <View style={styles.favoriteWrapper} />
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
          onContentSizeChange={(_, height) => setContentHeight(height)}
        >
          {whiteTop !== null ? (
            <View
              pointerEvents="none"
              style={[styles.whiteBackground, { top: whiteTop, height: whiteHeight }]}
            />
          ) : null}
          <View style={styles.contentLayer}>
            <View style={styles.header}>
              <Skeleton width={180} height={32} borderRadius={8} />
              <Skeleton width={72} height={18} borderRadius={6} style={styles.skeletonSpacer} />
            </View>

            <View style={styles.typeSection}>
              <View style={styles.typesContainer}>
                <Skeleton width={72} height={28} borderRadius={14} />
                <Skeleton width={72} height={28} borderRadius={14} />
              </View>
            </View>

            <View style={styles.imageContainer} onLayout={handleImageLayout}>
              <Skeleton width={200} height={200} borderRadius={100} />
            </View>

            <View style={styles.tabs}>
              <View style={styles.tabSkeletonItem}>
                <Skeleton width={48} height={14} borderRadius={6} />
              </View>
              <View style={styles.tabSkeletonItem}>
                <Skeleton width={48} height={14} borderRadius={6} />
              </View>
              <View style={styles.tabSkeletonItem}>
                <Skeleton width={70} height={14} borderRadius={6} />
              </View>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.aboutList}>
                {aboutSkeletonRows.map((index) => (
                  <View key={`about-skeleton-${index}`} style={styles.aboutRow}>
                    <View style={styles.aboutLabelContainer}>
                      <Skeleton width={70} height={14} borderRadius={6} />
                    </View>
                    <View style={styles.aboutValueContainer}>
                      <Skeleton width="80%" height={14} borderRadius={6} />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (errorMessage) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={20} color="#000000" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <View style={styles.favoriteWrapper} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
          {showRetry ? (
            <RetryButton isFetching={isFetching} onPress={() => refetch()} />
          ) : null}
        </View>
      </SafeAreaView>
    );
  }

  if (!pokemon) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={20} color="#000000" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <View style={styles.favoriteWrapper} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Pokemon not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const missingValue = 'Not available';
  const baseExperienceValue = Number.isFinite(pokemon.base_experience)
    ? `${pokemon.base_experience} XP`
    : missingValue;
  const weightValue = Number.isFinite(pokemon.weight)
    ? `${(pokemon.weight / 10).toFixed(1)} kg`
    : missingValue;
  const heightValue = Number.isFinite(pokemon.height)
    ? `${(pokemon.height / 10).toFixed(1)} m`
    : missingValue;
  const typesValue = pokemon.types.length
    ? pokemon.types.map((typeInfo) => formatName(typeInfo.type.name)).join(', ')
    : missingValue;
  const abilitiesValue = pokemon.abilities.length
    ? pokemon.abilities.map((abilityInfo) => formatName(abilityInfo.ability.name)).join(', ')
    : missingValue;

  // Base stats from the mainline games cap at 255 (as exposed in the PokeAPI as base_stat), so use that as the normalization max.
  const statMax = 255;
  const statsOrder = [
    { key: 'hp', label: 'HP' },
    { key: 'attack', label: 'Attack' },
    { key: 'defense', label: 'Defense' },
    { key: 'special-attack', label: 'Special Attack' },
    { key: 'special-defense', label: 'Special Defence' },
    { key: 'speed', label: 'Speed' },
  ];
  const statsItems = statsOrder.map((stat) => {
    const entry = pokemon.stats.find((item) => item.stat.name === stat.key);
    const value = typeof entry?.base_stat === 'number' ? entry.base_stat : null;

    return { label: stat.label, value };
  });

  const aboutItems = [
    { label: 'Name', value: formatName(pokemon.name) },
    { label: 'ID', value: String(pokemon.id).padStart(3, '0') },
    { label: 'Base', value: baseExperienceValue },
    { label: 'Weight', value: weightValue },
    { label: 'Height', value: heightValue },
    { label: 'Types', value: typesValue },
    { label: 'Abilities', value: abilitiesValue },
  ];

  const evolutionItems = evolutionChain ?? [];
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  const activeTabKey = routes[tabIndex]?.key ?? 'about';
  const defaultTabHeight = Math.max(200, viewportHeight * 0.3);
  const tabViewHeight = tabHeights[activeTabKey] || defaultTabHeight;

  const renderScene = ({ route }: { route: TabRoute }) => {
    if (route.key === 'about') {
      return (
        <View style={styles.tabScene} onLayout={handleTabLayout('about')}>
          <View style={styles.detailsContainer}>
            <View style={styles.aboutList}>
              {aboutItems.map((item) => (
                <View key={item.label} style={styles.aboutRow}>
                  <View style={styles.aboutLabelContainer}>
                    <Text style={styles.aboutLabel} numberOfLines={1} ellipsizeMode="tail">
                      {item.label}
                    </Text>
                  </View>
                  <View style={styles.aboutValueContainer}>
                    <Text
                      style={[
                        styles.aboutValue,
                        item.value === missingValue ? styles.aboutValueMissing : null,
                      ]}
                    >
                      {item.value}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      );
    }

    if (route.key === 'stats') {
      return (
        <View style={styles.tabScene} onLayout={handleTabLayout('stats')}>
          <View style={styles.detailsContainer}>
            <View style={styles.statsList}>
              {statsItems.map((item) => {
                const isMissing = item.value === null;
                const displayValue = isMissing ? missingValue : String(item.value);
                const safeValue = item.value ?? 0;
                const percentage = isMissing ? 0 : Math.min(safeValue / statMax, 1);

                return (
                  <View key={item.label} style={styles.statItem}>
                    <View style={styles.statHeader}>
                      <Text style={styles.statLabel}>{item.label}</Text>
                      <Text
                        style={[
                          styles.statValue,
                          isMissing ? styles.statValueMissing : null,
                        ]}
                      >
                        {displayValue}
                      </Text>
                    </View>
                    <View style={styles.statTrack}>
                      <View style={[styles.statFill, { width: `${percentage * 100}%` }]} />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.tabScene} onLayout={handleTabLayout('evolution')}>
        <View style={styles.detailsContainer}>
          {isEvolutionLoading ? (
            <View style={styles.tabStatus}>
              <ActivityIndicator size="small" color="#5631E8" />
              <Text style={styles.tabStatusText}>Loading evolution...</Text>
            </View>
          ) : evolutionError ? (
            <View style={styles.tabStatus}>
              <Text style={styles.tabStatusText}>Error loading evolution.</Text>
              <RetryButton
                isFetching={isEvolutionFetching}
                onPress={() => refetchEvolution()}
              />
            </View>
          ) : evolutionItems.length === 0 ? (
            <Text style={styles.placeholderText}>No evolution data available.</Text>
          ) : (
            <View style={styles.evolutionList}>
              {evolutionItems.map((entry: EvolutionEntry, index: number) => {
                const isLast = index === evolutionItems.length - 1;

                return (
                  <View key={`${entry.id}-${entry.name}`} style={styles.evolutionItem}>
                    <View style={styles.evolutionCard}>
                      <View style={styles.evolutionImage}>
                        <PokemonImage id={entry.id} size={56} />
                      </View>
                      <View style={styles.evolutionInfo}>
                        <View style={styles.evolutionBadge}>
                          <Text style={styles.evolutionBadgeText}>
                            {String(entry.id).padStart(3, '0')}
                          </Text>
                        </View>
                        <Text style={styles.evolutionName}>{formatName(entry.name)}</Text>
                      </View>
                    </View>
                    {isLast ? null : (
                      <View style={styles.evolutionConnector}>
                        <Svg width={evolutionCardHeight} height={evolutionConnectorHeight}>
                          <Line
                            x1={evolutionCardHeight / 2}
                            y1={0}
                            x2={evolutionCardHeight / 2}
                            y2={evolutionConnectorHeight}
                            stroke="#B7B6C6"
                            strokeWidth={2}
                            strokeDasharray="2,4"
                          />
                        </Svg>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={20} color="#000000" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <View style={styles.favoriteWrapper}>
            <Favorite
              pokemonId={pokemon.id}
              pokemonName={pokemon.name}
              imageUrl={imageUrl}
              variant="detail"
            />
          </View>
        </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        onContentSizeChange={(_, height) => setContentHeight(height)}
      >
        {whiteTop !== null ? (
          <View
            pointerEvents="none"
            style={[styles.whiteBackground, { top: whiteTop, height: whiteHeight }]}
          />
        ) : null}
        <View style={styles.contentLayer}>
          <View style={styles.header}>
            <Text style={styles.pokemonName} numberOfLines={1} ellipsizeMode="tail">
              {formatName(pokemon.name)}
            </Text>
            <Text style={styles.pokemonId}>#{String(pokemon.id).padStart(3, '0')}</Text>
          </View>

          <View style={styles.typeSection}>
            <View style={styles.typesContainer}>
              {pokemon.types.map((typeInfo) => (
                <View
                  key={typeInfo.type.name}
                  style={styles.typeBadge}
                >
                  <View
                    style={[
                      styles.typeDot,
                      { backgroundColor: getTypeColor(typeInfo.type.name) },
                    ]}
                  />
                  <Text style={styles.typeText}>{typeInfo.type.name}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.imageContainer} onLayout={handleImageLayout}>
            <PokemonImage id={pokemon.id} size={200} />
          </View>

          <View style={styles.tabs}>
            {routes.map((route, index) => {
              const isActive = tabIndex === index;

              return (
                <Pressable
                  key={route.key}
                  style={[styles.tabButton, isActive ? styles.tabButtonActive : null]}
                  onPress={() => setTabIndex(index)}
                >
                  <Text style={[styles.tabText, isActive ? styles.tabTextActive : null]}>
                    {route.title}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <TabView
            navigationState={{ index: tabIndex, routes }}
            renderScene={renderScene}
            onIndexChange={setTabIndex}
            initialLayout={{ width: viewportWidth }}
            style={{ height: tabViewHeight }}
            sceneContainerStyle={styles.tabSceneContainer}
            renderTabBar={() => null}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF6FF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
    flexGrow: 1,
    position: 'relative',
  },
  whiteBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
  },
  contentLayer: {
    zIndex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  favoriteWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 17,
    color: '#000000',
    fontFamily: AppFonts.sfProTextRegular,
  },
  skeletonSpacer: {
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    ...ErrorTextStyle,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 12,
    paddingHorizontal: 24,
  },
  pokemonName: {
    flex: 1,
    fontSize: 32,
    color: '#0E0940',
    fontFamily: AppFonts.cabinetGroteskExtraBold,
    textTransform: 'capitalize',
  },
  pokemonId: {
    fontSize: 24,
    color: '#aab0c6',
    marginTop: 4,
    fontFamily: AppFonts.cabinetGroteskRegular,
  },
  imageContainer: {
    alignItems: 'center',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  typeSection: {
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DBDAE6',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabSkeletonItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabButtonActive: {
    borderBottomColor: '#5631E8',
  },
  tabText: {
    fontSize: 14,
    color: '#86839F',
    fontFamily: AppFonts.rubikSemiBold,
  },
  tabTextActive: {
    color: '#0E0940',
    fontFamily: AppFonts.rubikSemiBold,
  },
  tabScene: {
    width: '100%',
  },
  tabSceneContainer: {
    backgroundColor: 'transparent',
  },
  detailsContainer: {
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  aboutList: {
    gap: 10,
  },
  aboutRow: {
    width: '100%',
    maxWidth: 342,
    flexDirection: 'row',
    alignItems: 'center',
  },
  aboutLabelContainer: {
    width: 100,
    flexShrink: 0,
    marginRight: 16,
  },
  aboutValueContainer: {
    flex: 1,
    minWidth: 0,
  },
  aboutLabel: {
    fontSize: 14,
    color: '#0E0940',
    fontFamily: AppFonts.rubikSemiBold,
  },
  aboutValue: {
    fontSize: 14,
    color: '#625F83',
    fontFamily: AppFonts.rubikRegular,
  },
  aboutValueMissing: {
    color: '#9AA0A6',
  },
  statsList: {
    gap: 16,
  },
  statItem: {
    gap: 8,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 14,
    color: '#0E0940',
    fontFamily: AppFonts.rubikSemiBold,
  },
  statValue: {
    fontSize: 14,
    color: '#625F83',
    fontFamily: AppFonts.rubikRegular,
  },
  statValueMissing: {
    color: '#9AA0A6',
  },
  statTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: '#F3F3F7',
    overflow: 'hidden',
  },
  statFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#5631E8',
  },
  tabStatus: {
    alignItems: 'center',
    gap: 8,
  },
  tabStatusText: {
    ...ErrorTextStyle,
  },
  evolutionList: {
    gap: 0,
  },
  evolutionItem: {
    alignItems: 'flex-start',
    gap: evolutionConnectorSpacing,
  },
  evolutionConnector: {
    height: evolutionConnectorHeight,
    justifyContent: 'center',
    marginBottom: evolutionConnectorSpacing,
  },
  evolutionCard: {
    ...CardShadow,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: evolutionCardHeight,
    gap: 12,
  },
  evolutionImage: {
    width: evolutionCardHeight,
    height: evolutionCardHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F6FF',
  },
  evolutionInfo: {
    flex: 1,
    gap: 6,
    paddingVertical: 12,
    paddingRight: 12,
  },
  evolutionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#5631E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  evolutionBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontFamily: AppFonts.rubikMedium,
  },
  evolutionName: {
    fontSize: 16,
    color: '#0E0940',
    fontFamily: AppFonts.rubikMedium,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#0E0940',
    marginBottom: 12,
    fontFamily: AppFonts.rubikBold,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start',
  },
  typeBadge: {
    backgroundColor: '#0E094014',
    height: 32,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 14,
    borderRadius: 99,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  typeText: {
    color: '#0E0940',
    fontSize: 16,
    fontFamily: AppFonts.rubikSemiBold,
    textTransform: 'capitalize',
  },
  placeholderText: {
    fontSize: 14,
    color: '#9AA0A6',
    fontFamily: AppFonts.rubikMedium,
  },
});
