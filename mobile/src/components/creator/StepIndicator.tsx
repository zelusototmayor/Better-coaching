import { View, Text } from 'react-native';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  const defaultLabels = ['Identity', 'Style', 'Expertise', 'Model', 'Voice', 'Preview'];

  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        const label = (labels || defaultLabels)[index];

        return (
          <View key={step} className="flex-row items-center flex-1">
            {/* Step circle and label */}
            <View className="items-center flex-1">
              <View
                className={`w-6 h-6 rounded-full items-center justify-center ${
                  isActive
                    ? 'bg-primary-600'
                    : isCompleted
                    ? 'bg-primary-600'
                    : 'bg-gray-200'
                }`}
              >
                {isCompleted ? (
                  <Text className="text-white text-xs">✓</Text>
                ) : (
                  <Text
                    className={`text-xs font-semibold ${
                      isActive ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    {step}
                  </Text>
                )}
              </View>
              <Text
                className={`text-[10px] mt-1 ${
                  isActive ? 'text-primary-600 font-medium' : 'text-gray-400'
                }`}
                numberOfLines={1}
              >
                {label}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
