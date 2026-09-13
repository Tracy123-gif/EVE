import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Button } from '../../Button';
import { colors, fonts, radii, spacing } from '../../../theme/theme';

type Props = {
  onSubmit: (text: string) => void;
};

export function TextSheet({ onSubmit }: Props) {
  const [text, setText] = useState('');

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="write something..."
        placeholderTextColor={colors.plum + '80'}
        multiline
        autoFocus
      />
      <Button
        label="add to canvas"
        onPress={() => {
          if (text.trim()) {
            onSubmit(text.trim());
            setText('');
          }
        }}
        style={{ marginTop: spacing.md }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.md,
    minHeight: 100,
    fontFamily: fonts.whimsical,
    fontSize: 22,
    color: colors.plum,
    textAlignVertical: 'top',
  },
});
