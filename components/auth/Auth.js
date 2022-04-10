import {a_getProfile, a_signInAsync, a_signOutAsync} from "./Apple";
import {g_getProfile, g_signInAsync, g_signOutAsync} from "./Google";

export default {
  apple : {
    signInAsync: a_signInAsync,
    signOutAsync: a_signOutAsync,
    getProfile : a_getProfile
  },
  google : {
    signInAsync : g_signInAsync,
    signOutAsync: g_signOutAsync,
    getProfile : g_getProfile
  }
};
