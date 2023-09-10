import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';

import ChatComponent from '../lib/ChatComponent';

// Interfaces
export interface IUserList {
  [key: string]: UserData & {chatData: IMessage[]};
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
  const [userList, setUserList] = useState<IUserList>({
    user1: {
      name: 'User 1',
      location: {latitude: 40.7128, longitude: -74.006},
      chatData: [], // Chat messages for User 1
    },
    user2: {
      name: 'User 2',
      location: {latitude: 34.0522, longitude: -118.2437},
      chatData: [], // Chat messages for User 2
    },
    // Add more users as needed
  });

  // Handle sending a message
  const onMessageSend = (userMessage: IMessage) => {
    // Update chat data for the sender
    const updatedUserList = {...userList};

    // Update chat data for the sender
    updatedUserList[userMessage.sender].chatData.push(userMessage);

    setUserList(updatedUserList);
  };

  // Handle updating user with a new message (e.g., when a message is received)
  const updateUserWithNewMessage = (receivedMessage: IMessage) => {
    const updatedUserList = {...userList};

    // Update chat data for the recipient
    updatedUserList[receivedMessage.receiver].chatData.push(receivedMessage);

    setUserList(updatedUserList);
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
