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
  const [showPitch, setShowPitch] = useState(false);

  const [location, setLocation] = useState<ILocation | undefined>(undefined);
  const [mapboxToken, setMapBoxToken] = useState('');

  const navigation = useNavigation<any>();
  const route = useRoute();

  const {userList, onMessageSend, updateUserWithNewMessage} = route.params as {
    userList: IUser[];
    onMessageSend: (userMessage: IMessage) => void;
    updateUserWithNewMessage: (receivedMessage: IMessage) => void;
  };

  useEffect(() => {
    getAndroidPersimission();
    Geolocation.getCurrentPosition(info => {
      const {latitude, longitude} = info.coords;
      setLocation({
        latitude,
        longitude,
      });
    });
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
              pitch={showPitch ? 60 : 0}
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
              {/* <Image
                style={{tintColor: 'green', width: 20, height: 20}}
                source={require('./../../radio-button.png')}
              /> */}
              <View style={{width: 30, height: 30}}>
                <Icon name="enviroment" size={30} color="#82BD61" />
              </View>
            </MapboxGL.PointAnnotation>

            {userList.map((item, index) => {
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
                  {/* <View /> */}

                  <View>
                    <Icon name="enviroment" size={30} color="#fa2525" />
                    {/* <Text>{`${item.name}`}</Text> */}
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
        <Slider
          style={{
            width: Dimensions.get('window').width - 40,
            alignSelf: 'center',
            marginTop: 20,
          }}
          minimumValue={0.5}
          maximumValue={1}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
        />
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
