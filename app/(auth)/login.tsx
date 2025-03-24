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
import { Mail, Lock } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    await login({ email, password });
    router.replace('/');
  };

  const navigateToRegister = () => {
    router.push('/(auth)/register');
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

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
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon={<Lock size={20} color={colors.textSecondary} />}
            />

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              style={styles.loginButton}
            />

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text style={styles.registerLink}>Sign Up</Text>
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
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    zIndex: 1,
  },
  logoSubtext: {
    fontSize: fonts.sizes.sm,
    color: colors.text,
    opacity: 0.8,
    zIndex: 1,
  },
  formContainer: {
    flex: 1,
    padding: layout.spacing.xl,
    paddingTop: layout.spacing.xxl,
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
    marginBottom: layout.spacing.xl,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: layout.spacing.xl,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: fonts.sizes.sm,
  },
  loginButton: {
    marginBottom: layout.spacing.xl,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: colors.textSecondary,
    fontSize: fonts.sizes.md,
  },
  registerLink: {
    color: colors.primary,
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.semibold,
  },
});