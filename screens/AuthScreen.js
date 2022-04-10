import React, { useState, useEffect } from 'react';
import { Image, View } from 'react-native';
import { Button } from 'react-native-paper';

import styles from '../App.style.js';
import auth from '../components/auth/Auth.js';

const buttonImgActive = require('../assets/images/btn_google_signin_light_normal_web.png');
const buttonImgDisabled = require('../assets/images/btn_google_signin_light_disabled_web.png');

import * as AppleAuthentication from 'expo-apple-authentication';
import * as SecureStore from 'expo-secure-store';

export default function AuthScreen(props) {
  const [buttonImg, setButtonImg] = useState(buttonImgActive);

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
    if(method === 'google') {
      setButtonImg(buttonImgDisabled);
    }
    else if(method === 'apple') { //TODO: implement this

    }

    let profile = await auth[method].signInAsync();
    console.info(profile);
    props.setProfile(profile);
  }

  return (
    <View style={styles.container}>
      <Button mode="text"
              onPress={() => login('google')}>
        <Image source={ buttonImg } />
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
