import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TextInputProps,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  secureTextEntry,
  ...rest
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const renderPasswordIcon = () => {
    if (secureTextEntry) {
      return (
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
          {isPasswordVisible ? (
            <EyeOff size={20} color={colors.textSecondary} />
          ) : (
            <Eye size={20} color={colors.textSecondary} />
          )}
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        error ? styles.inputError : null,
      ]}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : null,
            (rightIcon || secureTextEntry) ? styles.inputWithRightIcon : null,
            inputStyle,
          ]}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...rest}
        />
        {renderPasswordIcon() || (rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>)}
      </View>
      {error && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: layout.spacing.md,
    width: '100%',
  },
  label: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium,
    marginBottom: layout.spacing.xs,
    color: colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.borderRadius.md,
    backgroundColor: colors.card,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: layout.spacing.md,
    fontSize: fonts.sizes.md,
    color: colors.text,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  iconContainer: {
    paddingHorizontal: layout.spacing.md,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: fonts.sizes.sm,
    marginTop: layout.spacing.xs,
  },
});