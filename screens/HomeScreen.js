import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import styles from '../App.style.js';

import * as Linking from 'expo-linking';

export default function HomeScreen(props) {
  if(props.routes.map[props.routes.index].key !== 'home') {
    return null;
  }
  useEffect(() => {
    console.info('home screen');
    Linking.getInitialURL().then(url => {
      if (url) {
        console.info('reading url');
        console.info(url)
      }
    })
    .catch(err => {
        console.error(err);
    });
    Linking.addEventListener('url',handleOpenURL);
  });
  const handleOpenURL = (event) => {
    console.info('url event');
    console.info(event);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.foreground}>Hello</Text>
      <Text> {props.profile.id} </Text>
    </View>
  );
}
