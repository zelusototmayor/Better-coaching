/**
 * Notification Permission Modal
 * Asks for notification permission with friendly copy
 */

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NotificationPermissionModalProps {
  visible: boolean;
  onAllow: () => void;
  onDismiss: () => void;
}

export function NotificationPermissionModal({
  visible,
  onAllow,
  onDismiss,
}: NotificationPermissionModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="notifications" size={32} color="#6F8F79" />
          </View>

          {/* Title */}
          <Text style={styles.title}>Stay Connected</Text>

          {/* Description */}
          <Text style={styles.description}>
            Your coaches can send you helpful reminders and check-ins even when
            you're not in the app. Enable notifications to stay on track with
            your goals.
          </Text>

          {/* Benefits */}
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Ionicons name="time-outline" size={20} color="#6F8F79" />
              <Text style={styles.benefitText}>Gentle accountability reminders</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="bulb-outline" size={20} color="#6F8F79" />
              <Text style={styles.benefitText}>Personalized coaching insights</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="trending-up-outline" size={20} color="#6F8F79" />
              <Text style={styles.benefitText}>Progress check-ins</Text>
            </View>
          </View>

          {/* Buttons */}
          <TouchableOpacity style={styles.primaryButton} onPress={onAllow}>
            <Text style={styles.primaryButtonText}>Enable Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onDismiss}>
            <Text style={styles.secondaryButtonText}>Not Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DCE9DF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  benefitsList: {
    width: '100%',
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 10,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#6F8F79',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
});
