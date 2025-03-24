import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameCard } from '@/components/ui/GameCard';
import { useGameStore } from '@/store/game-store';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';

export default function GamesScreen() {
  const { games, fetchGames, isLoading } = useGameStore();
  const { user, isAuthenticated } = useAuthStore();

  // Use Redirect component instead of programmatic navigation
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  useEffect(() => {
    fetchGames();
  }, []);

  const featuredGames = games.filter(game => game.isLive);
  const upcomingGames = games.filter(game => !game.isLive);

  const handleGamePress = (gameId: string) => {
    // We'll use the router.push in the actual handler, which is safe
    // because it happens in response to user interaction
    return `/game/${gameId}`;
  };

  const handleRefresh = () => {
    fetchGames();
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.username || 'Player'}</Text>
          <Text style={styles.subtitle}>Ready to play?</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Games</Text>
          {featuredGames.map(game => (
            <GameCard
              key={game.id}
              game={game}
              onPress={handleGamePress}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Games</Text>
          {upcomingGames.map(game => (
            <GameCard
              key={game.id}
              game={game}
              onPress={handleGamePress}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: layout.spacing.lg,
    paddingBottom: layout.spacing.md,
  },
  greeting: {
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.xs,
  },
  subtitle: {
    fontSize: fonts.sizes.lg,
    color: colors.textSecondary,
  },
  section: {
    padding: layout.spacing.lg,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.md,
  },
});