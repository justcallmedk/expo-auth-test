import React from 'react';
import { View, Text } from 'react-native';
import styles from '../App.style.js';

export default function HomeScreen(props) {
  if(props.routes.map[props.routes.index].key !== 'home') {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.foreground}>Hello, {props.profile.id} </Text>
    </View>
  );
}
