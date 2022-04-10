import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AppAuth from 'expo-app-auth';

const config = require('../../config.js');

const authConfig = {
  issuer: 'https://accounts.google.com',
  scopes: ['openid', 'profile'],
  /* This is the CLIENT_ID generated from a Firebase project */
  clientId: config.auth.google.clientId
};

const StorageKey = '@MyApp:CustomGoogleOAuthKey';

export async function g_signInAsync() {
  const authState = await AppAuth.authAsync(authConfig);
  await cacheAuthAsync(authState);
  const accessToken = authState.accessToken;
  return await g_getProfile(accessToken);

}

async function cacheAuthAsync(authState) {
  return await AsyncStorage.setItem(StorageKey, JSON.stringify(authState));
}

export async function getCachedAuthAsync() {
  const value = await AsyncStorage.getItem(StorageKey);
  const authState = JSON.parse(value);
  if (authState) {
    if (checkIfTokenExpired(authState)) {
      return await refreshAuthAsync(authState);
    } else {
      return authState;
    }
  }
  return null;
}

export async function g_getProfile(accessToken) {
  if(!accessToken) {
    let authState = await getCachedAuthAsync();
    accessToken = authState.accessToken;
  }
  const resp = await fetch('https://www.googleapis.com/userinfo/v2/me', {
    headers: { Authorization: 'Bearer ' + accessToken },
  });
  let profile = await resp.json();
  console.info(profile);
  profile.method = 'google';
  return profile;
}

function checkIfTokenExpired({ accessTokenExpirationDate }) {
  return new Date(accessTokenExpirationDate) < new Date();
}

async function refreshAuthAsync({ refreshToken }) {
  let authState = await AppAuth.refreshAsync(authConfig, refreshToken);
  await cacheAuthAsync(authState);
  return authState;
}

export async function g_signOutAsync() {
  const value = await AsyncStorage.getItem(StorageKey);
  if (!value) {
    return;
  }
  const accessToken = JSON.parse(value).accessToken;
  try {
    await AppAuth.revokeAsync(authConfig, {
      token: accessToken,
      isClientIdProvided: true,
    });
    await AsyncStorage.removeItem(StorageKey);
    return null;
  } catch (e) {
    alert(`Failed to revoke token: ${e.message}`);
  }
}
