import { View, Text, TouchableOpacity } from 'react-native';
import type { AssessmentQuestion } from '../../types';

const colors = {
  sage: '#6F8F79',
  sageDark: '#4F6F5A',
  sageLight: '#DCE9DF',
  cardBg: 'rgba(255,255,255,0.95)',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
};

interface MultipleChoiceQuestionProps {
  question: AssessmentQuestion;
  value?: string;
  onChange: (value: string) => void;
}

export function MultipleChoiceQuestion({
  question,
  value,
  onChange,
}: MultipleChoiceQuestionProps) {
  const options = question.options || [];

  return (
    <View className="py-2">
      {options.map((option, index) => {
        const isSelected = value === option;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => onChange(option)}
            className="mb-3"
          >
            <View
              className="flex-row items-center p-4 rounded-xl"
              style={{
                backgroundColor: isSelected ? colors.sageLight : colors.cardBg,
                borderWidth: 2,
                borderColor: isSelected ? colors.sage : colors.border,
              }}
            >
              {/* Radio circle */}
              <View
                className="w-6 h-6 rounded-full border-2 items-center justify-center mr-3"
                style={{
                  borderColor: isSelected ? colors.sage : colors.border,
                  backgroundColor: isSelected ? colors.sage : 'transparent',
                }}
              >
                {isSelected && (
                  <View
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: 'white' }}
                  />
                )}
              </View>

              {/* Option text */}
              <Text
                className="flex-1 text-base font-inter-medium"
                style={{
                  color: isSelected ? colors.sageDark : colors.textPrimary,
                }}
              >
                {option}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
