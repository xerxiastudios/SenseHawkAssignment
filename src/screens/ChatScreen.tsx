import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
  id: number;
  text: string;
  sender: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      text,
      sender: 'bot', // You can differentiate between users and the bot or other users
    };

    setMessages([...messages, newMessage]);
    setText('');
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={{paddingVertical: 16}}
          style={{flex: 1}}>
          {messages.map(message => (
            <View
              key={message.id}
              style={{
                alignSelf:
                  message.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor:
                  message.sender === 'user' ? '#007BFF' : '#E5E5EA',
                borderRadius: 8,
                padding: 8,
                margin: 4,
                maxWidth: '70%',
              }}>
              <Text
                style={{
                  color: message.sender === 'user' ? 'white' : 'black',
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
          onPress={handleSend}
          style={{backgroundColor: '#007BFF', borderRadius: 8, padding: 8}}>
          <Text style={{color: 'white'}}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
