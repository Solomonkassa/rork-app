import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { KenoGame } from '@/types/games';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Coins, Zap, RotateCcw, Award } from 'lucide-react-native';

interface KenoBoardProps {
  game: KenoGame;
  onSelectNumber: (number: number) => void;
  onClearSelection: () => void;
  onStartDraw: () => void;
  betAmount: number;
  onChangeBet: (amount: number) => void;
}

export const KenoBoard: React.FC<KenoBoardProps> = ({
  game,
  onSelectNumber,
  onClearSelection,
  onStartDraw,
  betAmount,
  onChangeBet,
}) => {
  const [currentDrawnIndex, setCurrentDrawnIndex] = useState(-1);
  const [lastDrawnNumber, setLastDrawnNumber] = useState<number | null>(null);
  const [showLastDrawn, setShowLastDrawn] = useState(false);
  const [animValue] = useState(new Animated.Value(0));
  const [potentialWin, setPotentialWin] = useState(0);
  
  const screenWidth = Dimensions.get('window').width;
  const isSmallScreen = screenWidth < 375;

  useEffect(() => {
    // Calculate potential win based on selected numbers and bet amount
    if (game.selectedNumbers.length > 0 && game.payoutTable[game.selectedNumbers.length]) {
      setPotentialWin(game.payoutTable[game.selectedNumbers.length] * betAmount);
    } else {
      setPotentialWin(0);
    }
  }, [game.selectedNumbers, betAmount]);

  useEffect(() => {
    // Animate the last drawn number
    if (game.status === 'drawing' && game.drawnNumbers.length > 0) {
      const newIndex = game.drawnNumbers.length - 1;
      if (newIndex > currentDrawnIndex) {
        setCurrentDrawnIndex(newIndex);
        setLastDrawnNumber(game.drawnNumbers[newIndex]);
        setShowLastDrawn(true);
        
        // Start animation
        animValue.setValue(0);
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.delay(500),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setShowLastDrawn(false);
        });
      }
    }
  }, [game.drawnNumbers]);

  const renderNumber = (number: number) => {
    const isSelected = game.selectedNumbers.includes(number);
    const isDrawn = game.drawnNumbers.includes(number);
    const isMatch = isSelected && isDrawn;
    const isLastDrawn = number === lastDrawnNumber && showLastDrawn;
    
    let backgroundColor = 'transparent';
    let textColor = colors.text;
    let borderColor = colors.border;
    
    if (game.status === 'waiting') {
      if (isSelected) {
        backgroundColor = colors.primary;
        borderColor = colors.primary;
      }
    } else {
      if (isMatch) {
        backgroundColor = colors.success;
        borderColor = colors.success;
      } else if (isDrawn) {
        backgroundColor = colors.error;
        borderColor = colors.error;
      } else if (isSelected) {
        backgroundColor = colors.primary;
        borderColor = colors.primary;
        textColor = colors.text;
      }
    }
    
    if (isLastDrawn) {
      backgroundColor = colors.accent;
      borderColor = colors.accent;
      textColor = colors.background;
    }
    
    return (
      <TouchableOpacity
        key={number}
        style={[
          styles.numberButton,
          { backgroundColor, borderColor },
          isLastDrawn && { transform: [{ scale: 1.2 }] }
        ]}
        onPress={() => onSelectNumber(number)}
        disabled={game.status !== 'waiting'}
      >
        <Text style={[styles.numberText, { color: textColor }]}>{number}</Text>
      </TouchableOpacity>
    );
  };

  const renderGrid = () => {
    const grid = [];
    const totalNumbers = 80;
    const numbersPerRow = 10;
    
    for (let i = 0; i < totalNumbers; i += numbersPerRow) {
      const row = [];
      for (let j = 1; j <= numbersPerRow; j++) {
        const number = i + j;
        row.push(renderNumber(number));
      }
      
      grid.push(
        <View key={i} style={styles.row}>
          {row}
        </View>
      );
    }
    
    return grid;
  };

  const renderBetControls = () => {
    const betOptions = [5, 10, 20, 50, 100];
    
    return (
      <Card style={styles.betContainer}>
        <Text style={styles.betLabel}>Bet Amount:</Text>
        <View style={styles.betOptions}>
          {betOptions.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={[
                styles.betOption,
                betAmount === amount && styles.betOptionSelected,
              ]}
              onPress={() => onChangeBet(amount)}
              disabled={game.status !== 'waiting'}
            >
              <Text
                style={[
                  styles.betOptionText,
                  betAmount === amount && styles.betOptionTextSelected,
                ]}
              >
                ${amount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>
    );
  };

  const renderGameControls = () => {
    const isSelectionValid = game.selectedNumbers.length > 0 && 
                            game.selectedNumbers.length <= game.maxSelections;
    
    return (
      <View style={styles.controlsContainer}>
        <View style={styles.selectionInfo}>
          <Text style={styles.selectionText}>
            Selected: {game.selectedNumbers.length}/{game.maxSelections}
          </Text>
          {potentialWin > 0 && (
            <Text style={styles.potentialWinText}>
              Potential Win: <Text style={styles.potentialWinAmount}>${potentialWin}</Text>
            </Text>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Clear"
            onPress={onClearSelection}
            variant="outline"
            leftIcon={<RotateCcw size={18} color={colors.primary} />}
            disabled={game.status !== 'waiting' || game.selectedNumbers.length === 0}
          />
          <Button
            title="Play"
            onPress={onStartDraw}
            leftIcon={<Zap size={18} color={colors.text} />}
            disabled={!isSelectionValid || game.status !== 'waiting'}
          />
        </View>
      </View>
    );
  };

  const renderLastDrawnNumber = () => {
    if (!showLastDrawn || lastDrawnNumber === null) return null;
    
    const scale = animValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.5, 1.2, 1],
    });
    
    const opacity = animValue.interpolate({
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [0, 1, 1, 0],
    });
    
    return (
      <Animated.View 
        style={[
          styles.lastDrawnContainer,
          {
            transform: [{ scale }],
            opacity,
          }
        ]}
      >
        <Text style={styles.lastDrawnLabel}>Number Drawn</Text>
        <View style={styles.lastDrawnNumber}>
          <Text style={styles.lastDrawnNumberText}>{lastDrawnNumber}</Text>
        </View>
      </Animated.View>
    );
  };

  const renderPayoutTable = () => {
    return (
      <Card style={styles.payoutContainer}>
        <View style={styles.payoutHeader}>
          <Award size={20} color={colors.chip} />
          <Text style={styles.payoutTitle}>Payout Table</Text>
        </View>
        <View style={styles.payoutTable}>
          {Object.entries(game.payoutTable)
            .filter(([matches, multiplier]) => parseInt(matches) > 1 && multiplier > 0)
            .map(([matches, multiplier]) => (
              <View key={matches} style={styles.payoutRow}>
                <Text style={styles.payoutText}>{matches} matches</Text>
                <Text style={styles.payoutMultiplier}>x{multiplier}</Text>
              </View>
            ))}
        </View>
      </Card>
    );
  };

  const renderResults = () => {
    if (game.status !== 'complete') return null;
    
    const matches = game.selectedNumbers.filter(num => 
      game.drawnNumbers.includes(num)
    ).length;
    
    const payout = game.payoutTable[matches] * betAmount;
    
    return (
      <Card style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Game Results</Text>
        <Text style={styles.resultsText}>
          You matched {matches} number{matches !== 1 ? 's' : ''}
        </Text>
        <Text style={[
          styles.payoutAmount,
          payout > 0 ? styles.payoutWin : styles.payoutLoss,
        ]}>
          {payout > 0 ? `You won $${payout}!` : 'Better luck next time!'}
        </Text>
        
        {payout > 0 && (
          <View style={styles.winningNumbers}>
            <Text style={styles.winningNumbersTitle}>Your Winning Numbers:</Text>
            <View style={styles.winningNumbersList}>
              {game.selectedNumbers
                .filter(num => game.drawnNumbers.includes(num))
                .map(num => (
                  <View key={num} style={styles.winningNumber}>
                    <Text style={styles.winningNumberText}>{num}</Text>
                  </View>
                ))}
            </View>
          </View>
        )}
        
        <Button
          title="Play Again"
          onPress={onClearSelection}
          style={styles.playAgainButton}
        />
      </Card>
    );
  };

  const renderDrawProgress = () => {
    if (game.status !== 'drawing' || game.drawnNumbers.length === 0) return null;
    
    const progress = (game.drawnNumbers.length / 20) * 100;
    
    return (
      <Card style={styles.drawProgressContainer}>
        <Text style={styles.drawProgressTitle}>Drawing Numbers</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.drawProgressText}>
          {game.drawnNumbers.length} of 20 numbers drawn
        </Text>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {renderLastDrawnNumber()}
        {renderDrawProgress()}
        {renderResults()}
        
        <Card style={styles.boardContainer}>
          <Text style={styles.boardTitle}>Select Your Numbers</Text>
          <View style={styles.boardGrid}>
            {renderGrid()}
          </View>
        </Card>
        
        {renderBetControls()}
        {renderGameControls()}
        {renderPayoutTable()}
        
        <View style={styles.gameRules}>
          <Text style={styles.gameRulesTitle}>How to Play Keno</Text>
          <Text style={styles.gameRulesText}>
            1. Select up to {game.maxSelections} numbers from the board{'\n'}
            2. Place your bet{'\n'}
            3. Start the draw and watch as 20 numbers are randomly selected{'\n'}
            4. The more of your numbers match the drawn numbers, the more you win!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: layout.spacing.md,
  },
  boardContainer: {
    marginBottom: layout.spacing.lg,
  },
  boardTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.md,
    textAlign: 'center',
  },
  boardGrid: {
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: layout.spacing.sm,
  },
  numberButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  numberText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium,
  },
  betContainer: {
    marginBottom: layout.spacing.lg,
  },
  betLabel: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.semibold,
    color: colors.text,
    marginBottom: layout.spacing.sm,
  },
  betOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  betOption: {
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  betOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  betOptionText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
  },
  betOptionTextSelected: {
    color: colors.text,
    fontWeight: fonts.weights.bold,
  },
  controlsContainer: {
    marginBottom: layout.spacing.lg,
  },
  selectionInfo: {
    marginBottom: layout.spacing.md,
  },
  selectionText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    fontWeight: fonts.weights.medium,
    marginBottom: layout.spacing.xs,
  },
  potentialWinText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
  },
  potentialWinAmount: {
    color: colors.success,
    fontWeight: fonts.weights.bold,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: layout.spacing.md,
  },
  payoutContainer: {
    marginBottom: layout.spacing.lg,
  },
  payoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.md,
  },
  payoutTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginLeft: layout.spacing.sm,
  },
  payoutTable: {
    gap: layout.spacing.sm,
  },
  payoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: layout.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  payoutText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
  },
  payoutMultiplier: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.bold,
    color: colors.success,
  },
  resultsContainer: {
    marginBottom: layout.spacing.lg,
    alignItems: 'center',
  },
  resultsTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.md,
  },
  resultsText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    marginBottom: layout.spacing.sm,
  },
  payoutAmount: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    marginTop: layout.spacing.sm,
    marginBottom: layout.spacing.md,
  },
  payoutWin: {
    color: colors.success,
  },
  payoutLoss: {
    color: colors.error,
  },
  winningNumbers: {
    width: '100%',
    marginBottom: layout.spacing.lg,
  },
  winningNumbersTitle: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    marginBottom: layout.spacing.sm,
    textAlign: 'center',
  },
  winningNumbersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: layout.spacing.sm,
  },
  winningNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  winningNumberText: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.bold,
    color: colors.text,
  },
  playAgainButton: {
    minWidth: 150,
  },
  lastDrawnContainer: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lastDrawnLabel: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.sm,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.md,
  },
  lastDrawnNumber: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.text,
  },
  lastDrawnNumberText: {
    fontSize: fonts.sizes.xxxl,
    fontWeight: fonts.weights.bold,
    color: colors.background,
  },
  drawProgressContainer: {
    marginBottom: layout.spacing.lg,
    padding: layout.spacing.md,
  },
  drawProgressTitle: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.sm,
    textAlign: 'center',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: colors.border,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: layout.spacing.sm,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  drawProgressText: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  gameRules: {
    marginBottom: layout.spacing.xl,
  },
  gameRulesTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.sm,
  },
  gameRulesText: {
    fontSize: fonts.sizes.md,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});