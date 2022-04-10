import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import styles from '../App.style.js';

import * as auth from '../components/auth/Auth.js';

export default function AccountScreen(props) {
  if(props.routes.map[props.routes.index].key !== 'account') {
    return null;
  }

  const logout = async () => {
    await auth[props.profile.method].signOutAsync();
    props.setProfile(null);
  };

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={() => logout()}>Logout</Button>
    </View>
  );
}
