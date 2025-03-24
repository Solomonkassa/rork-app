import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { LottoGame } from '@/types/games';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Ticket, Clock, Award, Shuffle, RotateCcw, DollarSign } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LottoTicketProps {
  game: LottoGame;
  onSelectNumber: (number: number) => void;
  onSelectBonusNumber: (number: number) => void;
  onClearSelection: () => void;
  onBuyTicket: () => void;
  betAmount: number;
  onChangeBet: (amount: number) => void;
}

export const LottoTicket: React.FC<LottoTicketProps> = ({
  game,
  onSelectNumber,
  onSelectBonusNumber,
  onClearSelection,
  onBuyTicket,
  betAmount,
  onChangeBet,
}) => {
  const [countdown, setCountdown] = useState('');
  const [quickPickAnimation] = useState(new Animated.Value(0));
  const [showQuickPick, setShowQuickPick] = useState(false);
  const [ticketPurchased, setTicketPurchased] = useState(false);

  useEffect(() => {
    // Update countdown timer
    const updateCountdown = () => {
      if (game.drawDate) {
        const drawDate = new Date(game.drawDate);
        const now = new Date();
        const diff = drawDate.getTime() - now.getTime();
        
        if (diff <= 0) {
          setCountdown('Draw in progress');
          return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        setCountdown(`${days}d ${hours}h ${minutes}m`);
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [game.drawDate]);

  useEffect(() => {
    // Set ticket purchased state based on game status
    if (game.status === 'closed') {
      setTicketPurchased(true);
    } else {
      setTicketPurchased(false);
    }
  }, [game.status]);

  const handleQuickPick = () => {
    // Clear current selection
    onClearSelection();
    
    // Show animation
    setShowQuickPick(true);
    quickPickAnimation.setValue(0);
    
    Animated.timing(quickPickAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      setShowQuickPick(false);
      
      // Generate random numbers
      const mainNumbers = new Set<number>();
      while (mainNumbers.size < 6) {
        mainNumbers.add(Math.floor(Math.random() * 49) + 1);
      }
      
      // Generate random bonus number
      let bonusNumber;
      do {
        bonusNumber = Math.floor(Math.random() * 10) + 1;
      } while (mainNumbers.has(bonusNumber));
      
      // Select the numbers
      mainNumbers.forEach(num => onSelectNumber(num));
      onSelectBonusNumber(bonusNumber);
    });
  };

  const renderNumber = (number: number, isBonus = false) => {
    const isSelected = isBonus 
      ? game.bonusNumbers.includes(number)
      : game.selectedNumbers.includes(number);
    const isDrawn = isBonus
      ? game.bonusDrawnNumbers.includes(number)
      : game.drawnNumbers.includes(number);
    const isMatch = isSelected && isDrawn;
    
    let backgroundColor = 'transparent';
    let textColor = colors.text;
    let borderColor = colors.border;
    
    if (game.status === 'open') {
      if (isSelected) {
        backgroundColor = isBonus ? colors.accent : colors.primary;
        borderColor = isBonus ? colors.accent : colors.primary;
      }
    } else if (game.status === 'drawn') {
      if (isMatch) {
        backgroundColor = colors.success;
        borderColor = colors.success;
      } else if (isDrawn) {
        backgroundColor = colors.error;
        borderColor = colors.error;
      } else if (isSelected) {
        backgroundColor = isBonus ? colors.accent : colors.primary;
        borderColor = isBonus ? colors.accent : colors.primary;
      }
    }
    
    return (
      <TouchableOpacity
        key={`${number}-${isBonus}`}
        style={[
          styles.numberButton,
          { backgroundColor, borderColor },
        ]}
        onPress={() => isBonus ? onSelectBonusNumber(number) : onSelectNumber(number)}
        disabled={game.status !== 'open' || ticketPurchased}
      >
        <Text style={[styles.numberText, { color: textColor }]}>{number}</Text>
      </TouchableOpacity>
    );
  };

  const renderGrid = () => {
    const mainGrid = [];
    const totalMainNumbers = 49;
    const numbersPerRow = 7;
    
    for (let i = 0; i < totalMainNumbers; i += numbersPerRow) {
      const row = [];
      for (let j = 1; j <= numbersPerRow; j++) {
        const number = i + j;
        if (number <= totalMainNumbers) {
          row.push(renderNumber(number));
        }
      }
      
      mainGrid.push(
        <View key={`main-${i}`} style={styles.row}>
          {row}
        </View>
      );
    }
    
    return (
      <Card style={styles.gridContainer}>
        <View style={styles.gridHeader}>
          <Text style={styles.gridTitle}>Select 6 Numbers</Text>
          <TouchableOpacity 
            style={styles.quickPickButton}
            onPress={handleQuickPick}
            disabled={game.status !== 'open' || ticketPurchased}
          >
            <Shuffle size={16} color={colors.text} />
            <Text style={styles.quickPickText}>Quick Pick</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.grid}>{mainGrid}</View>
        
        <Text style={styles.gridTitle}>Select 1 Bonus Number</Text>
        <View style={styles.bonusRow}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => 
            renderNumber(number, true)
          )}
        </View>
      </Card>
    );
  };

  const renderBetControls = () => {
    const betOptions = [20, 50, 100, 200];
    
    return (
      <Card style={styles.betContainer}>
        <Text style={styles.betLabel}>Ticket Price:</Text>
        <View style={styles.betOptions}>
          {betOptions.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={[
                styles.betOption,
                betAmount === amount && styles.betOptionSelected,
              ]}
              onPress={() => onChangeBet(amount)}
              disabled={game.status !== 'open' || ticketPurchased}
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
    const isSelectionValid = 
      game.selectedNumbers.length === 6 && 
      game.bonusNumbers.length === 1;
    
    return (
      <View style={styles.controlsContainer}>
        <View style={styles.selectionInfo}>
          <Text style={styles.selectionText}>
            Selected: {game.selectedNumbers.length}/6 + {game.bonusNumbers.length}/1 Bonus
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Clear"
            onPress={onClearSelection}
            variant="outline"
            leftIcon={<RotateCcw size={18} color={colors.primary} />}
            disabled={game.status !== 'open' || (game.selectedNumbers.length === 0 && game.bonusNumbers.length === 0) || ticketPurchased}
          />
          <Button
            title="Buy Ticket"
            onPress={onBuyTicket}
            leftIcon={<Ticket size={18} color={colors.text} />}
            disabled={!isSelectionValid || game.status !== 'open' || ticketPurchased}
          />
        </View>
      </View>
    );
  };

  const renderJackpotInfo = () => {
    return (
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.jackpotContainer}
      >
        <View style={styles.jackpotContent}>
          <Text style={styles.jackpotLabel}>Jackpot</Text>
          <Text style={styles.jackpotAmount}>
            ${game.jackpot.toLocaleString()}
          </Text>
          <View style={styles.jackpotDateContainer}>
            <Clock size={16} color={colors.text} />
            <Text style={styles.jackpotDate}>
              Draw in: {countdown}
            </Text>
          </View>
        </View>
      </LinearGradient>
    );
  };

  const renderTicketStatus = () => {
    if (game.status === 'open' && !ticketPurchased) return null;
    
    return (
      <Card style={styles.ticketStatusContainer}>
        <Text style={styles.ticketStatusTitle}>
          {game.status === 'closed' ? 'Ticket Purchased' : 'Draw Results'}
        </Text>
        
        {game.status === 'closed' && (
          <>
            <View style={styles.ticketContainer}>
              <View style={styles.ticketHeader}>
                <Text style={styles.ticketTitle}>MEGA JACKPOT</Text>
                <Text style={styles.ticketSubtitle}>Official Ticket</Text>
              </View>
              
              <View style={styles.ticketNumbers}>
                <Text style={styles.ticketNumbersLabel}>Your Numbers:</Text>
                <View style={styles.ticketNumbersRow}>
                  {game.selectedNumbers.map(num => (
                    <View key={num} style={styles.ticketNumber}>
                      <Text style={styles.ticketNumberText}>{num}</Text>
                    </View>
                  ))}
                  <Text style={styles.ticketBonusLabel}>+</Text>
                  <View style={styles.ticketBonusNumber}>
                    <Text style={styles.ticketNumberText}>{game.bonusNumbers[0]}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.ticketFooter}>
                <Text style={styles.ticketDate}>
                  Draw Date: {new Date(game.drawDate).toLocaleDateString()}
                </Text>
                <Text style={styles.ticketPrice}>
                  Price: ${betAmount}
                </Text>
              </View>
            </View>
            
            <Text style={styles.ticketStatusText}>
              Your ticket has been purchased. Good luck in the upcoming draw!
            </Text>
          </>
        )}
        
        {game.status === 'drawn' && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsLabel}>Winning Numbers:</Text>
            <View style={styles.drawnNumbersContainer}>
              {game.drawnNumbers.map((number) => (
                <View 
                  key={number} 
                  style={[
                    styles.drawnNumber,
                    game.selectedNumbers.includes(number) && styles.matchedNumber
                  ]}
                >
                  <Text style={styles.drawnNumberText}>{number}</Text>
                </View>
              ))}
              <View style={styles.bonusNumberContainer}>
                <Text style={styles.bonusLabel}>+</Text>
                <View style={[
                  styles.bonusDrawnNumber,
                  game.bonusNumbers.includes(game.bonusDrawnNumbers[0]) && styles.matchedBonusNumber
                ]}>
                  <Text style={styles.drawnNumberText}>
                    {game.bonusDrawnNumbers[0]}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.resultsDetails}>
              <Text style={styles.resultsText}>
                You matched {game.selectedNumbers.filter(n => game.drawnNumbers.includes(n)).length} numbers
                {game.bonusNumbers.includes(game.bonusDrawnNumbers[0]) ? ' + Bonus' : ''}
              </Text>
              
              {/* For demo purposes, let's simulate a win */}
              <Text style={styles.winAmount}>
                You won $250!
              </Text>
            </View>
            
            <Button
              title="Play Again"
              onPress={onClearSelection}
              style={styles.playAgainButton}
            />
          </View>
        )}
      </Card>
    );
  };

  const renderPrizeBreakdown = () => {
    return (
      <Card style={styles.prizeContainer}>
        <View style={styles.prizeHeader}>
          <Award size={20} color={colors.chip} />
          <Text style={styles.prizeTitle}>Prize Breakdown</Text>
        </View>
        <View style={styles.prizeTable}>
          <View style={styles.prizeRow}>
            <Text style={styles.prizeMatch}>Match 6 numbers</Text>
            <Text style={styles.prizeAmount}>Jackpot</Text>
          </View>
          <View style={styles.prizeRow}>
            <Text style={styles.prizeMatch}>Match 5 + Bonus</Text>
            <Text style={styles.prizeAmount}>$100,000</Text>
          </View>
          <View style={styles.prizeRow}>
            <Text style={styles.prizeMatch}>Match 5</Text>
            <Text style={styles.prizeAmount}>$1,000</Text>
          </View>
          <View style={styles.prizeRow}>
            <Text style={styles.prizeMatch}>Match 4</Text>
            <Text style={styles.prizeAmount}>$100</Text>
          </View>
          <View style={styles.prizeRow}>
            <Text style={styles.prizeMatch}>Match 3</Text>
            <Text style={styles.prizeAmount}>$10</Text>
          </View>
          <View style={styles.prizeRow}>
            <Text style={styles.prizeMatch}>Match 2 + Bonus</Text>
            <Text style={styles.prizeAmount}>$5</Text>
          </View>
        </View>
      </Card>
    );
  };

  const renderQuickPickAnimation = () => {
    if (!showQuickPick) return null;
    
    const rotate = quickPickAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    
    const scale = quickPickAnimation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.2, 1],
    });
    
    return (
      <View style={styles.quickPickOverlay}>
        <Animated.View 
          style={[
            styles.quickPickAnimation,
            {
              transform: [
                { rotate },
                { scale }
              ]
            }
          ]}
        >
          <Shuffle size={40} color={colors.text} />
          <Text style={styles.quickPickAnimationText}>Picking Numbers...</Text>
        </Animated.View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {renderJackpotInfo()}
        {renderTicketStatus()}
        {renderGrid()}
        {renderBetControls()}
        {renderGameControls()}
        {renderPrizeBreakdown()}
        {renderQuickPickAnimation()}
        
        <View style={styles.gameRules}>
          <Text style={styles.gameRulesTitle}>How to Play Mega Jackpot</Text>
          <Text style={styles.gameRulesText}>
            1. Select 6 main numbers from 1-49{'\n'}
            2. Select 1 bonus number from 1-10{'\n'}
            3. Purchase your ticket{'\n'}
            4. Wait for the draw to see if you've won{'\n'}
            5. Match all 6 numbers to win the jackpot!
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
  jackpotContainer: {
    borderRadius: layout.borderRadius.lg,
    marginBottom: layout.spacing.lg,
    overflow: 'hidden',
  },
  jackpotContent: {
    padding: layout.spacing.lg,
    alignItems: 'center',
  },
  jackpotLabel: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    marginBottom: layout.spacing.xs,
  },
  jackpotAmount: {
    fontSize: fonts.sizes.xxxl,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.sm,
  },
  jackpotDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.md,
  },
  jackpotDate: {
    fontSize: fonts.sizes.sm,
    color: colors.text,
    marginLeft: layout.spacing.xs,
  },
  gridContainer: {
    marginBottom: layout.spacing.lg,
  },
  gridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.sm,
  },
  gridTitle: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.semibold,
    color: colors.text,
    marginBottom: layout.spacing.sm,
  },
  quickPickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.md,
  },
  quickPickText: {
    fontSize: fonts.sizes.sm,
    color: colors.text,
    marginLeft: 4,
  },
  grid: {
    marginBottom: layout.spacing.lg,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: layout.spacing.sm,
    gap: layout.spacing.xs,
  },
  bonusRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: layout.spacing.xs,
  },
  numberButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    margin: 2,
  },
  numberText: {
    fontSize: fonts.sizes.md,
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
    flex: 1,
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.sm,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 4,
    alignItems: 'center',
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
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: layout.spacing.md,
  },
  ticketStatusContainer: {
    marginBottom: layout.spacing.lg,
  },
  ticketStatusTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.md,
    textAlign: 'center',
  },
  ticketContainer: {
    backgroundColor: colors.background,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    padding: layout.spacing.md,
    marginBottom: layout.spacing.md,
  },
  ticketHeader: {
    alignItems: 'center',
    marginBottom: layout.spacing.md,
  },
  ticketTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.primary,
  },
  ticketSubtitle: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
  },
  ticketNumbers: {
    marginBottom: layout.spacing.md,
  },
  ticketNumbersLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    marginBottom: layout.spacing.xs,
  },
  ticketNumbersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ticketNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  ticketBonusLabel: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginHorizontal: 4,
  },
  ticketBonusNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  ticketNumberText: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.bold,
    color: colors.text,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: layout.spacing.sm,
  },
  ticketDate: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
  },
  ticketPrice: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.text,
  },
  ticketStatusText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    textAlign: 'center',
  },
  resultsContainer: {
    alignItems: 'center',
  },
  resultsLabel: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    marginBottom: layout.spacing.sm,
  },
  drawnNumbersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: layout.spacing.md,
  },
  drawnNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  matchedNumber: {
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.text,
  },
  bonusNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: layout.spacing.sm,
  },
  bonusLabel: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginRight: layout.spacing.xs,
  },
  bonusDrawnNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchedBonusNumber: {
    borderWidth: 2,
    borderColor: colors.text,
  },
  drawnNumberText: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.bold,
    color: colors.text,
  },
  resultsDetails: {
    alignItems: 'center',
    marginBottom: layout.spacing.lg,
  },
  resultsText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    textAlign: 'center',
    marginBottom: layout.spacing.sm,
  },
  winAmount: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.success,
  },
  playAgainButton: {
    minWidth: 150,
  },
  prizeContainer: {
    marginBottom: layout.spacing.lg,
  },
  prizeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.md,
  },
  prizeTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginLeft: layout.spacing.sm,
  },
  prizeTable: {
    gap: layout.spacing.xs,
  },
  prizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: layout.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  prizeMatch: {
    fontSize: fonts.sizes.md,
    color: colors.text,
  },
  prizeAmount: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.bold,
    color: colors.chip,
  },
  quickPickOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  quickPickAnimation: {
    backgroundColor: colors.card,
    padding: layout.spacing.lg,
    borderRadius: layout.borderRadius.lg,
    alignItems: 'center',
  },
  quickPickAnimationText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    marginTop: layout.spacing.sm,
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