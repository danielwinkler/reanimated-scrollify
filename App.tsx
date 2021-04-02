/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {Image, ListRenderItemInfo, Text, View} from 'react-native';

import Animated from 'react-native-reanimated';
import {FlatList} from 'react-native-gesture-handler';
import {artists, songs} from './data';
import {zip, shuffle} from 'lodash';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEllipsisV} from '@fortawesome/free-solid-svg-icons';

const AnimatedList = Animated.createAnimatedComponent(FlatList);

type PlaylistItem = {
  artist: string;
  song: string;
  img: string;
};

const data = zip(shuffle(artists), shuffle(songs))
  .filter(([l, r]) => !!l && !!r)
  .map(([artist, song]) => ({artist, song, img: 'https://picsum.photos/200'} as PlaylistItem));

const RowItem = ({item}: ListRenderItemInfo<PlaylistItem>) => (
  <View style={{flexDirection: 'row', alignItems: 'center', padding: 8}}>
    <Image source={{uri: item.img}} style={{height: 64, width: 64}} />
    <View style={{width: 8}} />
    <View style={{flex: 1}}>
      <Text style={{fontWeight: 'bold'}}>{item.artist}</Text>
      <View style={{height: 8}} />
      <Text>{item.song}</Text>
    </View>
    <View>
      <FontAwesomeIcon icon={faEllipsisV} />
    </View>
  </View>
);

const Header = () => null;

const App = () => {
  return (
    <>
      <Header />
      <AnimatedList data={data} keyExtractor={(_, index) => index.toString()} renderItem={RowItem} />
    </>
  );
};

export default App;
