import { useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../ui/Button';
import { ScaleQuestion } from './ScaleQuestion';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import { OpenTextQuestion } from './OpenTextQuestion';
import type { AssessmentConfig, AssessmentQuestion } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const colors = {
  sage: '#6F8F79',
  sageDark: '#4F6F5A',
  sageLight: '#DCE9DF',
  surface: '#F5F5F7',
  cardBg: 'rgba(255,255,255,0.95)',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
};

interface AssessmentModalProps {
  visible: boolean;
  assessment: AssessmentConfig;
  onClose: () => void;
  onSubmit: (answers: Record<string, string | number>) => void;
  isSubmitting?: boolean;
}

export function AssessmentModal({
  visible,
  assessment,
  onClose,
  onSubmit,
  isSubmitting = false,
}: AssessmentModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});

  // Animation
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const currentQuestion = assessment.questions[currentStep];
  const progress = ((currentStep + 1) / assessment.questions.length) * 100;
  const isLastStep = currentStep === assessment.questions.length - 1;

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

  const handleAnswer = (questionId: string, value: string | number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (isLastStep) {
      onSubmit(answers);
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
      onSubmit(answers);
    } else {
      animateTransition('next', () => setCurrentStep((prev) => prev + 1));
    }
  };

  const canProceed = () => {
    if (!currentQuestion.required) return true;
    return answers[currentQuestion.id] !== undefined;
  };

  const renderQuestion = (question: AssessmentQuestion) => {
    const currentAnswer = answers[question.id];

    switch (question.type) {
      case 'scale_1_10':
        return (
          <ScaleQuestion
            question={question}
            value={currentAnswer as number}
            onChange={(value) => handleAnswer(question.id, value)}
          />
        );
      case 'multiple_choice':
        return (
          <MultipleChoiceQuestion
            question={question}
            value={currentAnswer as string}
            onChange={(value) => handleAnswer(question.id, value)}
          />
        );
      case 'open_text':
        return (
          <OpenTextQuestion
            question={question}
            value={currentAnswer as string}
            onChange={(value) => handleAnswer(question.id, value)}
          />
        );
      default:
        return null;
    }
  };

  const handleClose = () => {
    // Reset state on close
    setCurrentStep(0);
    setAnswers({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView className="flex-1" style={{ backgroundColor: colors.surface }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          {/* Header */}
          <View className="px-5 pt-4 pb-2">
            <View className="flex-row justify-between items-center mb-4">
              <Text
                className="text-lg font-inter-bold"
                style={{ color: colors.textPrimary }}
              >
                {assessment.name}
              </Text>
              <TouchableOpacity onPress={handleClose}>
                <Text
                  className="text-2xl font-inter-regular"
                  style={{ color: colors.textSecondary }}
                >
                  ×
                </Text>
              </TouchableOpacity>
            </View>

            {/* Progress bar */}
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
              Question {currentStep + 1} of {assessment.questions.length}
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
              {/* Category badge */}
              {currentQuestion.category && (
                <View
                  className="self-start px-3 py-1 rounded-full mb-3 mt-4"
                  style={{ backgroundColor: colors.sageLight }}
                >
                  <Text
                    className="text-xs font-inter-medium"
                    style={{ color: colors.sageDark }}
                  >
                    {currentQuestion.category}
                  </Text>
                </View>
              )}

              {/* Question text */}
              <Text
                className="text-xl font-inter-bold mb-6"
                style={{ color: colors.textPrimary, marginTop: currentQuestion.category ? 0 : 16 }}
              >
                {currentQuestion.text}
              </Text>

              {/* Question input */}
              {renderQuestion(currentQuestion)}
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

              {!currentQuestion.required && (
                <TouchableOpacity onPress={handleSkip}>
                  <Text
                    className="text-sm font-inter-medium"
                    style={{ color: colors.textSecondary }}
                  >
                    Skip
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleNext}
              loading={isSubmitting}
              disabled={!canProceed() || isSubmitting}
            >
              {isLastStep ? 'Complete' : 'Continue'}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
