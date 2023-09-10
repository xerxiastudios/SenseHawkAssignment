import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import MapboxGL, { Logger } from '@rnmapbox/maps';

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

interface ILocation {
  latitude: number;
  longitude: number;
}

export default function MapScreen() {
  const [isAndroidPermissionGranted, setIsAndroidPermissionGranted] =
    useState(false);
  const [isFetchingAndroidPermissions, setIsFetchingAndroidPermissions] =
    useState(true);
  const [showPitch, setShowPitch] = useState(false);

  const [location, setLocation] = useState<ILocation | undefined>(undefined);
  const [userLocations, setUserLocations] = useState<ILocation[]>([]);
  const [mapboxToken, setMapBoxToken] = useState('');

  const navigation = useNavigation<any>();

  useEffect(() => {
    getAndroidPersimission();
    Geolocation.getCurrentPosition(info => {
      const {latitude, longitude} = info.coords;
      setLocation({
        latitude,
        longitude,
      });

      const locationsWithinRadius = insertRandomUsers(
        latitude,
        longitude,
        1,
        10,
      );
      setUserLocations(locationsWithinRadius);
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

  const onMarkerPress = (position: ILocation) => {
    navigation.navigate('Chat', {position});
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
                style={{tintColor: 'green'}}
                source={require('./radio-button.png')}
              /> */}
              <View />
            </MapboxGL.PointAnnotation>

            {userLocations.map((item, index) => {
              return (
                <MapboxGL.PointAnnotation
                  id={`annotation_${item.longitude}_${index}`}
                  key={`${item.longitude}`}
                  onSelected={() => {
                    onMarkerPress(item);
                  }}
                  coordinate={[item.longitude, item.latitude]}>
                  <View />
                </MapboxGL.PointAnnotation>
              );
            })}
          </MapboxGL.MapView>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const insertRandomUsers = (
  centerLat: number,
  centerLng: number,
  radiusInKm: number,
  numberOfLocations: number,
): ILocation[] => {
  const locations: ILocation[] = [];

  for (let i = 0; i < numberOfLocations; i++) {
    // Generate a random radius within the specified range
    const radiusInKmRan = Math.random() * (radiusInKm - 0.5) + 0.5;

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

    locations.push({latitude, longitude});
  }

  return locations;
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
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
