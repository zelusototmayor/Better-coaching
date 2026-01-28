import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/ui/Button';
import { useAuthStore } from '../../src/stores/auth';
import * as api from '../../src/services/api';
import type { UserContext } from '../../src/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Colors from design system
const colors = {
  sage: '#6F8F79',
  sageDark: '#4F6F5A',
  sageLight: '#DCE9DF',
  surface: '#F5F5F7',
  cardBg: 'rgba(255,255,255,0.92)',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
};

// Suggested values for chip selection
const SUGGESTED_VALUES = [
  'Growth',
  'Family',
  'Creativity',
  'Health',
  'Freedom',
  'Impact',
  'Learning',
  'Balance',
  'Adventure',
  'Security',
  'Connection',
  'Excellence',
];

// Value Chip Component
function ValueChip({
  value,
  isSelected,
  onToggle,
}: {
  value: string;
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      className={`px-4 py-2 rounded-full mr-2 mb-2`}
      style={{
        backgroundColor: isSelected ? colors.sage : 'white',
        borderWidth: 1,
        borderColor: isSelected ? colors.sage : colors.border,
      }}
    >
      <Text
        className={`text-sm font-inter-medium`}
        style={{ color: isSelected ? 'white' : colors.textSecondary }}
      >
        {value}
      </Text>
    </TouchableOpacity>
  );
}

// Step configuration
const STEPS = [
  {
    id: 'name',
    title: 'What should we call you?',
    subtitle: 'Your coaches will use this name to address you personally.',
    field: 'name' as keyof UserContext,
    placeholder: 'Enter your name...',
    multiline: false,
  },
  {
    id: 'about',
    title: 'Tell us about yourself',
    subtitle: 'A brief description helps coaches understand your background.',
    field: 'about' as keyof UserContext,
    placeholder: 'I am a professional who...',
    multiline: true,
  },
  {
    id: 'values',
    title: 'What matters most to you?',
    subtitle: 'Select up to 6 core values that guide your life.',
    field: 'values' as keyof UserContext,
    isChipSelection: true,
  },
  {
    id: 'goals',
    title: "What are you working towards?",
    subtitle: 'Share your current goals so coaches can help you achieve them.',
    field: 'goals' as keyof UserContext,
    placeholder: 'I want to improve my...',
    multiline: true,
  },
  {
    id: 'challenges',
    title: "What's holding you back?",
    subtitle: 'Understanding your challenges helps coaches provide relevant advice.',
    field: 'challenges' as keyof UserContext,
    placeholder: 'I struggle with...',
    multiline: true,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { refreshUser, setHasSeenWelcome } = useAuthStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [context, setContext] = useState<UserContext>({
    name: '',
    about: '',
    values: [],
    goals: '',
    challenges: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Animation
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const isLastStep = currentStep === STEPS.length - 1;

  const animateTransition = (direction: 'next' | 'prev', callback: () => void) => {
    const toValue = direction === 'next' ? -SCREEN_WIDTH : SCREEN_WIDTH;

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      slideAnim.setValue(direction === 'next' ? SCREEN_WIDTH : -SCREEN_WIDTH);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      animateTransition('next', () => setCurrentStep((prev) => prev + 1));
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      animateTransition('prev', () => setCurrentStep((prev) => prev - 1));
    }
  };

  const handleSkip = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      animateTransition('next', () => setCurrentStep((prev) => prev + 1));
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    try {
      // Save context first
      await api.updateUserContext(context);
      // Mark onboarding as complete
      await api.completeOnboarding();
      // Refresh user data
      await refreshUser();
      // Mark welcome as seen
      await setHasSeenWelcome(true);
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      Alert.alert('Error', 'Failed to save your preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleValue = (value: string) => {
    setContext((prev) => {
      const values = prev.values || [];
      if (values.includes(value)) {
        return { ...prev, values: values.filter((v) => v !== value) };
      }
      if (values.length >= 6) {
        Alert.alert('Limit Reached', 'You can select up to 6 values');
        return prev;
      }
      return { ...prev, values: [...values, value] };
    });
  };

  const updateField = (field: keyof UserContext, value: string) => {
    setContext((prev) => ({ ...prev, [field]: value }));
  };

  const getCurrentValue = (): string => {
    const value = context[step.field];
    if (Array.isArray(value)) return '';
    return value || '';
  };

  const hasContent = (): boolean => {
    const value = context[step.field];
    if (Array.isArray(value)) return value.length > 0;
    return !!value && value.trim().length > 0;
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.surface }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Progress bar */}
        <View className="px-5 pt-4 pb-2">
          <View
            className="h-1 rounded-full overflow-hidden"
            style={{ backgroundColor: colors.sageLight }}
          >
            <View
              className="h-full rounded-full"
              style={{
                backgroundColor: colors.sage,
                width: `${progress}%`,
              }}
            />
          </View>
          <Text
            className="text-xs mt-2 font-inter-regular"
            style={{ color: colors.textMuted }}
          >
            Step {currentStep + 1} of {STEPS.length}
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            }}
          >
            {/* Question */}
            <View className="pt-6 pb-4">
              <Text
                className="text-2xl font-inter-bold mb-2"
                style={{ color: colors.textPrimary }}
              >
                {step.title}
              </Text>
              <Text
                className="text-base font-inter-regular"
                style={{ color: colors.textSecondary }}
              >
                {step.subtitle}
              </Text>
            </View>

            {/* Input */}
            {step.isChipSelection ? (
              <View className="flex-row flex-wrap pt-4">
                {SUGGESTED_VALUES.map((value) => (
                  <ValueChip
                    key={value}
                    value={value}
                    isSelected={context.values?.includes(value) || false}
                    onToggle={() => toggleValue(value)}
                  />
                ))}
              </View>
            ) : (
              <TextInput
                className="rounded-xl px-4 py-4 text-base font-inter-regular"
                style={{
                  backgroundColor: colors.cardBg,
                  borderWidth: 1.5,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  minHeight: step.multiline ? 120 : 56,
                  textAlignVertical: step.multiline ? 'top' : 'center',
                }}
                placeholder={step.placeholder}
                placeholderTextColor={colors.textMuted}
                value={getCurrentValue()}
                onChangeText={(text) => updateField(step.field, text)}
                multiline={step.multiline}
                autoFocus={currentStep === 0}
              />
            )}
          </Animated.View>
        </ScrollView>

        {/* Navigation buttons */}
        <View
          className="px-5 pb-4 pt-2"
          style={{
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          <View className="flex-row justify-between items-center mb-3">
            {currentStep > 0 ? (
              <Button variant="ghost" onPress={handleBack}>
                Back
              </Button>
            ) : (
              <View style={{ width: 80 }} />
            )}

            <TouchableOpacity onPress={handleSkip}>
              <Text
                className="text-sm font-inter-medium"
                style={{ color: colors.textSecondary }}
              >
                Skip
              </Text>
            </TouchableOpacity>
          </View>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleNext}
            loading={isSaving}
            disabled={isSaving}
          >
            {isLastStep ? 'Get Started' : 'Continue'}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
