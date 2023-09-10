import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';

import Geolocation from '@react-native-community/geolocation';

import ChatComponent from '../lib/ChatComponent';
import { IMessage, IUser } from '../utils/types';

export default function HomeScreen() {
  const [userList, setUserList] = useState<IUser[]>([]);

  // create random users
  useEffect(() => {
    Geolocation.getCurrentPosition(info => {
      const {latitude, longitude} = info.coords;

      const users = insertRandomUsers(latitude, longitude, 1, 20);
      setUserList(users);
    });
  }, []);

  const onMessageSend = (userMessage: IMessage) => {
    const updatedUserList = [...userList];
    const chatToUpdate = updatedUserList.find(element => {
      return element.name === userMessage.chatName;
    });

    chatToUpdate?.chatData?.push(userMessage);
  };

  const updateUserWithNewMessage = (receivedMessage: IMessage) => {
    const updatedUserList = [...userList];
    const chatToUpdate = updatedUserList.find(element => {
      return element.name === receivedMessage.chatName;
    });

    chatToUpdate?.chatData?.push(receivedMessage);
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

export const insertRandomUsers = (
  centerLat: number,
  centerLng: number,
  radiusInKm: number,
  numberOfLocations: number,
): IUser[] => {
  const users: IUser[] = [];

  for (let i = 0; i < numberOfLocations; i++) {
    // Generate a random radius within the specified range
    const radiusInKmRan = Math.random() * (radiusInKm - 0.3) + 0.3;

    // Generate a random angle to distribute locations evenly around the circle
    const randomAngle = Math.random() * 2 * Math.PI;

    // Calculate the new latitude and longitude
    const latitude =
      centerLat +
      (radiusInKmRan / 6371) * (180 / Math.PI) * Math.sin(randomAngle);
    const longitude =
      centerLng +
      (radiusInKmRan / 6371) *
        (180 / Math.PI) *
        Math.cos(centerLat * (Math.PI / 180)) *
        Math.cos(randomAngle);

    // Create a user object and push it to the users array
    const user: IUser = {
      name: `User ${i + 1}`,
      location: {latitude, longitude},
      chatData: [],
    };

    users.push(user);
  }

  return users;
};
