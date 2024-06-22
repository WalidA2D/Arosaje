import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#668F80',
        headerShown: false,
        tabBarStyle: { backgroundColor: '#FFF' },
      }}>
      <Tabs.Screen
        name="actu"
        options={{
          title: 'Actualités',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Message',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'chatbox-ellipses' : 'chatbox-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="publier"
        options={{
          title: 'Publier',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'add-circle' : 'add-circle-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'body' : 'body-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="options"
        options={{
          title: 'Options',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'cog' : 'cog-outline'} color={color} />
          ),
        }}
      />
        <Tabs.Screen
        name="Login/connexion"
        options={{
          title: 'Connexion',
          tabBarButton: () => null,
        }}
      />
        <Tabs.Screen
        name="Login/inscription"
        options={{
          title: 'inscription',
          tabBarButton: () => null,
        }}
      />
        <Tabs.Screen
        name="index"
        options={{
          title: 'startscreen',
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' }
        }}
      />
              <Tabs.Screen
        name="actunav/actufiltre"
        options={{
          title: 'filtre',
          tabBarButton: () => null,
        }}
      />
    </Tabs>

    
  );
}


