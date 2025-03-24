import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, User } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error } = useAuthStore();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleRegister = async () => {
    // Validate inputs
    if (!username || !email || !password || !confirmPassword) {
      setValidationError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    setValidationError('');
    await register({ username, email, password });
    router.replace('/');
  };

  const navigateToLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <LinearGradient
            colors={['rgba(108, 92, 231, 0.8)', 'rgba(0, 184, 148, 0.8)']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1518893883800-45cd0954574b?q=80&w=2070&auto=format&fit=crop' }}
                style={styles.logoBackground}
              />
              <View style={styles.logoOverlay} />
              <Text style={styles.logoText}>KARTELA</Text>
              <Text style={styles.logoSubtext}>Virtual Casino</Text>
            </View>
          </LinearGradient>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>

            {(error || validationError) && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error || validationError}</Text>
              </View>
            )}

            <Input
              label="Username"
              placeholder="Choose a username"
              value={username}
              onChangeText={setUsername}
              leftIcon={<User size={20} color={colors.textSecondary} />}
            />

            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={20} color={colors.textSecondary} />}
            />

            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon={<Lock size={20} color={colors.textSecondary} />}
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              leftIcon={<Lock size={20} color={colors.textSecondary} />}
            />

            <Button
              title="Sign Up"
              onPress={handleRegister}
              loading={isLoading}
              fullWidth
              style={styles.registerButton}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerGradient: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  logoOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  logoText: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    zIndex: 1,
  },
  logoSubtext: {
    fontSize: fonts.sizes.xs,
    color: colors.text,
    opacity: 0.8,
    zIndex: 1,
  },
  formContainer: {
    flex: 1,
    padding: layout.spacing.xl,
    paddingTop: layout.spacing.xl,
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
    marginBottom: layout.spacing.lg,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
    marginBottom: layout.spacing.lg,
  },
  errorText: {
    color: colors.error,
    fontSize: fonts.sizes.sm,
  },
  registerButton: {
    marginTop: layout.spacing.md,
    marginBottom: layout.spacing.xl,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: layout.spacing.xl,
  },
  loginText: {
    color: colors.textSecondary,
    fontSize: fonts.sizes.md,
  },
  loginLink: {
    color: colors.primary,
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.semibold,
  },
});