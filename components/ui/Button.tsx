import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp
} from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}) => {
  const buttonStyles = [
    styles.button,
    styles[`${variant}Button`],
    styles[`${size}Button`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabledButton,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.text} 
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={textStyles}>{title}</Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: layout.borderRadius.md,
    gap: layout.spacing.sm,
  },
  text: {
    fontWeight: fonts.weights.semibold,
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  // Variants
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryText: {
    color: colors.text,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  secondaryText: {
    color: colors.text,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  outlineText: {
    color: colors.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: colors.primary,
  },
  dangerButton: {
    backgroundColor: colors.error,
  },
  dangerText: {
    color: colors.text,
  },
  // Sizes
  smButton: {
    paddingVertical: layout.spacing.xs,
    paddingHorizontal: layout.spacing.md,
  },
  smText: {
    fontSize: fonts.sizes.sm,
  },
  mdButton: {
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.lg,
  },
  mdText: {
    fontSize: fonts.sizes.md,
  },
  lgButton: {
    paddingVertical: layout.spacing.md,
    paddingHorizontal: layout.spacing.xl,
  },
  lgText: {
    fontSize: fonts.sizes.lg,
  },
  // States
  disabledButton: {
    backgroundColor: colors.textSecondary,
    borderColor: colors.textSecondary,
    opacity: 0.5,
  },
  disabledText: {
    color: colors.text,
    opacity: 0.7,
  },
});