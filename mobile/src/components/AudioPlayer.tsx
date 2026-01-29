import { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import * as api from '../services/api';
import { stripMarkdown } from '../utils/markdown';

const colors = {
  sage: '#6F8F79',
  sageDark: '#4F6F5A',
  sageLight: '#DCE9DF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
};

interface AudioPlayerProps {
  text: string;
  agentId?: string;
  compact?: boolean;
}

type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused';

export function AudioPlayer({ text, agentId, compact = true }: AudioPlayerProps) {
  const [state, setState] = useState<PlaybackState>('idle');
  const [error, setError] = useState<string | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const handlePlay = async () => {
    setError(null);

    // If already loaded and paused, resume
    if (soundRef.current && state === 'paused') {
      try {
        await soundRef.current.playAsync();
        setState('playing');
        return;
      } catch (e) {
        console.error('Resume failed:', e);
      }
    }

    // Load new audio
    setState('loading');

    try {
      // Request TTS from backend (strip markdown so it doesn't read formatting)
      const cleanText = stripMarkdown(text);
      const audioUrl = await api.synthesizeSpeech(cleanText, agentId);

      // Unload previous sound
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      // Configure audio mode for loud playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      // Load and play at full volume
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true, volume: 1.0 },
        onPlaybackStatusUpdate
      );

      // Ensure max volume
      await sound.setVolumeAsync(1.0);

      soundRef.current = sound;
      setState('playing');
    } catch (e) {
      console.error('Playback error:', e);
      setError('Could not play audio');
      setState('idle');
    }
  };

  const handlePause = async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
      setState('paused');
    }
  };

  const handleStop = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setState('idle');
    setProgress(0);
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setProgress(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);

      if (status.didJustFinish) {
        setState('idle');
        setProgress(0);
      }
    }
  };

  // Compact version - just a play button
  if (compact) {
    return (
      <Pressable
        onPress={state === 'playing' ? handlePause : handlePlay}
        className="p-1.5"
        disabled={state === 'loading'}
      >
        {state === 'loading' ? (
          <ActivityIndicator size="small" color={colors.sage} />
        ) : (
          <View
            className="w-6 h-6 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.sageLight }}
          >
            {state === 'playing' ? (
              <Text className="text-xs" style={{ color: colors.sageDark }}>⏸</Text>
            ) : (
              <Text className="text-xs" style={{ color: colors.sageDark }}>▶</Text>
            )}
          </View>
        )}
      </Pressable>
    );
  }

  // Full version with progress
  return (
    <View className="flex-row items-center py-2 px-3 rounded-xl" style={{ backgroundColor: colors.sageLight }}>
      {/* Play/Pause button */}
      <Pressable
        onPress={state === 'playing' ? handlePause : handlePlay}
        className="mr-3"
        disabled={state === 'loading'}
      >
        {state === 'loading' ? (
          <ActivityIndicator size="small" color={colors.sage} />
        ) : (
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.sage }}
          >
            {state === 'playing' ? (
              <Text className="text-lg text-white">⏸</Text>
            ) : (
              <Text className="text-lg text-white">▶</Text>
            )}
          </View>
        )}
      </Pressable>

      {/* Progress bar */}
      <View className="flex-1 mr-3">
        <View className="h-1 rounded-full" style={{ backgroundColor: colors.sageDark + '30' }}>
          <View
            className="h-full rounded-full"
            style={{
              backgroundColor: colors.sageDark,
              width: duration > 0 ? `${(progress / duration) * 100}%` : '0%',
            }}
          />
        </View>
        {duration > 0 && (
          <View className="flex-row justify-between mt-1">
            <Text className="text-xs" style={{ color: colors.textMuted }}>
              {formatTime(progress)}
            </Text>
            <Text className="text-xs" style={{ color: colors.textMuted }}>
              {formatTime(duration)}
            </Text>
          </View>
        )}
      </View>

      {/* Stop button */}
      {state !== 'idle' && (
        <Pressable onPress={handleStop}>
          <View
            className="w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.sageDark + '30' }}
          >
            <Text className="text-sm" style={{ color: colors.sageDark }}>⏹</Text>
          </View>
        </Pressable>
      )}

      {/* Error */}
      {error && (
        <Text className="text-xs ml-2" style={{ color: '#EF4444' }}>
          {error}
        </Text>
      )}
    </View>
  );
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
