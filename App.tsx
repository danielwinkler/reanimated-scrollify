import React, {useState} from 'react';
import {Image, LayoutChangeEvent, ListRenderItemInfo, StyleSheet, Text, View} from 'react-native';

import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {FlatList} from 'react-native-gesture-handler';
import {artists, songs} from './data';
import {zip, shuffle} from 'lodash';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleLeft, faArrowDown, faEllipsisV, faPlay, faRedoAlt} from '@fortawesome/free-solid-svg-icons';
import {faHeart} from '@fortawesome/free-regular-svg-icons';
import {SafeAreaInsetsContext, SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
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

type HeaderProps = {squeeze: Animated.SharedValue<number>; headerHeight: number};
const Header: React.FC<HeaderProps> = ({squeeze, headerHeight}) => {
  const buttonPos = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: Math.max(headerHeight - 56 - squeeze.value, 12),
      right: 24,
    };
  });
  const opacityStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(squeeze.value, [120, 200], [0, 1], Extrapolate.CLAMP),
    };
  });
  return (
    <SafeAreaInsetsContext.Consumer>
      {insets => (
        <>
          <Animated.View style={[{position: 'absolute', top: 0, left: 0, right: 0}, opacityStyle]}>
            <LinearGradient colors={['#aaaaaa', '#333333']} style={{alignItems: 'center'}}>
              <View style={{height: (insets?.top ?? 0) + 4}}></View>
              <Text style={fonts.bold}> Scrollify</Text>
              <View style={{height: 12}}></View>
            </LinearGradient>
          </Animated.View>
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: insets?.top ?? 0,
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}>
            <View style={{width: 44, marginLeft: 8}}>
              <FontAwesomeIcon style={fonts.bold} icon={faAngleLeft} size={24} />
            </View>
            <Animated.View style={buttonPos}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: '#36D7B7',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FontAwesomeIcon color="white" icon={faPlay} size={20} />
              </View>
            </Animated.View>
          </View>
        </>
      )}
    </SafeAreaInsetsContext.Consumer>
  );
};

const App = () => {
  const squeeze = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({contentOffset}) => {
      squeeze.value = contentOffset.y;
    },
  });

  const [height, setHeight] = useState(0);
  const onLayout = ({nativeEvent}: LayoutChangeEvent) => {
    setHeight(nativeEvent.layout.height);
  };

  const ListHeader = () => {
    const picStyle = useAnimatedStyle(() => {
      if (squeeze.value > 120) return {opacity: 0};
      const opacity = interpolate(squeeze.value, [0, 120], [1, 0], Extrapolate.CLAMP);
      const scale = interpolate(squeeze.value, [-60, 0, 120], [1.25, 1, 0.5], Extrapolate.CLAMP);
      const translateY = interpolate(squeeze.value, [0, 120], [0, 120], Extrapolate.CLAMP);
      return {opacity, transform: [{scale}, {translateY}]};
    });
    return (
      <LinearGradient colors={['#aaaaaa', '#333333']}>
        <SafeAreaView edges={['top']}>
          <View onLayout={onLayout}>
            {/* Top Bar height: 196 */}
            <View style={{alignItems: 'center'}}>
              <Animated.View style={picStyle}>
                <View style={{shadowColor: '#ffffff', shadowOpacity: 0.5, shadowRadius: 20}}>
                  <Image source={{uri: 'https://picsum.photos/300'}} style={{height: 196, width: 196}} />
                </View>
              </Animated.View>
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
  };

  return (
    <SafeAreaProvider>
      <View style={{backgroundColor: '#aaaaaa'}}>
        <AnimatedList
          data={data}
          keyExtractor={(_, index) => index.toString()}
          renderItem={RowItem}
          ListHeaderComponent={<ListHeader />}
          scrollEventThrottle={16}
          contentContainerStyle={{backgroundColor: '#333333'}}
          onScroll={scrollHandler}
        />
        {height > 0 && <Header squeeze={squeeze} headerHeight={height} />}
      </View>
    </SafeAreaProvider>
  );
};

export default App;

const fonts = StyleSheet.create({
  default: {color: '#ffffffaa'},
  bold: {color: '#ffffffdd', fontWeight: 'bold'},
});
