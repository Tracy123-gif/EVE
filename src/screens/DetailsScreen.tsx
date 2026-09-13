import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { colors, fonts, spacing } from '../theme/theme';
import { useEditorStore } from '../store/editorStore';

function formatDate(iso: string | null): string {
  if (!iso) return 'pick a date';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function DetailsScreen() {
  const date = useEditorStore((s) => s.date);
  const note = useEditorStore((s) => s.note);
  const checklist = useEditorStore((s) => s.checklist);
  const setDate = useEditorStore((s) => s.setDate);
  const setNote = useEditorStore((s) => s.setNote);
  const addChecklistItem = useEditorStore((s) => s.addChecklistItem);
  const toggleChecklistItem = useEditorStore((s) => s.toggleChecklistItem);
  const removeChecklistItem = useEditorStore((s) => s.removeChecklistItem);

  const [showPicker, setShowPicker] = useState(false);
  const [newItem, setNewItem] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>date</Text>
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <Card>
            <Text style={styles.dateText}>{formatDate(date)}</Text>
          </Card>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={date ? new Date(date) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={(_, selected) => {
              setShowPicker(Platform.OS === 'ios');
              if (selected) setDate(selected.toISOString().slice(0, 10));
            }}
          />
        )}

        <Text style={styles.label}>what's the plan</Text>
        <Card>
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="write the plan..."
            placeholderTextColor={colors.plum + '80'}
            multiline
          />
        </Card>

        <Text style={styles.label}>to prep</Text>
        <Card>
          {checklist.map((item) => (
            <View key={item.id} style={styles.checklistRow}>
              <TouchableOpacity onPress={() => toggleChecklistItem(item.id)}>
                <Icon
                  name={item.done ? 'checkbox-checked' : 'checkbox-unchecked'}
                  size={20}
                  color={colors.plum}
                />
              </TouchableOpacity>
              <Text
                style={[styles.checklistLabel, item.done && styles.checklistDone]}
              >
                {item.label}
              </Text>
              <TouchableOpacity onPress={() => removeChecklistItem(item.id)}>
                <Icon name="close" size={14} color={colors.plum} />
              </TouchableOpacity>
            </View>
          ))}
          <View style={styles.addRow}>
            <TextInput
              style={styles.addInput}
              value={newItem}
              onChangeText={setNewItem}
              placeholder="add an item..."
              placeholderTextColor={colors.plum + '80'}
              onSubmitEditing={() => {
                if (newItem.trim()) {
                  addChecklistItem(newItem.trim());
                  setNewItem('');
                }
              }}
              returnKeyType="done"
            />
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  scroll: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  label: {
    fontFamily: fonts.importantSemiBold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.plum,
    opacity: 0.6,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  dateText: {
    fontFamily: fonts.important,
    fontSize: 16,
    color: colors.plum,
  },
  noteInput: {
    fontFamily: fonts.important,
    fontSize: 15,
    color: colors.plum,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  checklistLabel: {
    flex: 1,
    fontFamily: fonts.important,
    fontSize: 14,
    color: colors.plum,
  },
  checklistDone: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  addRow: {
    marginTop: spacing.xs,
  },
  addInput: {
    fontFamily: fonts.important,
    fontSize: 14,
    color: colors.plum,
    paddingVertical: spacing.xs,
  },
});
