import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Crown, Medal, Award } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';
import { leaderboardUsers } from '@/mocks/users';

export default function LeaderboardScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated]);

  const renderTopThree = () => {
    const topThree = leaderboardUsers.slice(0, 3);
    
    return (
      <View style={styles.topThreeContainer}>
        {topThree.map((user, index) => {
          let icon = null;
          let containerStyle = {};
          let nameStyle = {};
          
          switch (index) {
            case 0:
              icon = <Crown size={24} color={colors.chip} />;
              containerStyle = styles.firstPlace;
              nameStyle = styles.firstPlaceName;
              break;
            case 1:
              icon = <Medal size={20} color="#C0C0C0" />;
              containerStyle = styles.secondPlace;
              break;
            case 2:
              icon = <Award size={20} color="#CD7F32" />;
              containerStyle = styles.thirdPlace;
              break;
          }
          
          return (
            <Card key={user.id} style={[styles.topThreeCard, containerStyle]}>
              <View style={styles.topThreeContent}>
                <UserAvatar uri={user.avatar} name={user.username} size={60} />
                <View style={styles.topThreeInfo}>
                  <Text style={[styles.topThreeName, nameStyle]}>{user.username}</Text>
                  <Text style={styles.topThreeBalance}>${user.balance.toLocaleString()}</Text>
                  <View style={styles.topThreeBadge}>
                    {icon}
                    <Text style={styles.topThreeRank}>#{index + 1}</Text>
                  </View>
                </View>
              </View>
            </Card>
          );
        })}
      </View>
    );
  };

  const renderLeaderboardItem = ({ item, index }) => {
    // Skip the top 3 users as they are displayed separately
    if (index < 3) return null;
    
    return (
      <View style={styles.leaderboardItem}>
        <Text style={styles.leaderboardRank}>#{index + 1}</Text>
        <UserAvatar uri={item.avatar} name={item.username} size={40} />
        <View style={styles.leaderboardInfo}>
          <Text style={styles.leaderboardName}>{item.username}</Text>
          <Text style={styles.leaderboardVip}>VIP Level {item.vipLevel}</Text>
        </View>
        <Text style={styles.leaderboardBalance}>${item.balance.toLocaleString()}</Text>
      </View>
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>Top players this month</Text>
      </View>
      
      {renderTopThree()}
      
      <FlatList
        data={leaderboardUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderLeaderboardItem}
        contentContainerStyle={styles.leaderboardList}
        ListHeaderComponent={
          <Text style={styles.leaderboardTitle}>All Players</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: layout.spacing.lg,
    paddingBottom: layout.spacing.md,
  },
  title: {
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.xs,
  },
  subtitle: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
  },
  topThreeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: layout.spacing.lg,
    paddingTop: 0,
  },
  topThreeCard: {
    width: '31%',
    padding: layout.spacing.md,
  },
  firstPlace: {
    backgroundColor: colors.primary,
  },
  secondPlace: {
    backgroundColor: colors.card,
  },
  thirdPlace: {
    backgroundColor: colors.card,
  },
  topThreeContent: {
    alignItems: 'center',
  },
  topThreeInfo: {
    alignItems: 'center',
    marginTop: layout.spacing.sm,
  },
  topThreeName: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginBottom: 2,
    textAlign: 'center',
  },
  firstPlaceName: {
    color: colors.text,
  },
  topThreeBalance: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    marginBottom: layout.spacing.xs,
  },
  topThreeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.sm,
  },
  topThreeRank: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginLeft: 4,
  },
  leaderboardList: {
    padding: layout.spacing.lg,
    paddingTop: 0,
  },
  leaderboardTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.md,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  leaderboardRank: {
    width: 40,
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.bold,
    color: colors.textSecondary,
  },
  leaderboardInfo: {
    flex: 1,
    marginLeft: layout.spacing.md,
  },
  leaderboardName: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  leaderboardVip: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
  },
  leaderboardBalance: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.bold,
    color: colors.chip,
  },
});