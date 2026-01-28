import { useState } from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import type { AssessmentQuestion } from '../../types';

const colors = {
  sage: '#6F8F79',
  sageDark: '#4F6F5A',
  sageLight: '#DCE9DF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
};

interface ScaleQuestionProps {
  question: AssessmentQuestion;
  value?: number;
  onChange: (value: number) => void;
}

export function ScaleQuestion({ question, value, onChange }: ScaleQuestionProps) {
  const [localValue, setLocalValue] = useState(value ?? 5);

  const handleChange = (newValue: number) => {
    const rounded = Math.round(newValue);
    setLocalValue(rounded);
  };

  const handleComplete = (newValue: number) => {
    const rounded = Math.round(newValue);
    setLocalValue(rounded);
    onChange(rounded);
  };

  const displayValue = value ?? localValue;

  return (
    <View className="py-4">
      {/* Value display */}
      <View className="items-center mb-6">
        <View
          className="w-20 h-20 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.sageLight }}
        >
          <Text
            className="text-3xl font-inter-bold"
            style={{ color: colors.sageDark }}
          >
            {displayValue}
          </Text>
        </View>
      </View>

      {/* Slider */}
      <View className="px-2">
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={displayValue}
          onValueChange={handleChange}
          onSlidingComplete={handleComplete}
          minimumTrackTintColor={colors.sage}
          maximumTrackTintColor={colors.sageLight}
          thumbTintColor={colors.sage}
        />
      </View>

      {/* Scale labels */}
      <View className="flex-row justify-between px-2 mt-2">
        <Text
          className="text-xs font-inter-regular"
          style={{ color: colors.textMuted }}
        >
          1 - Not at all
        </Text>
        <Text
          className="text-xs font-inter-regular"
          style={{ color: colors.textMuted }}
        >
          10 - Completely
        </Text>
      </View>

      {/* Scale ticks */}
      <View className="flex-row justify-between px-3 mt-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((tick) => (
          <View
            key={tick}
            className="items-center"
          >
            <View
              className="w-1 h-2 rounded-full"
              style={{
                backgroundColor: displayValue >= tick ? colors.sage : colors.sageLight,
              }}
            />
            <Text
              className="text-xs mt-1 font-inter-regular"
              style={{
                color: displayValue === tick ? colors.sageDark : colors.textMuted,
                fontWeight: displayValue === tick ? '600' : '400',
              }}
            >
              {tick}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
