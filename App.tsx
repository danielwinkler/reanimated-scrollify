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
import {Image, ListRenderItemInfo, StyleSheet, Text, View} from 'react-native';

import Animated from 'react-native-reanimated';
import {FlatList} from 'react-native-gesture-handler';
import {artists, songs} from './data';
import {zip, shuffle} from 'lodash';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleLeft, faArrowDown, faEllipsisV, faRedoAlt} from '@fortawesome/free-solid-svg-icons';
import {faHeart} from '@fortawesome/free-regular-svg-icons';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

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
      <Text style={fonts.bold}>{item.artist}</Text>
      <View style={{height: 8}} />
      <Text style={fonts.default}>{item.song}</Text>
    </View>
    <View>
      <FontAwesomeIcon style={fonts.bold} icon={faEllipsisV} />
    </View>
  </View>
);

const Header = () => (
  <LinearGradient colors={['#aaaaaa', '#333333']} style={{position: 'absolute', top: 0, left: 0, right: 0}}>
    <SafeAreaView edges={['top']}>
      <View style={{}}>
        {/* Top Bar height: 196 */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8}}>
          <View style={{width: 44}}>
            <FontAwesomeIcon style={fonts.bold} icon={faAngleLeft} size={24} />
          </View>
          <View style={{shadowColor: '#ffffff', shadowOpacity: 0.5, shadowRadius: 20}}>
            <Image source={{uri: 'https://picsum.photos/300'}} style={{height: 196, width: 196}} />
          </View>
          <View style={{width: 44}} />
        </View>

        {/* Space height: 24 */}
        <View style={{height: 24}} />

        {/* Info height: ~160 */}
        <View style={{padding: 8}}>
          <View style={{flexDirection: 'row'}}>
            <FontAwesomeIcon icon={faRedoAlt} style={fonts.bold} />
            <View style={{width: 4}} />
            <Text style={fonts.bold}> Scrollify</Text>
          </View>
          <View style={{height: 12}} />
          <Text style={fonts.default}>1337 Likes • 42 amazescrolls so far</Text>
          <View style={{height: 12}} />
          <View style={{flexDirection: 'row'}}>
            <FontAwesomeIcon style={fonts.default} icon={faHeart} />
            <View style={{width: 12}} />
            <FontAwesomeIcon style={fonts.default} icon={faArrowDown} />
            <View style={{width: 12}} />
            <FontAwesomeIcon style={fonts.default} icon={faEllipsisV} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  </LinearGradient>
);

const App = () => {
  return (
    <SafeAreaProvider>
      <View style={{backgroundColor: '#333333'}}>
        <AnimatedList
          data={data}
          keyExtractor={(_, index) => index.toString()}
          renderItem={RowItem}
          ListHeaderComponent={<View style={{height: 360}} />}
        />
        <Header />
      </View>
    </SafeAreaProvider>
  );
};

export default App;

const fonts = StyleSheet.create({
  default: {color: '#ffffffaa'},
  bold: {color: '#ffffffdd', fontWeight: 'bold'},
});
