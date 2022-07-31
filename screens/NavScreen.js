import React, { useState, useEffect } from 'react';
import { BottomNavigation, Text } from 'react-native-paper';

import HomeScreen from './HomeScreen';
import AccountScreen from './AccountScreen';
import GameScreen from './GameScreen';

export default function NavScreen(props) {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'home', title: 'Home', icon: 'home' },
    { key: 'game', title: 'Game', icon: 'account' },
    { key: 'account', title: 'Account', icon: 'account' }
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: () => <HomeScreen profile={props.profile} routes={{map:routes,index:index}} />,
    game: () => <GameScreen profile={props.profile} routes={{map:routes,index:index}} />,
    account: () => <AccountScreen profile={props.profile}
                                  setProfile={props.setProfile}
                                  routes={{map:routes,index:index}} />,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
