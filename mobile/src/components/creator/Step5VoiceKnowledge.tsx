import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { useCreatorStore, AVAILABLE_VOICES } from '../../stores/creator';
import { synthesizeSpeech } from '../../services/api';

const VOICE_PREVIEW_TEXT = "Hello! I'm excited to be your coach. How can I help you today?";

export function Step5VoiceKnowledge() {
  const { draft, setDraft } = useCreatorStore();
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [knowledgeType, setKnowledgeType] = useState<'text' | 'url' | 'file'>('text');
  const [newKnowledge, setNewKnowledge] = useState({ title: '', content: '', url: '' });
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [soundRef, setSoundRef] = useState<Audio.Sound | null>(null);

  const selectedVoice = AVAILABLE_VOICES.find((v) => v.id === draft.voiceId) || AVAILABLE_VOICES[0];

  const addKnowledgeItem = () => {
    if (knowledgeType === 'url') {
      if (newKnowledge.url && newKnowledge.title) {
        setDraft({
          knowledgeContext: [
            ...draft.knowledgeContext,
            { type: 'url', title: newKnowledge.title, content: newKnowledge.url },
          ],
        });
        resetKnowledgeForm();
      }
    } else if (newKnowledge.title && newKnowledge.content) {
      setDraft({
        knowledgeContext: [
          ...draft.knowledgeContext,
          { type: knowledgeType, title: newKnowledge.title, content: newKnowledge.content },
        ],
      });
      resetKnowledgeForm();
    }
  };

  const resetKnowledgeForm = () => {
    setNewKnowledge({ title: '', content: '', url: '' });
    setKnowledgeType('text');
    setShowKnowledgeModal(false);
  };

  const removeKnowledgeItem = (index: number) => {
    const items = draft.knowledgeContext.filter((_, i) => i !== index);
    setDraft({ knowledgeContext: items });
  };

  const selectVoice = (voiceId: string) => {
    setDraft({ voiceId });
    setShowVoiceModal(false);
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setKnowledgeType('text');
        return;
      }

      const file = result.assets[0];

      // Read the file content for text files
      if (file.mimeType?.startsWith('text/') || file.name?.endsWith('.txt') || file.name?.endsWith('.md')) {
        const content = await FileSystem.readAsStringAsync(file.uri);
        setNewKnowledge({
          title: file.name || 'Uploaded File',
          content: content,
          url: '',
        });
      } else {
        // For PDF/DOC files, we'll store the file URI and name
        // Note: Full text extraction from PDFs would require additional processing
        setNewKnowledge({
          title: file.name || 'Uploaded File',
          content: `[File: ${file.name}]\nFile type: ${file.mimeType || 'unknown'}\nSize: ${file.size ? Math.round(file.size / 1024) + ' KB' : 'unknown'}`,
          url: '',
        });
        Alert.alert(
          'File Added',
          'PDF and Word documents are added as references. For best results with detailed content, consider pasting the text directly or using a URL.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to read the file. Please try again.');
      setKnowledgeType('text');
    }
  };

  const previewVoice = async (voiceId: string) => {
    try {
      // Stop any currently playing audio
      if (soundRef) {
        await soundRef.stopAsync();
        await soundRef.unloadAsync();
        setSoundRef(null);
      }

      if (playingVoiceId === voiceId) {
        setPlayingVoiceId(null);
        return;
      }

      setPlayingVoiceId(voiceId);

      // Configure audio for playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
      });

      // Get TTS audio with the specific voice
      const audioDataUrl = await synthesizeSpeech(VOICE_PREVIEW_TEXT, undefined, voiceId);

      // Play audio
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioDataUrl },
        { shouldPlay: true, volume: 1.0 }
      );
      setSoundRef(sound);

      // Wait for playback to finish
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingVoiceId(null);
          sound.unloadAsync();
          setSoundRef(null);
        }
      });
    } catch (error) {
      console.error('Error previewing voice:', error);
      setPlayingVoiceId(null);
      Alert.alert('Preview Error', 'Unable to preview voice. Please try again.');
    }
  };

  const getKnowledgeIcon = (type: string) => {
    switch (type) {
      case 'url':
        return 'link';
      case 'file':
        return 'document-attach';
      default:
        return 'document-text';
    }
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="px-5 py-4">
        {/* Knowledge Base - First */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-1">
            Knowledge Base (Optional)
          </Text>
          <Text className="text-xs text-gray-500 mb-3">
            Add documents, URLs, or text to make your coach more specialized
          </Text>

          {draft.knowledgeContext.map((item, index) => (
            <View key={index} className="bg-white rounded-xl p-4 mb-2 border border-gray-200">
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-row items-center flex-1">
                  <Ionicons name={getKnowledgeIcon(item.type)} size={18} color="#6B7280" />
                  <Text className="font-medium text-gray-900 ml-2" numberOfLines={1}>
                    {item.title}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removeKnowledgeItem(index)} className="ml-2">
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
              <Text className="text-sm text-gray-500" numberOfLines={2}>
                {item.type === 'url' ? item.content : item.content.substring(0, 100) + '...'}
              </Text>
            </View>
          ))}

          <TouchableOpacity
            onPress={() => setShowKnowledgeModal(true)}
            className="bg-gray-100 rounded-xl px-4 py-4 items-center flex-row justify-center"
          >
            <Ionicons name="add-circle-outline" size={20} color="#4B5563" />
            <Text className="text-gray-600 ml-2">Add Knowledge</Text>
          </TouchableOpacity>
        </View>

        {/* Voice Selection - Second */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-1">
            Coach Voice
          </Text>
          <Text className="text-xs text-gray-500 mb-3">
            Choose a voice for spoken responses
          </Text>

          {/* Dropdown Trigger */}
          <TouchableOpacity
            onPress={() => setShowVoiceModal(true)}
            className="bg-white rounded-xl border border-gray-200 px-4 py-4 flex-row items-center justify-between"
          >
            <View className="flex-row items-center flex-1">
              <Ionicons name="volume-high" size={20} color="#4F46E5" />
              <View className="ml-3">
                <Text className="font-medium text-gray-900">{selectedVoice.name}</Text>
                <Text className="text-sm text-gray-500">{selectedVoice.description}</Text>
              </View>
            </View>
            <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Voice Selection Modal */}
      <Modal visible={showVoiceModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl max-h-[70%]">
            <View className="flex-row justify-between items-center p-5 border-b border-gray-100">
              <Text className="text-lg font-semibold text-gray-900">
                Select Voice
              </Text>
              <TouchableOpacity onPress={() => setShowVoiceModal(false)}>
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={AVAILABLE_VOICES}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
                  className={`flex-row items-center px-5 py-4 border-b border-gray-100 ${
                    draft.voiceId === item.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <TouchableOpacity
                    onPress={() => selectVoice(item.id)}
                    className="flex-row items-center flex-1"
                  >
                    <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
                      <Ionicons
                        name={['Rachel', 'Domi', 'Bella'].includes(item.name) ? 'woman' : 'man'}
                        size={20}
                        color={draft.voiceId === item.id ? '#4F46E5' : '#6B7280'}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="font-medium text-gray-900">{item.name}</Text>
                      <Text className="text-sm text-gray-500">{item.description}</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Preview Button */}
                  <TouchableOpacity
                    onPress={() => previewVoice(item.id)}
                    className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center ml-2"
                  >
                    {playingVoiceId === item.id ? (
                      <ActivityIndicator size="small" color="#4F46E5" />
                    ) : (
                      <Ionicons name="play" size={18} color="#4F46E5" />
                    )}
                  </TouchableOpacity>

                  {draft.voiceId === item.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#4F46E5" className="ml-2" />
                  )}
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 40 }}
            />
          </View>
        </View>
      </Modal>

      {/* Knowledge Modal */}
      <Modal visible={showKnowledgeModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-5 pb-8">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-gray-900">
                Add Knowledge
              </Text>
              <TouchableOpacity onPress={resetKnowledgeForm}>
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Type Selector */}
            <View className="flex-row mb-4">
              <TouchableOpacity
                onPress={() => setKnowledgeType('text')}
                className={`flex-1 py-3 rounded-l-xl items-center ${
                  knowledgeType === 'text' ? 'bg-primary-600' : 'bg-gray-100'
                }`}
              >
                <Ionicons
                  name="document-text"
                  size={20}
                  color={knowledgeType === 'text' ? '#fff' : '#6B7280'}
                />
                <Text className={`text-xs mt-1 ${knowledgeType === 'text' ? 'text-white' : 'text-gray-600'}`}>
                  Text
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setKnowledgeType('url')}
                className={`flex-1 py-3 items-center ${
                  knowledgeType === 'url' ? 'bg-primary-600' : 'bg-gray-100'
                }`}
              >
                <Ionicons
                  name="link"
                  size={20}
                  color={knowledgeType === 'url' ? '#fff' : '#6B7280'}
                />
                <Text className={`text-xs mt-1 ${knowledgeType === 'url' ? 'text-white' : 'text-gray-600'}`}>
                  URL
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setKnowledgeType('file');
                  pickDocument();
                }}
                className={`flex-1 py-3 rounded-r-xl items-center ${
                  knowledgeType === 'file' ? 'bg-primary-600' : 'bg-gray-100'
                }`}
              >
                <Ionicons
                  name="document-attach"
                  size={20}
                  color={knowledgeType === 'file' ? '#fff' : '#6B7280'}
                />
                <Text className={`text-xs mt-1 ${knowledgeType === 'file' ? 'text-white' : 'text-gray-600'}`}>
                  File
                </Text>
              </TouchableOpacity>
            </View>

            {/* Title Input */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">Title</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 text-gray-900"
                placeholder="e.g., Coaching Methodology"
                placeholderTextColor="#9CA3AF"
                value={newKnowledge.title}
                onChangeText={(text) => setNewKnowledge({ ...newKnowledge, title: text })}
              />
            </View>

            {/* Content Input based on type */}
            {knowledgeType === 'url' ? (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-1">URL</Text>
                <TextInput
                  className="bg-gray-100 rounded-xl px-4 py-3 text-gray-900"
                  placeholder="https://notion.so/... or https://docs.google.com/..."
                  placeholderTextColor="#9CA3AF"
                  value={newKnowledge.url}
                  onChangeText={(text) => setNewKnowledge({ ...newKnowledge, url: text })}
                  autoCapitalize="none"
                  keyboardType="url"
                />
                <Text className="text-xs text-gray-400 mt-2">
                  Paste a public Notion page or Google Doc URL
                </Text>
              </View>
            ) : (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-1">Content</Text>
                <TextInput
                  className="bg-gray-100 rounded-xl px-4 py-3 text-gray-900 min-h-[150px]"
                  placeholder={knowledgeType === 'file' ? 'File content will appear here...' : 'Paste or write the knowledge content...'}
                  placeholderTextColor="#9CA3AF"
                  value={newKnowledge.content}
                  onChangeText={(text) => setNewKnowledge({ ...newKnowledge, content: text })}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            )}

            <TouchableOpacity
              onPress={addKnowledgeItem}
              disabled={!newKnowledge.title || (knowledgeType === 'url' ? !newKnowledge.url : !newKnowledge.content)}
              className={`py-4 rounded-xl items-center ${
                newKnowledge.title && (knowledgeType === 'url' ? newKnowledge.url : newKnowledge.content)
                  ? 'bg-primary-600'
                  : 'bg-gray-200'
              }`}
            >
              <Text
                className={`font-semibold ${
                  newKnowledge.title && (knowledgeType === 'url' ? newKnowledge.url : newKnowledge.content)
                    ? 'text-white'
                    : 'text-gray-500'
                }`}
              >
                Add Knowledge
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
