import { Tabs } from 'expo-router';
import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { HapticTab } from '@/components/haptic-tab';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: '#5631E8',
        tabBarInactiveTintColor: '#0E0940',
        tabBarStyle: { backgroundColor: '#EDF6FF', borderTopWidth: 0 },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Pok\u00e9mon',
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="catching-pokemon" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favourites',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="favorite" color={color} />,
        }}
      />
    </Tabs>
  );
}
