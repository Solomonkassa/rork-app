import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KenoBoard } from '@/components/games/KenoBoard';
import { BingoCard } from '@/components/games/BingoCard';
import { LottoTicket } from '@/components/games/LottoTicket';
import { useGameStore } from '@/store/game-store';
import { useWalletStore } from '@/store/wallet-store';
import { colors } from '@/constants/colors';
import { KenoGame, BingoGame, LottoGame } from '@/types/games';

export default function GameScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { activeGame, setActiveGame, resetActiveGame, isLoading, error,
    selectKenoNumber, clearKenoSelection, startKenoDraw,
    markBingoCell, startBingoGame,
    selectLottoNumber, selectLottoBonusNumber, clearLottoSelection, buyLottoTicket
  } = useGameStore();
  const { placeBet, recordWin } = useWalletStore();
  const [betAmount, setBetAmount] = useState(10);

  useEffect(() => {
    if (id) {
      setActiveGame(id as string);
    }

    return () => {
      resetActiveGame();
    };
  }, [id]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  useEffect(() => {
    if (activeGame) {
      // Set the header title based on the active game
      Stack.Screen.setOptions({
        title: activeGame.name,
      });
    }
  }, [activeGame]);

  const handleChangeBet = (amount: number) => {
    setBetAmount(amount);
  };

  const handleStartKenoDraw = async () => {
    const game = activeGame as KenoGame;
    
    // Place the bet
    await placeBet(betAmount, game.id, game.name);
    
    // Start the draw
    await startKenoDraw();
    
    // Calculate winnings
    const matches = game.selectedNumbers.filter(num => 
      game.drawnNumbers.includes(num)
    ).length;
    
    const payout = game.payoutTable[matches] * betAmount;
    
    // Record win if there is any
    if (payout > 0) {
      await recordWin(payout, game.id, game.name);
    }
  };

  const handleStartBingoGame = async () => {
    const game = activeGame as BingoGame;
    
    if (game.status === 'waiting') {
      // Place the bet
      await placeBet(betAmount, game.id, game.name);
    }
    
    // Start the game
    await startBingoGame();
    
    // For demo purposes, let's simulate a win
    const winAmount = betAmount * 2;
    await recordWin(winAmount, game.id, game.name);
  };

  const handleBuyLottoTicket = async () => {
    const game = activeGame as LottoGame;
    
    // Place the bet
    await placeBet(betAmount, game.id, game.name);
    
    // Buy the ticket
    await buyLottoTicket();
    
    Alert.alert(
      'Ticket Purchased',
      `Your lottery ticket has been purchased for $${betAmount}. Good luck in the upcoming draw!`
    );
  };

  if (isLoading || !activeGame) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading game...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
      {activeGame.type === 'keno' && (
        <KenoBoard
          game={activeGame as KenoGame}
          onSelectNumber={selectKenoNumber}
          onClearSelection={clearKenoSelection}
          onStartDraw={handleStartKenoDraw}
          betAmount={betAmount}
          onChangeBet={handleChangeBet}
        />
      )}

      {activeGame.type === 'bingo' && (
        <BingoCard
          game={activeGame as BingoGame}
          onMarkCell={markBingoCell}
          onStartGame={handleStartBingoGame}
          betAmount={betAmount}
          onChangeBet={handleChangeBet}
        />
      )}

      {activeGame.type === 'lotto' && (
        <LottoTicket
          game={activeGame as LottoGame}
          onSelectNumber={selectLottoNumber}
          onSelectBonusNumber={selectLottoBonusNumber}
          onClearSelection={clearLottoSelection}
          onBuyTicket={handleBuyLottoTicket}
          betAmount={betAmount}
          onChangeBet={handleChangeBet}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: colors.text,
  },
});