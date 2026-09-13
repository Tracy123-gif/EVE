import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { Icon, type IconName } from '../components/Icon';
import { BottomSheet } from '../components/BottomSheet';
import { CanvasBackground } from '../components/canvas/CanvasBackground';
import { CanvasElementView } from '../components/canvas/CanvasElementView';
import { BackgroundSheet } from '../components/canvas/sheets/BackgroundSheet';
import { AssetSheet } from '../components/canvas/sheets/AssetSheet';
import { TextSheet } from '../components/canvas/sheets/TextSheet';
import { MusicSheet } from '../components/canvas/sheets/MusicSheet';
import { colors, spacing } from '../theme/theme';
import { useEditorStore } from '../store/editorStore';
import { generateId } from '../lib/id';

type Tool = 'background' | 'upload' | 'camera' | 'asset' | 'music' | 'text' | null;

const TOOLS: { key: Exclude<Tool, null>; icon: IconName }[] = [
  { key: 'background', icon: 'background' },
  { key: 'upload', icon: 'upload' },
  { key: 'camera', icon: 'camera' },
  { key: 'asset', icon: 'asset' },
  { key: 'music', icon: 'music' },
  { key: 'text', icon: 'text' },
];

export function EditorScreen() {
  const [activeTool, setActiveTool] = useState<Tool>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const elements = useEditorStore((s) => s.elements);
  const backgroundKey = useEditorStore((s) => s.backgroundKey);
  const musicId = useEditorStore((s) => s.musicId);
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const setBackground = useEditorStore((s) => s.setBackground);
  const setMusic = useEditorStore((s) => s.setMusic);
  const addElement = useEditorStore((s) => s.addElement);
  const updateElement = useEditorStore((s) => s.updateElement);
  const removeElement = useEditorStore((s) => s.removeElement);
  const bringToFront = useEditorStore((s) => s.bringToFront);
  const selectElement = useEditorStore((s) => s.selectElement);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setCanvasSize({ width, height });
  };

  const centerPosition = (size: number) => ({
    x: Math.max(0, canvasSize.width / 2 - size / 2),
    y: Math.max(0, canvasSize.height / 2 - size / 2),
  });

  const handleToolPress = async (tool: Exclude<Tool, null>) => {
    if (tool === 'upload') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        const pos = centerPosition(160);
        addElement({
          id: generateId(),
          type: 'photo',
          x: pos.x,
          y: pos.y,
          width: 160,
          height: 160,
          rotation: 0,
          zIndex: 0,
          value: result.assets[0].uri,
        });
      }
      return;
    }
    if (tool === 'camera') {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) return;
      const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
      if (!result.canceled && result.assets[0]) {
        const pos = centerPosition(160);
        addElement({
          id: generateId(),
          type: 'photo',
          x: pos.x,
          y: pos.y,
          width: 160,
          height: 160,
          rotation: 0,
          zIndex: 0,
          value: result.assets[0].uri,
        });
      }
      return;
    }
    setActiveTool(tool);
  };

  const closeSheet = () => setActiveTool(null);

  return (
    <View style={styles.container}>
      <View style={styles.canvas} onLayout={handleLayout}>
        <CanvasBackground
          backgroundKey={backgroundKey}
          width={canvasSize.width}
          height={canvasSize.height}
        />
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => selectElement(null)}
        />
        {elements
          .slice()
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((el) => (
            <CanvasElementView
              key={el.id}
              element={el}
              isSelected={selectedElementId === el.id}
              onSelect={() => selectElement(el.id)}
              onDelete={() => removeElement(el.id)}
              onBringToFront={() => bringToFront(el.id)}
              onUpdate={(patch) => updateElement(el.id, patch)}
            />
          ))}
      </View>

      <View style={styles.toolbar}>
        {TOOLS.map((tool) => (
          <TouchableOpacity
            key={tool.key}
            style={styles.toolButton}
            onPress={() => handleToolPress(tool.key)}
          >
            <Icon name={tool.icon} size={22} color={colors.plum} />
          </TouchableOpacity>
        ))}
      </View>

      <BottomSheet visible={activeTool === 'background'} onClose={closeSheet}>
        <BackgroundSheet
          selectedKey={backgroundKey}
          onSelect={(key) => {
            setBackground(key);
            closeSheet();
          }}
        />
      </BottomSheet>

      <BottomSheet visible={activeTool === 'asset'} onClose={closeSheet} heightRatio={0.6}>
        <AssetSheet
          onSelect={(stickerId) => {
            const pos = centerPosition(100);
            addElement({
              id: generateId(),
              type: 'sticker',
              x: pos.x,
              y: pos.y,
              width: 100,
              height: 100,
              rotation: 0,
              zIndex: 0,
              value: stickerId,
            });
            closeSheet();
          }}
        />
      </BottomSheet>

      <BottomSheet visible={activeTool === 'text'} onClose={closeSheet} heightRatio={0.4}>
        <TextSheet
          onSubmit={(text) => {
            const pos = centerPosition(150);
            addElement({
              id: generateId(),
              type: 'text',
              x: pos.x,
              y: pos.y,
              width: 200,
              height: 60,
              rotation: 0,
              zIndex: 0,
              value: text,
            });
            closeSheet();
          }}
        />
      </BottomSheet>

      <BottomSheet visible={activeTool === 'music'} onClose={closeSheet}>
        <MusicSheet
          selectedId={musicId}
          onSelect={(id) => {
            setMusic(id);
            closeSheet();
          }}
        />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  canvas: {
    flex: 1,
    overflow: 'hidden',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    backgroundColor: colors.paperDark,
  },
  toolButton: {
    padding: spacing.sm,
  },
});
