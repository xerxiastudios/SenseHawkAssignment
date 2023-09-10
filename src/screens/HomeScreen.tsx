import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';

import ChatComponent from '../lib/ChatComponent';

// Interfaces

export interface IUser {
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  chatData: IMessage[];
}

export interface IMessage {
  id: number;
  text: string;
  sender: string;
  receiver: string;
  timestamp: string;
}

export interface UserData {
  name: string;
  location: UserLocation;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

export default function HomeScreen() {
  const [userList, setUserList] = useState<IUser[]>([
    {
      name: 'User 1',
      location: {latitude: 40.7128, longitude: -74.006},
      chatData: [],
    },
    {
      name: 'User 2',
      location: {latitude: 34.0522, longitude: -118.2437},
      chatData: [],
    },
    // Add more users as needed
  ]);

  // Handle sending a message
  const onMessageSend = (userMessage: IMessage) => {
    // Create a copy of the user list
    const updatedUserList = [...userList];
    console.log(userMessage);
  };

  // Handle updating user with a new message (e.g., when a message is received)
  const updateUserWithNewMessage = (receivedMessage: IMessage) => {
    // Create a copy of the user list
    const updatedUserList = [...userList];
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ChatComponent
        userList={userList}
        onMessageSend={onMessageSend}
        updateUserWithNewMessage={updateUserWithNewMessage}
      />
    </SafeAreaView>
  );
}
