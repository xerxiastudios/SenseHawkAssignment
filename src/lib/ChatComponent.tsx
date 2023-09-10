import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { IMessage, IUserList } from '../screens/HomeScreen';

interface ChatComponentProps {
  userList: IUserList;
  onMessageSend: (userMessage: IMessage) => void;
  updateUserWithNewMessage: (receivedMessage: IMessage) => void;
}

const ChatComponent: React.FC<ChatComponentProps> = ({
  userList,
  onMessageSend,
  updateUserWithNewMessage,
}) => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: 'orange', justifyContent: 'center'}}>
      <View style={{alignSelf: 'center'}}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('ChatList', {userList});
          }}>
          <Text style={styles.buttonText}>Chat screen</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, {marginTop: 16}]}
          onPress={() => {
            navigation.navigate('Map');
          }}>
          <Text style={styles.buttonText}>Map screen</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatComponent;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6686fa',
    height: 50,
    width: 260,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 15,
  },
});
