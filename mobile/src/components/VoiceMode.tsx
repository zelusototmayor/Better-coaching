/**
 * VoiceMode Component
 * Full-screen voice conversation mode like ChatGPT voice
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { transcribeAudio, synthesizeSpeech } from '../services/api';

interface VoiceModeProps {
  agentId: string;
  agentName: string;
  agentAvatarUrl?: string;
  onMessage: (text: string) => Promise<string>; // Returns assistant response
  onClose: () => void;
  isPremium: boolean;
}

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

export default function VoiceMode({
  agentId,
  agentName,
  onMessage,
  onClose,
  isPremium,
}: VoiceModeProps) {
  const [state, setState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Animation for the pulsing mic
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Pulse animation when listening
  useEffect(() => {
    if (state === 'listening') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [state, pulseAnim]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
      }
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setTranscript('');
      setResponse('');

      // Request permission
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        setError('Microphone permission required');
        return;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await recording.startAsync();

      recordingRef.current = recording;
      setState('listening');
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to start recording');
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!recordingRef.current) return;

    try {
      setState('processing');

      // Stop recording
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      if (!uri) {
        setError('Recording failed');
        setState('idle');
        return;
      }

      // Get the audio file
      const response = await fetch(uri);
      const blob = await response.blob();

      // Transcribe
      const { text } = await transcribeAudio(blob);
      setTranscript(text);

      if (!text.trim()) {
        setError('Could not understand audio');
        setState('idle');
        return;
      }

      // Send message and get response
      const assistantResponse = await onMessage(text);
      setResponse(assistantResponse);

      // Speak the response
      setState('speaking');
      await speakResponse(assistantResponse);

      setState('idle');
    } catch (err: any) {
      console.error('Error processing recording:', err);
      setError(err.message || 'Failed to process audio');
      setState('idle');
    }
  }, [onMessage]);

  const speakResponse = async (text: string) => {
    try {
      // Get TTS audio
      const audioDataUrl = await synthesizeSpeech(text, agentId);

      // Configure audio for playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      // Play audio
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioDataUrl },
        { shouldPlay: true }
      );
      soundRef.current = sound;

      // Wait for playback to finish
      await new Promise<void>((resolve) => {
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            resolve();
          }
        });
      });

      await sound.unloadAsync();
      soundRef.current = null;
    } catch (err) {
      console.error('Error speaking response:', err);
      // Don't throw - just continue without TTS
    }
  };

  const handleMicPress = () => {
    if (state === 'idle') {
      startRecording();
    } else if (state === 'listening') {
      stopRecording();
    }
  };

  const stopSpeaking = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setState('idle');
  };

  if (!isPremium) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Ionicons name="lock-closed" size={48} color="rgba(255,255,255,0.5)" />
          <Text style={styles.premiumText}>Voice Mode is a Premium Feature</Text>
          <Text style={styles.premiumSubtext}>
            Upgrade to have natural voice conversations with your coach
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.agentName}>{agentName}</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        {/* State indicator */}
        <Text style={styles.stateText}>
          {state === 'idle' && 'Tap to speak'}
          {state === 'listening' && 'Listening...'}
          {state === 'processing' && 'Processing...'}
          {state === 'speaking' && 'Speaking...'}
        </Text>

        {/* Transcript */}
        {transcript && (
          <View style={styles.messageContainer}>
            <Text style={styles.label}>You said:</Text>
            <Text style={styles.transcript}>{transcript}</Text>
          </View>
        )}

        {/* Response */}
        {response && (
          <View style={styles.messageContainer}>
            <Text style={styles.label}>{agentName}:</Text>
            <Text style={styles.response}>{response}</Text>
          </View>
        )}

        {/* Error */}
        {error && <Text style={styles.error}>{error}</Text>}
      </View>

      {/* Mic button */}
      <View style={styles.micContainer}>
        {state === 'processing' ? (
          <View style={styles.micButton}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : state === 'speaking' ? (
          <TouchableOpacity style={styles.stopButton} onPress={stopSpeaking}>
            <Ionicons name="stop" size={32} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleMicPress}>
            <Animated.View
              style={[
                styles.micButton,
                state === 'listening' && styles.micButtonActive,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <Ionicons
                name={state === 'listening' ? 'mic' : 'mic-outline'}
                size={48}
                color="#fff"
              />
            </Animated.View>
          </TouchableOpacity>
        )}

        <Text style={styles.hint}>
          {state === 'listening' ? 'Tap to stop' : 'Hold or tap to speak'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  closeButton: {
    padding: 8,
  },
  agentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  stateText: {
    fontSize: 24,
    fontWeight: '300',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 32,
  },
  messageContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  transcript: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
  },
  response: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
  },
  error: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginTop: 16,
  },
  micContainer: {
    alignItems: 'center',
    paddingBottom: 60,
  },
  micButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonActive: {
    backgroundColor: '#ef4444',
  },
  stopButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    marginTop: 16,
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  premiumText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginTop: 24,
  },
  premiumSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 32,
  },
});
