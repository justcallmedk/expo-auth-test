import React, { useEffect } from 'react';
import { Image, View } from 'react-native';
import { Button } from 'react-native-paper';

import styles from '../App.style.js';
import auth from '../components/auth/Auth.js';

import * as AppleAuthentication from 'expo-apple-authentication';
import * as SecureStore from 'expo-secure-store';

export default function AuthScreen(props) {

  useEffect(async () => {
    if(props.profile) {
      //nothing to do when profile exists already
      return;
    }

    let profile;
    if(await SecureStore.getItemAsync('AppAuth.Apple')) {
      profile = await auth.apple.getProfile();
    }
    else if(await SecureStore.getItemAsync('AppAuth.Google')) {
      profile = await auth.google.getProfile();
    }
    props.setProfile(profile);
  });


  const login = async(method) => {
    //handle button disabling
    //TODO implement this
    if(method === 'google') {
    }
    else if(method === 'apple') {
    }

    let profile = await auth[method].signInAsync();
    console.info(profile);
    console.info('setting profile');
    props.setProfile(profile);
  }

  return (
    <View style={styles.container}>
      <Button mode="text"
              onPress={() => login('google')}>
        <Image source={ require('../assets/images/btn_google_signin_light_normal_web.png') } />
      </Button>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={{ width: 200, height: 44 }}
        onPress={async () => login('apple')}
      />
    </View>
  );
}
