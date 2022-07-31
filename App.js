import React, { useState } from 'react';
import AuthScreen from './screens/AuthScreen';
import NavScreen from './screens/NavScreen';

export default function App() {
  const [profile, setProfile] = useState(null); // detect logging out event
  return (
    <>
      { !profile ?
        <AuthScreen profile={profile} setProfile={setProfile}/> :
        <>
          <NavScreen profile={profile} setProfile={setProfile} />
        </>
      }
    </>
  );
}
