import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LogOut, Settings, Bell, Shield, CreditCard, HelpCircle } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: <Settings size={24} color={colors.text} />,
      title: 'Account Settings',
      onPress: () => Alert.alert('Account Settings', 'This feature is not implemented yet.'),
    },
    {
      icon: <Bell size={24} color={colors.text} />,
      title: 'Notifications',
      onPress: () => Alert.alert('Notifications', 'This feature is not implemented yet.'),
    },
    {
      icon: <Shield size={24} color={colors.text} />,
      title: 'Security',
      onPress: () => Alert.alert('Security', 'This feature is not implemented yet.'),
    },
    {
      icon: <CreditCard size={24} color={colors.text} />,
      title: 'Payment Methods',
      onPress: () => Alert.alert('Payment Methods', 'This feature is not implemented yet.'),
    },
    {
      icon: <HelpCircle size={24} color={colors.text} />,
      title: 'Help & Support',
      onPress: () => Alert.alert('Help & Support', 'This feature is not implemented yet.'),
    },
  ];

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <UserAvatar uri={user.avatar} name={user.username} size={80} />
          <View style={styles.userInfo}>
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <View style={styles.vipBadge}>
              <Text style={styles.vipText}>VIP Level {user.vipLevel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>${user.balance.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Balance</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>Games Played</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </Card>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableMenuItem
              key={index}
              icon={item.icon}
              title={item.title}
              onPress={item.onPress}
            />
          ))}
        </View>

        <View style={styles.logoutContainer}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            leftIcon={<LogOut size={20} color={colors.primary} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const TouchableMenuItem = ({ icon, title, onPress }) => {
  return (
    <Card style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemIcon}>{icon}</View>
        <Text style={styles.menuItemTitle}>{title}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: layout.spacing.lg,
  },
  userInfo: {
    marginLeft: layout.spacing.lg,
    flex: 1,
  },
  username: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    marginBottom: layout.spacing.sm,
  },
  vipBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  vipText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: layout.spacing.lg,
    paddingTop: 0,
  },
  statCard: {
    width: '31%',
    alignItems: 'center',
    padding: layout.spacing.md,
  },
  statValue: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
  },
  menuContainer: {
    padding: layout.spacing.lg,
    paddingTop: 0,
  },
  menuItem: {
    marginBottom: layout.spacing.md,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    marginRight: layout.spacing.md,
  },
  menuItemTitle: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.medium,
    color: colors.text,
  },
  logoutContainer: {
    padding: layout.spacing.lg,
    paddingTop: 0,
    marginBottom: layout.spacing.xl,
  },
});