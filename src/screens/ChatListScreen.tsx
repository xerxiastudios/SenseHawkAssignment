import React from 'react';
import {
    FlatList, ListRenderItemInfo, SafeAreaView, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import { IMessage, IUser } from '../utils/types';

export default function ChatListScreen() {
  const route = useRoute();
  const navigation = useNavigation<any>();
  //   console.log('===================');
  const {userList, onMessageSend, updateUserWithNewMessage} = route.params as {
    userList: IUser[];
    onMessageSend: (userMessage: IMessage) => void;
    updateUserWithNewMessage: (receivedMessage: IMessage) => void;
  };

  const userListArr: IUser[] = Object.entries(userList).map(([id, data]) => ({
    ...data,
  }));

  //   console.log(userListArr);

  const onSelectItem = (item: ListRenderItemInfo<IUser>) => {
    const iUserItem = item.item;

    navigation.navigate('Chat', {
      userData: iUserItem,
      onMessageSend,
      updateUserWithNewMessage,
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {userListArr && userListArr.length ? (
        <FlatList
          data={userListArr}
          keyExtractor={item => item?.name ?? ''}
          renderItem={item => {
            return (
              <TouchableOpacity onPress={() => onSelectItem(item)}>
                <View style={styles.userItem}>
                  <Text style={styles.userName}>{`${
                    item?.item?.name ?? ''
                  }`}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      ) : null}
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
    color: 'black',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
});
