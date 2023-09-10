import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useRoute } from '@react-navigation/native';

import { IMessage, IUserList, UserData } from './HomeScreen';

export default function ChatListScreen() {
  const route = useRoute();

  console.log(route.params);

  const renderItem = ({item}: {item: UserData & {chatData: IMessage[]}}) => {
    const lastMessage =
      item.chatData.length > 0
        ? item.chatData[item.chatData.length - 1].text
        : '';
    return (
      <TouchableOpacity onPress={() => onSelectItem()}>
        <View style={styles.userItem}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.lastMessage}>{lastMessage}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const onSelectItem = () => {};

  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        data={[]}
        keyExtractor={item => item.name}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
});
