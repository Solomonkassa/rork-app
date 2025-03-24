import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowDownLeft, ArrowUpRight, Plus } from 'lucide-react-native';
import { TransactionItem } from '@/components/ui/TransactionItem';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useWalletStore } from '@/store/wallet-store';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';

export default function WalletScreen() {
  const router = useRouter();
  const { balance, transactions, deposit, withdraw, isLoading } = useWalletStore();
  const { isAuthenticated } = useAuthStore();
  const [amount, setAmount] = useState('');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated]);

  const handleDeposit = async () => {
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to deposit.');
      return;
    }

    await deposit(depositAmount);
    setAmount('');
    setShowDepositModal(false);
  };

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to withdraw.');
      return;
    }

    if (withdrawAmount > balance) {
      Alert.alert('Insufficient Balance', 'You do not have enough funds to withdraw this amount.');
      return;
    }

    await withdraw(withdrawAmount);
    setAmount('');
    setShowWithdrawModal(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Your Balance</Text>
          <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
          <View style={styles.actionButtons}>
            <Button
              title="Deposit"
              onPress={() => setShowDepositModal(true)}
              leftIcon={<ArrowDownLeft size={20} color={colors.text} />}
              style={styles.actionButton}
            />
            <Button
              title="Withdraw"
              onPress={() => setShowWithdrawModal(true)}
              leftIcon={<ArrowUpRight size={20} color={colors.text} />}
              variant="outline"
              style={styles.actionButton}
            />
          </View>
        </View>

        <View style={styles.transactionsContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <Text style={styles.emptyText}>No transactions yet</Text>
          )}
        </View>
      </ScrollView>

      {showDepositModal && (
        <View style={styles.modalOverlay}>
          <Card style={styles.modalCard}>
            <Text style={styles.modalTitle}>Deposit Funds</Text>
            <Input
              label="Amount"
              placeholder="Enter amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              leftIcon={<Plus size={20} color={colors.textSecondary} />}
            />
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => {
                  setAmount('');
                  setShowDepositModal(false);
                }}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Deposit"
                onPress={handleDeposit}
                loading={isLoading}
                style={styles.modalButton}
              />
            </View>
          </Card>
        </View>
      )}

      {showWithdrawModal && (
        <View style={styles.modalOverlay}>
          <Card style={styles.modalCard}>
            <Text style={styles.modalTitle}>Withdraw Funds</Text>
            <Input
              label="Amount"
              placeholder="Enter amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              leftIcon={<Plus size={20} color={colors.textSecondary} />}
            />
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => {
                  setAmount('');
                  setShowWithdrawModal(false);
                }}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Withdraw"
                onPress={handleWithdraw}
                loading={isLoading}
                style={styles.modalButton}
              />
            </View>
          </Card>
        </View>
      )}
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
  balanceCard: {
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.xl,
    margin: layout.spacing.lg,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    marginBottom: layout.spacing.xs,
  },
  balanceAmount: {
    fontSize: fonts.sizes.xxxl,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.lg,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: layout.spacing.xs,
  },
  transactionsContainer: {
    padding: layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.md,
  },
  emptyText: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: layout.spacing.xl,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.spacing.lg,
  },
  modalCard: {
    width: '100%',
    padding: layout.spacing.xl,
  },
  modalTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.lg,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: layout.spacing.lg,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: layout.spacing.xs,
  },
});