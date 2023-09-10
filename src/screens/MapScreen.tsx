import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator, Dimensions, Image, SafeAreaView, StyleSheet, Text, View
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import Geolocation from '@react-native-community/geolocation';
import Slider from '@react-native-community/slider';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapboxGL, { Logger } from '@rnmapbox/maps';

import { ILocation, IMessage, IUser } from '../utils/types';

Logger.setLogCallback(log => {
  const {message} = log;

  if (
    message.match('Request failed due to a permanent error: Canceled') ||
    message.match('Request failed due to a permanent error: Socket Closed')
  ) {
    return true;
  }
  return false;
});

export default function MapScreen() {
  const [isAndroidPermissionGranted, setIsAndroidPermissionGranted] =
    useState(false);
  const [isFetchingAndroidPermissions, setIsFetchingAndroidPermissions] =
    useState(true);

  const [location, setLocation] = useState<ILocation | undefined>(undefined);
  const [mapboxToken, setMapBoxToken] = useState('');
  const [maxRadius, setMaxRadius] = useState(1);
  const [filteredUserList, setFilteredUserList] = useState<IUser[]>();
  const navigation = useNavigation<any>();
  const route = useRoute();

  const {userList, onMessageSend, updateUserWithNewMessage} = route.params as {
    userList: IUser[];
    onMessageSend: (userMessage: IMessage) => void;
    updateUserWithNewMessage: (receivedMessage: IMessage) => void;
  };

  function calculateDistance(coord1: ILocation, coord2: ILocation): number {
    const radlat1 = (Math.PI * coord1.latitude) / 180;
    const radlat2 = (Math.PI * coord2.latitude) / 180;
    const theta = coord1.longitude - coord2.longitude;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515 * 1.609344; // Convert to kilometers
    return dist;
  }

  function filterUsersByDistance(
    userList: IUser[],
    referenceLocation: ILocation,
    maxDistance: number,
    minDistance: number,
  ): IUser[] {
    const filteredUsers = userList.filter(user => {
      const distance = calculateDistance(user.location, referenceLocation);
      return distance >= minDistance && distance <= maxDistance;
    });

    return filteredUsers;
  }

  useEffect(() => {
    getAndroidPersimission();
    Geolocation.getCurrentPosition(info => {
      const {latitude, longitude} = info.coords;
      setLocation({
        latitude,
        longitude,
      });
    });
    setFilteredUserList(userList);
  }, []);

  const getAndroidPersimission = async () => {
    const isGranted = await MapboxGL.requestAndroidLocationPermissions();

    setIsAndroidPermissionGranted(isGranted);
    setIsFetchingAndroidPermissions(false);
  };

  useEffect(() => {
    MapboxGL.getAccessToken().then(res => {
      console.log(res);
      setMapBoxToken(res);
    });
  }, []);

  if (!isAndroidPermissionGranted) {
    if (isFetchingAndroidPermissions) {
      return (
        <SafeAreaView>
          <ActivityIndicator />
        </SafeAreaView>
      );
    } else {
      <SafeAreaView>
        <View style={{flex: 1}}>
          <Text style={styles.noPermissionsText}>
            Please give location permission.
          </Text>
        </View>
      </SafeAreaView>;
    }
  }

  const onMarkerPress = (userData: IUser) => {
    navigation.navigate('Chat', {
      userData,
      onMessageSend,
      updateUserWithNewMessage,
    });
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {mapboxToken != '' ? (
          <MapboxGL.MapView
            style={styles.map}
            zoomEnabled={true}
            styleURL="mapbox://styles/mapbox/streets-v12"
            rotateEnabled={true}>
            <MapboxGL.Camera
              zoomLevel={15}
              centerCoordinate={
                location
                  ? [location.longitude, location.latitude]
                  : [10.181667, 36.806389]
              }
              pitch={40}
              animationMode={'flyTo'}
              animationDuration={2000}
            />
            <MapboxGL.PointAnnotation
              id="marker"
              onSelected={() => {
                console.log('fasd');
              }}
              coordinate={
                location
                  ? [location.longitude, location.latitude]
                  : [10.181667, 36.806389]
              }>
              <View style={{width: 30, height: 30}}>
                <Icon name="enviroment" size={30} color="#82BD61" />
              </View>
            </MapboxGL.PointAnnotation>

            {filteredUserList &&
              filteredUserList.length &&
              filteredUserList.map((item, index) => {
                return (
                  <MapboxGL.PointAnnotation
                    id={`annotation_${item.location.longitude}_${index}`}
                    key={`${item.location.longitude}`}
                    onSelected={() => {
                      onMarkerPress(item);
                    }}
                    coordinate={[
                      item.location.longitude,
                      item.location.latitude,
                    ]}>
                    <View>
                      <Icon name="enviroment" size={30} color="#fa2525" />
                    </View>
                  </MapboxGL.PointAnnotation>
                );
              })}
          </MapboxGL.MapView>
        ) : null}
      </View>
      <View
        style={{
          height: 120,
          backgroundColor: '#92aff7',
        }}>
        {location ? (
          <Slider
            style={{
              width: Dimensions.get('window').width - 40,
              alignSelf: 'center',
              marginTop: 20,
            }}
            minimumValue={0.55}
            maximumValue={1}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            value={maxRadius}
            onValueChange={value => {
              setMaxRadius(value);
              const filteredUsers = filterUsersByDistance(
                userList,
                location,
                value,
                0.5,
              );
              setFilteredUserList(filteredUsers);
            }}
          />
        ) : null}

        <Text style={{color: 'black', alignSelf: 'center', fontSize: 10}}>
          {'Min value: 0.5 km - Max value: 1.0 km'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height - 120,
    width: Dimensions.get('window').width,
  },
  map: {
    flex: 1,
  },
  noPermissionsText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  markerContainer: {
    widht: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    borderRadius: 20,
  },
});
