import * as SecureStore from 'expo-secure-store';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Device from 'expo-device';

const STORE_KEY = 'AppAuth.Apple';
const REQUESTED_SCOPES = [
  AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
  AppleAuthentication.AppleAuthenticationScope.EMAIL,
];

export async function a_signInAsync() {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: REQUESTED_SCOPES,
    });
    await SecureStore.setItemAsync(STORE_KEY,JSON.stringify(credential));
    return await a_getProfile();
  } catch (e) {
    if (e.code === 'ERR_CANCELED') {
      // handle that the user canceled the sign-in flow
    } else {
      // handle other errors
    }
  }
}

//also checks if the session is still authed
export async function a_getProfile() {
  let result = JSON.parse(await SecureStore.getItemAsync(STORE_KEY));

  if(!result || !result.user) {
    return null;
  }

  let status;
  try {
    status = await getCredentialStateAsync(result.user);
  } catch (e) {
    //this does not work on simulator, so detect and set loggedIn accordingly.
    if(!Device.isDevice) {
      status = 1;
    }
    else {
      return null;
    }
  }
  console.info(result);
  return {
    name : result.fullName.givenName + result.fullName.familyName,
    id : result.email,
    status : status,
    method : 'apple'
  }
}

export async function getCredentialStateAsync(user) {
  return await AppleAuthentication.getCredentialStateAsync(user);
}

export async function a_signOutAsync() {
  let result = JSON.parse(await SecureStore.getItemAsync(STORE_KEY));
  if(!result || !result.user) {
    return;
  }
  /* this brings up the signin modal, so don't use it
  await AppleAuthentication.signOutAsync({
    user: result.user
  });
  */
  await SecureStore.deleteItemAsync(STORE_KEY);
}
