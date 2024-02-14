import React, {useEffect} from 'react';
import {PermissionsAndroid, View} from 'react-native';
import NativeDevSettings from 'react-native/Libraries/NativeModules/specs/NativeDevSettings';
import VideoLinkInput from './src/components/VideoLinkInput.tsx';
import {GluestackUIProvider, ScrollView, Text} from '@gluestack-ui/themed';
import {config} from '@gluestack-ui/config';
import Header from './src/components/Header.tsx';
import YTPlayer from './src/components/YTPlayer.tsx';
function App() {
  const connectToRemoteDebugger = () => {
    NativeDevSettings.setIsDebuggingRemotely(true);
  };

  return (
    <GluestackUIProvider config={config}>
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* <Header /> */}
        <ScrollView width={'100%'} rowGap={50}>
          {/* <YTPlayer /> */}
          <VideoLinkInput link="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4" />
        </ScrollView>
      </View>
    </GluestackUIProvider>
  );
}
export default App;
