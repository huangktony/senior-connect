import React, { useMemo } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';

export type Task = {
  id: string;
  title: string;
  description: string;
  address?: string;
  datetime?: string | number | Date; // ISO string, timestamp, or Date
  category?: string;
  status: 'open' | 'in_progress' | 'completed';
  assigneeId?: string;
};

type Props = {
  tasks: Task[];
  volunteerId?: string;
  onPressTask?: (task: Task) => void;
  onCompleteTask?: (task: Task) => void;
  emptyText?: string;
};

export default function InProgressTasks({
  tasks,
  volunteerId,
  onPressTask,
  onCompleteTask,
  emptyText = 'No tasks in progress yet',
}: Props) {
  const items = useMemo<Task[]>(() => {
    let list = tasks.filter(t => t.status === 'in_progress');
    if (volunteerId) list = list.filter(t => t.assigneeId === volunteerId);
    // newest first if datetime exists
    return list.sort((a, b) => {
      const da = asMillis(a.datetime);
      const db = asMillis(b.datetime);
      return db - da;
    });
  }, [tasks, volunteerId]);

  if (items.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.header}>In Progress</Text>
        <Text style={styles.empty}>{emptyText}</Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.header}>In Progress</Text>

      <FlatList<Task>
        data={items}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => onPressTask?.(item)}
            android_ripple={{ color: '#00000014', borderless: false }}
          >
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.desc} numberOfLines={2}>
              {item.description || 'No description provided.'}
            </Text>

            {(item.datetime || item.address) && (
              <View style={styles.metaRow}>
                {item.datetime && (
                  <Text style={styles.meta}>{formatDateTime(item.datetime)}</Text>
                )}
                {item.address && (
                  <Text style={styles.meta} numberOfLines={1}>{item.address}</Text>
                )}
              </View>
            )}

            {onCompleteTask && (
              <Pressable
                onPress={() => onCompleteTask(item)}
                style={styles.completeBtn}
              >
                <Text style={styles.completeText}>Mark complete</Text>
              </Pressable>
            )}
          </Pressable>
        )}
      />
    </View>
  );
}

/** Safely convert many date shapes to a millisecond number for sorting. */
function asMillis(input?: string | number | Date): number {
  if (input == null) return 0;
  if (input instanceof Date) return input.getTime();
  return new Date(input).getTime() || 0;
}

function formatDateTime(input?: string | number | Date) {
  const ms = asMillis(input);
  if (!ms) return '';
  return new Date(ms).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const styles = StyleSheet.create({
  section: { gap: 8, paddingBottom: 8, backgroundColor: '#2A0030' },
  header: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#74206E',
  },
  empty: { color: '#E9D9EE', paddingHorizontal: 16, paddingVertical: 16 },
  card: {
    borderRadius: 20,
    backgroundColor: 'white',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  title: { fontWeight: '800', fontSize: 18, textAlign: 'center', marginBottom: 8 },
  desc: { color: '#333', textAlign: 'center', marginBottom: 12 },
  metaRow: { gap: 4 },
  meta: { color: '#5A5560', textAlign: 'center' },
  completeBtn: {
    marginTop: 12,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FF8E4E',
  },
  completeText: { color: 'white', fontWeight: '700' },
});
