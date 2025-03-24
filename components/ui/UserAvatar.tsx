import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';

interface UserAvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  showBadge?: boolean;
  badgeCount?: number;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  uri,
  name,
  size = 40,
  showBadge = false,
  badgeCount,
}) => {
  const getInitials = () => {
    if (!name) return '?';
    
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (
      nameParts[0].charAt(0).toUpperCase() + 
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const initialsStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    fontSize: size * 0.4,
  };

  const badgeStyle = {
    width: size * 0.5,
    height: size * 0.5,
    borderRadius: size * 0.25,
    right: 0,
    top: 0,
  };

  const badgeTextStyle = {
    fontSize: size * 0.25,
  };

  return (
    <View style={styles.container}>
      {uri ? (
        <Image source={{ uri }} style={[styles.avatar, avatarStyle]} />
      ) : (
        <View style={[styles.initialsContainer, initialsStyle]}>
          <Text style={[styles.initials, { fontSize: initialsStyle.fontSize }]}>
            {getInitials()}
          </Text>
        </View>
      )}
      
      {showBadge && (
        <View style={[styles.badge, badgeStyle]}>
          {badgeCount !== undefined && (
            <Text style={[styles.badgeText, badgeTextStyle]}>
              {badgeCount > 9 ? '9+' : badgeCount}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatar: {
    backgroundColor: colors.card,
  },
  initialsContainer: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: colors.text,
    fontWeight: fonts.weights.bold,
  },
  badge: {
    position: 'absolute',
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  badgeText: {
    color: colors.text,
    fontWeight: fonts.weights.bold,
  },
});