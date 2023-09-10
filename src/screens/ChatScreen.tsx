import React, { useEffect, useState } from 'react';
import {
    ListRenderItemInfo, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import { IMessage, IUser } from '../utils/types';

export default function ChatScreen() {
  const [text, setText] = useState('');
  const [isMe, setIsMe] = useState(true);

  const route = useRoute();
  const navigation = useNavigation<any>();
  const {userData, onMessageSend, updateUserWithNewMessage} = route.params as {
    userData: IUser;
    onMessageSend: (userMessage: IMessage) => void;
    updateUserWithNewMessage: (receivedMessage: IMessage) => void;
  };

  useEffect(() => {
    navigation.setOptions({
      title: `Chat (${userData?.name ?? ''})`,
    });
  }, []);

  console.log('--------------------------------');
  console.log(route.params);

  const onSendPress = () => {
    if (text.trim() === '') return;

    const newMessage: IMessage = {
      id: userData?.chatData?.length + 1,
      text,
      sender: isMe ? 'me' : userData?.name,
      receiver: !isMe ? 'me' : userData?.name,
      timestamp: new Date().toISOString(),
      chatName: userData?.name,
    };

    onMessageSend(newMessage);
    setText('');
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 8,
          backgroundColor: '#bdc8f2',
        }}>
        <TouchableOpacity onPress={() => setIsMe(true)}>
          <Text style={{color: 'green', padding: 8}}>{'Select as Me'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsMe(false)}>
          <Text
            style={{
              color: 'red',
              padding: 8,
            }}>{`Select as ${userData?.name}`}</Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={{paddingVertical: 16}}
          style={{flex: 1}}>
          {userData?.chatData?.map(message => (
            <View
              key={message.id}
              style={{
                alignSelf: message.sender === 'me' ? 'flex-end' : 'flex-start',
                backgroundColor:
                  message.sender === 'me' ? '#007BFF' : '#E5E5EA',
                borderRadius: 8,
                padding: 8,
                margin: 4,
                maxWidth: '70%',
              }}>
              <Text
                style={{
                  color: message.sender === 'me' ? 'white' : 'black',
                }}>
                {message.text}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', padding: 8}}>
        <TextInput
          style={{
            flex: 1,
            marginRight: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 8,
            color: 'black',
          }}
          placeholder="Type your message..."
          placeholderTextColor="grey"
          value={text}
          onChangeText={newText => setText(newText)}
        />
        <TouchableOpacity
          onPress={onSendPress}
          style={{backgroundColor: '#007BFF', borderRadius: 8, padding: 8}}>
          <Text style={{color: 'white'}}>{`Send ${
            isMe ? '(Me)' : `(${userData?.name})`
          }`}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
