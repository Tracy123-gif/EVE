import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { MemoryCanvasPreview } from '../components/canvas/MemoryCanvasPreview';
import { CelebrationBurst } from '../components/CelebrationBurst';
import { Icon } from '../components/Icon';
import { Button } from '../components/Button';
import { colors, fonts, radii, spacing } from '../theme/theme';
import { saveMemory, subscribeToMemory } from '../lib/memoriesService';
import { uploadToCloudinary } from '../lib/cloudinary';
import type { RootStackParamList } from '../navigation/types';
import type { Memory } from '../types/models';

type Props = NativeStackScreenProps<RootStackParamList, 'FlipReveal'>;

export function FlipRevealScreen({ route, navigation }: Props) {
  const { memoryId } = route.params;
  const [memory, setMemory] = useState<Memory | null>(null);
  const [reflection, setReflection] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [voiceUri, setVoiceUri] = useState<string | undefined>(undefined);
  const [celebrating, setCelebrating] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [uploadingVoice, setUploadingVoice] = useState(false);
  const hadBackRef = useRef(false);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const isRecording = recorderState.isRecording;

  useEffect(() => {
    const unsubscribe = subscribeToMemory(memoryId, (m) => {
      setMemory(m);
      if (m?.back) {
        hadBackRef.current = !!(m.back.photos.length || m.back.reflectionText);
        setPhotos(m.back.photos ?? []);
        setReflection(m.back.reflectionText ?? '');
        setVoiceUri(m.back.voiceNoteUri);
      }
    });
    return unsubscribe;
  }, [memoryId]);

  if (!memory) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>loading...</Text>
      </SafeAreaView>
    );
  }

  const isUnlocked = new Date(memory.date) <= new Date();
  const hasBack = !!(memory.back?.photos.length || memory.back?.reflectionText);

  const handleAddPhotos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (result.canceled || !result.assets.length) return;
    setUploadingPhotos(true);
    try {
      const urls = await Promise.all(
        result.assets.map((a) => uploadToCloudinary(a.uri, 'image')),
      );
      setPhotos((prev) => [...prev, ...urls]);
    } finally {
      setUploadingPhotos(false);
    }
  };

  const startRecording = async () => {
    const permission = await requestRecordingPermissionsAsync();
    if (!permission.granted) return;
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
    setTimeout(stopRecording, 10000);
  };

  const stopRecording = async () => {
    if (!recorder.isRecording) return;
    await recorder.stop();
    if (!recorder.uri) return;
    setUploadingVoice(true);
    try {
      const url = await uploadToCloudinary(recorder.uri, 'video');
      setVoiceUri(url);
    } finally {
      setUploadingVoice(false);
    }
  };

  const handleSave = async () => {
    const wasEmpty = !hasBack;
    await saveMemory({
      ...memory,
      back: {
        photos,
        reflectionText: reflection,
        voiceNoteUri: voiceUri,
        filledAt: Date.now(),
      },
      updatedAt: Date.now(),
    });
    if (wasEmpty && (photos.length || reflection)) {
      setCelebrating(true);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Icon name="back" size={22} color={colors.plum} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <MemoryCanvasPreview
          backgroundKey={memory.backgroundKey}
          elements={memory.canvas}
          style={{ maxHeight: 340 }}
        />

        <View style={styles.seam}>
          <View style={styles.seamLine} />
          <Text style={styles.seamLabel}>the plan, flipped</Text>
          <View style={styles.seamLine} />
        </View>

        {!isUnlocked ? (
          <Text style={styles.locked}>
            this page unlocks on {new Date(memory.date).toDateString()}
          </Text>
        ) : hasBack ? (
          <View style={styles.backContent}>
            <View style={styles.photoGrid}>
              {photos.map((uri, i) => (
                <Image key={i} source={{ uri }} style={styles.photo} />
              ))}
            </View>
            <TextInput
              style={styles.reflectionInput}
              value={reflection}
              onChangeText={setReflection}
              placeholder="how did it go?"
              placeholderTextColor={colors.plum + '80'}
              multiline
            />
            <Button
              label="add more photos"
              variant="secondary"
              loading={uploadingPhotos}
              onPress={handleAddPhotos}
            />
            <Button
              label={isRecording ? 'stop recording' : voiceUri ? 're-record voice note' : 'record voice note'}
              variant="secondary"
              loading={uploadingVoice}
              onPress={isRecording ? () => stopRecording() : startRecording}
              style={{ marginTop: spacing.sm }}
            />
            <Button label="save" onPress={handleSave} style={{ marginTop: spacing.sm }} />
          </View>
        ) : (
          <View style={styles.backContent}>
            <TouchableOpacity
              style={styles.dashedButton}
              disabled={uploadingPhotos}
              onPress={handleAddPhotos}
            >
              {uploadingPhotos ? (
                <ActivityIndicator color={colors.plum} />
              ) : (
                <Text style={styles.dashedLabel}>add today's photos</Text>
              )}
            </TouchableOpacity>
            <TextInput
              style={styles.reflectionInput}
              value={reflection}
              onChangeText={setReflection}
              placeholder="how did it go?"
              placeholderTextColor={colors.plum + '80'}
              multiline
            />
            <Button
              label={isRecording ? 'stop recording' : 'record voice note'}
              variant="secondary"
              loading={uploadingVoice}
              onPress={isRecording ? () => stopRecording() : startRecording}
            />
            <Button
              label="save"
              onPress={handleSave}
              disabled={!photos.length && !reflection}
              style={{ marginTop: spacing.sm }}
            />
          </View>
        )}
      </ScrollView>
      {celebrating && <CelebrationBurst onDone={() => setCelebrating(false)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  headerRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  loading: {
    fontFamily: fonts.important,
    color: colors.plum,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  seam: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.lg,
    gap: spacing.sm,
  },
  seamLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.plum,
    opacity: 0.4,
  },
  seamLabel: {
    fontFamily: fonts.whimsical,
    fontSize: 16,
    color: colors.plum,
  },
  locked: {
    fontFamily: fonts.important,
    fontSize: 13,
    color: colors.plum,
    opacity: 0.6,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  backContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  dashedButton: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.plum,
    borderRadius: radii.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  dashedLabel: {
    fontFamily: fonts.importantSemiBold,
    fontSize: 14,
    color: colors.plum,
  },
  reflectionInput: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.md,
    minHeight: 80,
    fontFamily: fonts.whimsical,
    fontSize: 18,
    color: colors.plum,
    textAlignVertical: 'top',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  photo: {
    width: 96,
    height: 96,
    borderRadius: radii.sm,
  },
});
