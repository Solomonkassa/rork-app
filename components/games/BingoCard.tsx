import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { BingoGame } from '@/types/games';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Volume2, VolumeX, Users, Award, MessageCircle } from 'lucide-react-native';

interface BingoCardProps {
  game: BingoGame;
  onMarkCell: (row: number, col: number) => void;
  onStartGame: () => Promise<void>;
  betAmount: number;
  onChangeBet: (amount: number) => void;
}

export const BingoCard: React.FC<BingoCardProps> = ({
  game,
  onMarkCell,
  onStartGame,
  betAmount,
  onChangeBet,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastCalledNumber, setLastCalledNumber] = useState<number | null>(null);
  const [animValue] = useState(new Animated.Value(0));
  const [showWinPattern, setShowWinPattern] = useState(false);
  const [winPatternName, setWinPatternName] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, username: "JohnD", message: "Good luck everyone!" },
    { id: 2, username: "BingoQueen", message: "I need just one more number!" },
    { id: 3, username: "LuckyCharm", message: "Bingo night is the best!" }
  ]);
  
  const screenWidth = Dimensions.get('window').width;
  const isSmallScreen = screenWidth < 375;

  useEffect(() => {
    // Check for new drawn numbers
    if (game.status === 'playing' && game.drawnNumbers.length > 0) {
      const newNumber = game.drawnNumbers[game.drawnNumbers.length - 1];
      setLastCalledNumber(newNumber);
      
      // Animate the last called number
      animValue.setValue(0);
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [game.drawnNumbers]);

  useEffect(() => {
    // Check for win patterns when the game is complete
    if (game.status === 'complete') {
      // For demo purposes, let's simulate a win pattern
      const randomPattern = game.winPatterns[Math.floor(Math.random() * game.winPatterns.length)];
      setWinPatternName(randomPattern);
      setShowWinPattern(true);
    }
  }, [game.status]);

  const isCellMarked = (row: number, col: number) => {
    return game.markedPositions.some(
      ([r, c]) => r === row && c === col
    );
  };

  const isCellDrawn = (value: number) => {
    return game.drawnNumbers.includes(value);
  };

  const renderCell = (row: number, col: number, value: number) => {
    const isMarked = isCellMarked(row, col);
    const isDrawn = isCellDrawn(value);
    const isFreeSpace = value === 0;
    const isHighlighted = value === lastCalledNumber;
    
    let backgroundColor = colors.card;
    let textColor = colors.text;
    
    if (isFreeSpace) {
      backgroundColor = colors.secondary;
      textColor = colors.text;
    } else if (isMarked && isDrawn) {
      backgroundColor = colors.success;
    } else if (isMarked) {
      backgroundColor = colors.primary;
    } else if (isDrawn) {
      backgroundColor = colors.warning;
      textColor = colors.background;
    }
    
    if (isHighlighted) {
      backgroundColor = colors.accent;
      textColor = colors.background;
    }
    
    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        style={[
          styles.cell,
          { backgroundColor },
          isHighlighted && styles.highlightedCell
        ]}
        onPress={() => onMarkCell(row, col)}
        disabled={isFreeSpace || game.status !== 'playing'}
      >
        <Text style={[styles.cellText, { color: textColor }]}>
          {isFreeSpace ? 'FREE' : value}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderBingoCard = () => {
    return (
      <Card style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Your Bingo Card</Text>
          {game.status === 'playing' && (
            <TouchableOpacity 
              style={styles.soundButton}
              onPress={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? (
                <Volume2 size={20} color={colors.text} />
              ) : (
                <VolumeX size={20} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.headerRow}>
          {['B', 'I', 'N', 'G', 'O'].map((letter, index) => (
            <View key={letter} style={styles.headerCell}>
              <Text style={styles.headerText}>{letter}</Text>
            </View>
          ))}
        </View>
        {game.card.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((value, colIndex) => (
              renderCell(rowIndex, colIndex, value)
            ))}
          </View>
        ))}
      </Card>
    );
  };

  const renderBetControls = () => {
    const betOptions = [10, 20, 50, 100];
    
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
    return (
      <View style={styles.controlsContainer}>
        <Button
          title={game.status === 'waiting' ? 'Start Game' : 'New Card'}
          onPress={onStartGame}
          fullWidth
          leftIcon={game.status === 'waiting' ? <Award size={18} color={colors.text} /> : undefined}
        />
      </View>
    );
  };

  const renderDrawnNumbers = () => {
    if (game.drawnNumbers.length === 0) return null;
    
    return (
      <Card style={styles.drawnContainer}>
        <View style={styles.drawnHeader}>
          <Text style={styles.drawnTitle}>
            Called Numbers
          </Text>
          <View style={styles.playersCount}>
            <Users size={16} color={colors.textSecondary} />
            <Text style={styles.playersCountText}>42 players</Text>
          </View>
        </View>
        
        <View style={styles.drawnNumbers}>
          {game.drawnNumbers.slice(-10).map((number) => (
            <View 
              key={number} 
              style={[
                styles.drawnNumber,
                number === lastCalledNumber && styles.lastCalledNumber
              ]}
            >
              <Text style={[
                styles.drawnNumberText,
                number === lastCalledNumber && styles.lastCalledNumberText
              ]}>
                {number}
              </Text>
            </View>
          ))}
        </View>
      </Card>
    );
  };

  const renderLastCalledNumber = () => {
    if (!lastCalledNumber || game.status !== 'playing') return null;
    
    const scale = animValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.5, 1.2, 1],
    });
    
    const opacity = animValue.interpolate({
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [0, 1, 1, 0],
    });
    
    // Determine which letter column the number belongs to
    let letter = '';
    if (lastCalledNumber <= 15) letter = 'B';
    else if (lastCalledNumber <= 30) letter = 'I';
    else if (lastCalledNumber <= 45) letter = 'N';
    else if (lastCalledNumber <= 60) letter = 'G';
    else letter = 'O';
    
    return (
      <Animated.View 
        style={[
          styles.lastCalledContainer,
          {
            transform: [{ scale }],
            opacity,
          }
        ]}
      >
        <Text style={styles.lastCalledLabel}>Number Called</Text>
        <View style={styles.lastCalledNumberBig}>
          <Text style={styles.lastCalledLetter}>{letter}</Text>
          <Text style={styles.lastCalledNumberBigText}>{lastCalledNumber}</Text>
        </View>
      </Animated.View>
    );
  };

  const renderWinPatterns = () => {
    return (
      <Card style={styles.patternsContainer}>
        <View style={styles.patternsHeader}>
          <Award size={20} color={colors.chip} />
          <Text style={styles.patternsTitle}>Win Patterns</Text>
        </View>
        <View style={styles.patternsList}>
          {game.winPatterns.map((pattern) => (
            <View 
              key={pattern} 
              style={[
                styles.patternItem,
                winPatternName === pattern && styles.activePattern
              ]}
            >
              <View style={[
                styles.patternDot,
                winPatternName === pattern && styles.activePatternDot
              ]} />
              <Text style={[
                styles.patternText,
                winPatternName === pattern && styles.activePatternText
              ]}>
                {pattern.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Text>
            </View>
          ))}
        </View>
      </Card>
    );
  };

  const renderGameResults = () => {
    if (game.status !== 'complete') return null;
    
    return (
      <Card style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Game Results</Text>
        {winPatternName ? (
          <>
            <Text style={styles.winText}>BINGO!</Text>
            <Text style={styles.patternWinText}>
              You won with a {winPatternName.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')} pattern!
            </Text>
            <Text style={styles.winAmount}>
              You won ${betAmount * 2}!
            </Text>
          </>
        ) : (
          <Text style={styles.loseText}>
            Better luck next time!
          </Text>
        )}
        
        <Button
          title="Play Again"
          onPress={onStartGame}
          style={styles.playAgainButton}
        />
      </Card>
    );
  };

  const renderChatSection = () => {
    if (game.status !== 'playing') return null;
    
    return (
      <Card style={styles.chatContainer}>
        <View style={styles.chatHeader}>
          <MessageCircle size={18} color={colors.text} />
          <Text style={styles.chatTitle}>Live Chat</Text>
        </View>
        <View style={styles.chatMessages}>
          {chatMessages.map(message => (
            <View key={message.id} style={styles.chatMessage}>
              <Text style={styles.chatUsername}>{message.username}:</Text>
              <Text style={styles.chatText}>{message.message}</Text>
            </View>
          ))}
        </View>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {renderLastCalledNumber()}
        {renderGameResults()}
        {renderBingoCard()}
        {renderDrawnNumbers()}
        {renderChatSection()}
        {renderBetControls()}
        {renderGameControls()}
        {renderWinPatterns()}
        
        <View style={styles.gameRules}>
          <Text style={styles.gameRulesTitle}>How to Play Bingo</Text>
          <Text style={styles.gameRulesText}>
            1. Purchase a Bingo card with your chosen bet amount{'\n'}
            2. Numbers will be called one by one{'\n'}
            3. Mark the numbers on your card as they are called{'\n'}
            4. Complete one of the winning patterns to win!{'\n'}
            5. Don't forget to shout "BINGO!" when you win
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
  cardContainer: {
    marginBottom: layout.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.md,
  },
  cardTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.text,
  },
  soundButton: {
    padding: layout.spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: layout.spacing.sm,
  },
  headerCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.spacing.sm,
  },
  headerText: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.primary,
  },
  row: {
    flexDirection: 'row',
    marginBottom: layout.spacing.sm,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: layout.borderRadius.sm,
  },
  cellText: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.semibold,
  },
  highlightedCell: {
    borderWidth: 2,
    borderColor: colors.text,
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
  drawnContainer: {
    marginBottom: layout.spacing.lg,
  },
  drawnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.md,
  },
  drawnTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.text,
  },
  playersCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playersCountText: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  drawnNumbers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: layout.spacing.sm,
  },
  drawnNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lastCalledNumber: {
    backgroundColor: colors.accent,
    transform: [{ scale: 1.1 }],
  },
  drawnNumberText: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.bold,
    color: colors.text,
  },
  lastCalledNumberText: {
    color: colors.background,
  },
  lastCalledContainer: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lastCalledLabel: {
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
  lastCalledNumberBig: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.text,
  },
  lastCalledLetter: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.background,
    position: 'absolute',
    top: 10,
  },
  lastCalledNumberBigText: {
    fontSize: fonts.sizes.xxxl,
    fontWeight: fonts.weights.bold,
    color: colors.background,
  },
  patternsContainer: {
    marginBottom: layout.spacing.lg,
  },
  patternsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.md,
  },
  patternsTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginLeft: layout.spacing.sm,
  },
  patternsList: {
    gap: layout.spacing.sm,
  },
  patternItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: layout.spacing.xs,
    paddingHorizontal: layout.spacing.sm,
    borderRadius: layout.borderRadius.md,
  },
  activePattern: {
    backgroundColor: 'rgba(108, 92, 231, 0.2)',
  },
  patternDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: layout.spacing.sm,
  },
  activePatternDot: {
    backgroundColor: colors.chip,
  },
  patternText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
  },
  activePatternText: {
    fontWeight: fonts.weights.bold,
    color: colors.text,
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
  winText: {
    fontSize: fonts.sizes.xxxl,
    fontWeight: fonts.weights.bold,
    color: colors.chip,
    marginBottom: layout.spacing.sm,
  },
  patternWinText: {
    fontSize: fonts.sizes.md,
    color: colors.text,
    marginBottom: layout.spacing.md,
    textAlign: 'center',
  },
  winAmount: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.success,
    marginBottom: layout.spacing.lg,
  },
  loseText: {
    fontSize: fonts.sizes.lg,
    color: colors.textSecondary,
    marginBottom: layout.spacing.lg,
  },
  playAgainButton: {
    minWidth: 150,
  },
  chatContainer: {
    marginBottom: layout.spacing.lg,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.md,
  },
  chatTitle: {
    fontSize: fonts.sizes.md,
    fontWeight: fonts.weights.bold,
    color: colors.text,
    marginLeft: layout.spacing.xs,
  },
  chatMessages: {
    gap: layout.spacing.sm,
  },
  chatMessage: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chatUsername: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.primary,
    marginRight: layout.spacing.xs,
  },
  chatText: {
    fontSize: fonts.sizes.sm,
    color: colors.text,
    flex: 1,
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