import React from 'react';
import { 
  View, 
  StyleSheet, 
  ViewStyle, 
  StyleProp, 
  TouchableOpacity,
  TouchableOpacityProps
} from 'react-native';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
  ...rest
}) => {
  const cardStyles = [
    styles.card,
    styles[`${variant}Card`],
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        activeOpacity={0.7}
        {...rest}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.lg,
    backgroundColor: colors.card,
  },
  defaultCard: {
    // Default styles are already applied
  },
  elevatedCard: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  outlinedCard: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
});