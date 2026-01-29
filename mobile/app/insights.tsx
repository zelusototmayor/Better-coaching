/**
 * Insights Screen
 * View and manage what the AI remembers about you
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getInsights, updateInsight, deleteInsight, UserInsight } from '../src/services/api';

// Category colors and icons
const CATEGORY_CONFIG: Record<string, { color: string; icon: string }> = {
  GOAL: { color: '#10B981', icon: 'flag' },
  CHALLENGE: { color: '#EF4444', icon: 'warning' },
  VALUE: { color: '#8B5CF6', icon: 'heart' },
  PREFERENCE: { color: '#F59E0B', icon: 'options' },
  ACHIEVEMENT: { color: '#06B6D4', icon: 'trophy' },
  COMMITMENT: { color: '#EC4899', icon: 'checkmark-circle' },
  CONTEXT: { color: '#6366F1', icon: 'information-circle' },
  RELATIONSHIP: { color: '#14B8A6', icon: 'people' },
  HABIT: { color: '#F97316', icon: 'repeat' },
  EMOTION: { color: '#A855F7', icon: 'happy' },
};

export default function InsightsScreen() {
  const [insights, setInsights] = useState<UserInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const loadInsights = useCallback(async () => {
    try {
      const { insights: data } = await getInsights();
      setInsights(data);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadInsights();
  }, [loadInsights]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadInsights();
  };

  const handleEdit = (insight: UserInsight) => {
    setEditingId(insight.id);
    setEditContent(insight.content);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editContent.trim()) return;

    try {
      await updateInsight(editingId, editContent.trim());
      setInsights((prev) =>
        prev.map((i) =>
          i.id === editingId ? { ...i, content: editContent.trim(), userEdited: true } : i
        )
      );
      setEditingId(null);
      setEditContent('');
    } catch (error) {
      Alert.alert('Error', 'Failed to update insight');
    }
  };

  const handleDelete = (insight: UserInsight) => {
    Alert.alert(
      'Remove Memory',
      'Are you sure you want to remove this memory? Your coach will no longer reference it.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteInsight(insight.id);
              setInsights((prev) => prev.filter((i) => i.id !== insight.id));
            } catch (error) {
              Alert.alert('Error', 'Failed to remove insight');
            }
          },
        },
      ]
    );
  };

  const groupedInsights = insights.reduce((acc, insight) => {
    const category = insight.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(insight);
    return acc;
  }, {} as Record<string, UserInsight[]>);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>What I Remember</Text>
          <Text style={styles.subtitle}>
            These are insights your coaches have learned about you from your conversations.
            They use this to provide more personalized guidance.
          </Text>
        </View>

        {insights.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="bulb-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No memories yet</Text>
            <Text style={styles.emptySubtitle}>
              As you chat with your coaches, they'll learn and remember important things
              about your goals, challenges, and preferences.
            </Text>
          </View>
        ) : (
          Object.entries(groupedInsights).map(([category, categoryInsights]) => (
            <View key={category} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: CATEGORY_CONFIG[category]?.color || '#6B7280' },
                  ]}
                >
                  <Ionicons
                    name={(CATEGORY_CONFIG[category]?.icon || 'ellipse') as any}
                    size={16}
                    color="#fff"
                  />
                </View>
                <Text style={styles.categoryTitle}>
                  {category.charAt(0) + category.slice(1).toLowerCase().replace('_', ' ')}
                </Text>
                <Text style={styles.categoryCount}>{categoryInsights.length}</Text>
              </View>

              {categoryInsights.map((insight) => (
                <View key={insight.id} style={styles.insightCard}>
                  {editingId === insight.id ? (
                    <View style={styles.editContainer}>
                      <TextInput
                        style={styles.editInput}
                        value={editContent}
                        onChangeText={setEditContent}
                        multiline
                        autoFocus
                      />
                      <View style={styles.editActions}>
                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={() => {
                            setEditingId(null);
                            setEditContent('');
                          }}
                        >
                          <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
                          <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <>
                      <Text style={styles.insightContent}>{insight.content}</Text>
                      {insight.agent && (
                        <Text style={styles.insightSource}>
                          From: {insight.agent.name}
                        </Text>
                      )}
                      {insight.userEdited && (
                        <Text style={styles.editedBadge}>Edited</Text>
                      )}
                      <View style={styles.insightActions}>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleEdit(insight)}
                        >
                          <Ionicons name="pencil" size={16} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleDelete(insight)}
                        >
                          <Ionicons name="trash-outline" size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
    lineHeight: 20,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  categoryCount: {
    fontSize: 14,
    color: '#9CA3AF',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  insightCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  insightContent: {
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 22,
  },
  insightSource: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
  editedBadge: {
    fontSize: 10,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  insightActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  editContainer: {
    gap: 12,
  },
  editInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#1F2937',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
