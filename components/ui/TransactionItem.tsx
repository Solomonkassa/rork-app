import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Coins, 
  DollarSign, 
  Gift 
} from 'lucide-react-native';
import { Transaction } from '@/types/wallet';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const getIcon = () => {
    switch (transaction.type) {
      case 'deposit':
        return <ArrowDownLeft size={20} color={colors.success} />;
      case 'withdrawal':
        return <ArrowUpRight size={20} color={colors.error} />;
      case 'bet':
        return <Coins size={20} color={colors.warning} />;
      case 'win':
        return <DollarSign size={20} color={colors.success} />;
      case 'bonus':
        return <Gift size={20} color={colors.accent} />;
      default:
        return <Coins size={20} color={colors.textSecondary} />;
    }
  };

  const getTitle = () => {
    switch (transaction.type) {
      case 'deposit':
        return 'Deposit';
      case 'withdrawal':
        return 'Withdrawal';
      case 'bet':
        return `Bet on ${transaction.gameName}`;
      case 'win':
        return `Win from ${transaction.gameName}`;
      case 'bonus':
        return 'Bonus';
      default:
        return 'Transaction';
    }
  };

  const getSubtitle = () => {
    if (transaction.reference) {
      return `Ref: ${transaction.reference}`;
    }
    if (transaction.gameId) {
      return `Game ID: ${transaction.gameId}`;
    }
    return new Date(transaction.timestamp).toLocaleDateString();
  };

  const getAmountColor = () => {
    if (transaction.amount > 0) {
      return colors.success;
    }
    return colors.error;
  };

  const formatAmount = () => {
    const prefix = transaction.amount > 0 ? '+' : '';
    return `${prefix}$${Math.abs(transaction.amount).toFixed(2)}`;
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'completed':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'failed':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{getTitle()}</Text>
        <Text style={styles.subtitle}>{getSubtitle()}</Text>
      </View>
      <View style={styles.rightContent}>
        <Text style={[styles.amount, { color: getAmountColor() }]}>
          {formatAmount()}
        </Text>
        <View style={[styles.statusContainer, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{transaction.status}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.medium,
    color: colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.semibold,
    marginBottom: 4,
  },
  statusContainer: {
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: 2,
    borderRadius: layout.borderRadius.sm,
  },
  statusText: {
    fontSize: fonts.sizes.xs,
    color: colors.text,
    fontWeight: fonts.weights.medium,
    textTransform: 'capitalize',
  },
});