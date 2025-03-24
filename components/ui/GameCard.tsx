import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Clock } from 'lucide-react-native';
import { Link } from 'expo-router';
import { Game } from '@/types/games';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { layout } from '@/constants/layout';

interface GameCardProps {
  game: Game;
  onPress: (gameId: string) => string; // Changed to return a string path
}

export const GameCard: React.FC<GameCardProps> = ({ game, onPress }) => {
  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} min`;
    } else {
      const hours = Math.floor(diffMins / 60);
      return `${hours} hr`;
    }
  };

  // Get the path to navigate to
  const href = onPress(game.id);

  return (
    <Link href={href} asChild>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.8}
      >
        <Image source={{