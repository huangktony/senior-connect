// App.js — Expo-ready React Native demo matching the provided UI
// Run with: npx create-expo-app opal-ui && cd opal-ui && replace App.js with this file
// Install deps: npx expo install @react-navigation/native @react-navigation/native-stack react-native-safe-area-context react-native-screens
// (Expo includes vector icons via @expo/vector-icons)

import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  ScrollView,
  ViewStyle,
} from 'react-native';
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const COLORS = {
  purple: '#5A1A73',
  purpleDark: '#3e124f',
  purpleLight: '#7B2EA8',
  orange: '#FF7A00',
  bg: '#F3F3F3',
  card: '#FFFFFF',
  text: '#1F1F1F',
  sub: '#6B6B6B',
  chip: '#FFE7D1',
};

type RootStackParamList = {
  Home: undefined;
  Task: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

interface PopularItem {
  id: string;
  name: string;
  icon: keyof typeof Icon.glyphMap;
}

const POPULAR: PopularItem[] = [
  { id: '1', name: 'Groceries', icon: 'cart-outline' },
  { id: '2', name: 'Electrical', icon: 'flash-outline' },
  { id: '3', name: 'Gardening', icon: 'flower' },
  { id: '4', name: 'Cleaning', icon: 'broom' },
];

const TASK = {
  id: 't1',
  title: 'Pick up groceries',
  description:
    'Please pick up milk and eggs from the grocery store\n\nleave groceries on front porch',
  date: 'November 12, 2025',
  time: '4PM–7PM',
  location: '1202 Random Street',
  customer: 'James John',
};

interface PillProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function Pill({ children, style }: PillProps) {
  return (
    <View style={[styles.pill, style]}> 
      <Text style={styles.pillText}>{children}</Text>
    </View>
  );
}

interface HeaderBarProps {
  title?: string;
}

function HeaderBar({ title }: HeaderBarProps) {
  return (
    <View style={styles.header}> 
      <Text style={styles.brand}>opal</Text>
      <View style={styles.avatar} />
    </View>
  );
}

interface CategoryDotProps {
  item: PopularItem;
}

function CategoryDot({ item }: CategoryDotProps) {
  return (
    <View style={styles.catItem}>
      <View style={styles.catDot}>
        <Icon name={item.icon} size={28} color={'#fff'} />
      </View>
      <Text style={styles.catLabel}>{item.name}</Text>
    </View>
  );
}

interface TaskCardProps {
  onPress?: () => void;
}

function TaskCard({ onPress }: TaskCardProps) {
  return (
    <Pressable style={styles.taskCard} onPress={onPress}>
      <Text style={styles.taskTitle}>{TASK.title}</Text>
      <Text style={styles.taskDesc} numberOfLines={2}>
        Please pick up milk and eggs from the grocery...
      </Text>
      <View style={styles.metaRow}> 
        <Icon name="calendar-blank" size={18} color={COLORS.sub} />
        <Text style={styles.metaText}>{TASK.date}</Text>
      </View>
      <View style={styles.metaRow}> 
        <Icon name="clock-outline" size={18} color={COLORS.sub} />
        <Text style={styles.metaText}>{TASK.time}</Text>
      </View>
      <View style={styles.metaRow}> 
        <Icon name="map-marker" size={18} color={COLORS.sub} />
        <Text style={styles.metaText}>{TASK.location}</Text>
      </View>
    </Pressable>
  );
}

type HomeScreenNavigationProp = NavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar style="light" />
      <View style={{ backgroundColor: COLORS.purple, paddingBottom: 8 }}>
        <HeaderBar />
        <View style={styles.searchBox}> 
          <Icon name="magnify" size={20} color={COLORS.sub} />
          <TextInput placeholder="search for tasks..." placeholderTextColor={COLORS.sub} style={{ flex: 1, marginLeft: 8 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Popular Categories */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <Text style={styles.sectionTitle}>Popular Task Categories</Text>
          <FlatList
            data={POPULAR}
            keyExtractor={(i) => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 12 }}
            renderItem={({ item }) => <CategoryDot item={item} />}
          />
        </View>

        {/* In Progress */}
        <View style={{ marginTop: 8 }}>
          <View style={styles.sectionHeader}> 
            <Text style={styles.sectionTitle}>In Progress</Text>
          </View>
          <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
            <TaskCard onPress={() => navigation.navigate('Task')} />
          </View>
        </View>
      </ScrollView>

      {/* Simple bottom nav mock (static) */}
      <View style={styles.bottomBar}>
        <BarItem label="home" selected={true} />
        <BarItem label="map" selected={false} />
        <BarItem label="calendar" selected={false} />
      </View>
    </SafeAreaView>
  );
}

interface BarItemProps {
  label: string;
  selected: boolean;
}

function BarItem({ label, selected }: BarItemProps) {
  return (
    <View style={styles.barItem}>
      <View style={[styles.navDot, selected && { backgroundColor: COLORS.orange }]} />
      <Text style={[styles.barText, selected && { color: '#fff' }]}>{label}</Text>
    </View>
  );
}

interface InfoRowProps {
  icon: keyof typeof Icon.glyphMap;
  text: string;
}

function InfoRow({ icon, text }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Icon name={icon} size={20} color={COLORS.text} />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

type TaskScreenNavigationProp = NavigationProp<RootStackParamList, 'Task'>;

interface TaskScreenProps {
  navigation: TaskScreenNavigationProp;
}

function TaskScreen({ navigation }: TaskScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar style="light" />
      <View style={[styles.topBar, { backgroundColor: COLORS.purple }]}>
        <Text style={styles.brand}>opal</Text>
        <View style={styles.avatar} />
      </View>

      <View style={styles.taskHeader}> 
        <Text style={styles.taskHeaderTitle}>Pick up groceries</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.detailCard}>
          <Text style={styles.detailText}>{TASK.description}</Text>
        </View>

        <InfoRow icon="calendar-blank" text={TASK.date} />
        <InfoRow icon="clock-outline" text={TASK.time} />
        <InfoRow icon="map-marker" text={TASK.location} />
        <InfoRow icon="account-outline" text={TASK.customer} />

        <View style={styles.actionRow}>
          <Pressable style={[styles.chipBtn, { backgroundColor: COLORS.purple }]}
            onPress={() => navigation.goBack()}>
            <Text style={[styles.chipBtnText, { color: '#fff' }]}>Back</Text>
          </Pressable>
          <Pressable style={[styles.chipBtn, { backgroundColor: COLORS.orange }]}>
            <Text style={[styles.chipBtnText, { color: '#fff' }]}>Accept Task</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Task" component={TaskScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: COLORS.purple,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    textTransform: 'lowercase',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EAEAEA',
  },
  searchBox: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeader: {
    backgroundColor: COLORS.purple,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  catItem: {
    marginRight: 16,
    alignItems: 'center',
  },
  catDot: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catLabel: {
    fontSize: 12,
    color: COLORS.sub,
    marginTop: 6,
  },
  taskCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  taskTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  taskDesc: { fontSize: 13, color: COLORS.sub, marginTop: 4, marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  metaText: { marginLeft: 8, fontSize: 13, color: COLORS.sub },
  bottomBar: {
    height: 64,
    backgroundColor: COLORS.purpleDark,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  barItem: { alignItems: 'center' },
  navDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#7D5FA6', marginBottom: 6 },
  barText: { color: '#CDB9DE', textTransform: 'lowercase' },

  taskHeader: {
    backgroundColor: COLORS.purple,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ffffff33',
  },
  taskHeaderTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  detailCard: {
    backgroundColor: '#EAE6ED',
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
  },
  detailText: { color: COLORS.text, fontSize: 14, lineHeight: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoText: { marginLeft: 10, fontSize: 15, color: COLORS.text },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  chipBtn: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 24 },
  chipBtnText: { fontWeight: '700' },
  pill: { backgroundColor: COLORS.chip, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16 },
  pillText: { color: COLORS.orange, fontWeight: '700' },
});