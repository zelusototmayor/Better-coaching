import { View, TextInput } from 'react-native';
import type { AssessmentQuestion } from '../../types';

const colors = {
  sage: '#6F8F79',
  sageLight: '#DCE9DF',
  cardBg: 'rgba(255,255,255,0.95)',
  textPrimary: '#111827',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
};

interface OpenTextQuestionProps {
  question: AssessmentQuestion;
  value?: string;
  onChange: (value: string) => void;
}

export function OpenTextQuestion({
  question,
  value,
  onChange,
}: OpenTextQuestionProps) {
  return (
    <View className="py-2">
      <TextInput
        className="rounded-xl px-4 py-4 text-base font-inter-regular"
        style={{
          backgroundColor: cardBg,
          borderWidth: 1.5,
          borderColor: value ? colors.sage : colors.border,
          color: colors.textPrimary,
          minHeight: 120,
          textAlignVertical: 'top',
        }}
        placeholder="Type your answer here..."
        placeholderTextColor={colors.textMuted}
        value={value || ''}
        onChangeText={onChange}
        multiline
        autoFocus
      />
    </View>
  );
}

const cardBg = colors.cardBg;
