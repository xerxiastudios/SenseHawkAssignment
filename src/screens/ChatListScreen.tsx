import React from 'react';
import {
    FlatList, ListRenderItemInfo, SafeAreaView, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import { IMessage, IUserList, UserData } from './HomeScreen';

export default function ChatListScreen() {
  const route = useRoute();
  const navigation = useNavigation<any>();
  console.log('===================');
  const {userList} = route.params as {
    userList: IUserList[];
  };

  const userListArr: IUserList[] = Object.entries(userList).map(
    ([id, data]) => ({
      ...data,
    }),
  );

  console.log(userListArr);

  const onSelectItem = (item: ListRenderItemInfo<IUserList>) => {
    navigation.navigate('Chat', {userData: item});
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {userListArr && userListArr.length ? (
        <FlatList
          data={userListArr}
          keyExtractor={item => item?.item?.name ?? ''}
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
