import React, {useEffect} from 'react';
import {View} from 'react-native';
import NativeDevSettings from 'react-native/Libraries/NativeModules/specs/NativeDevSettings';
import VideoLinkInput from './src/components/VideoLinkInput.tsx';
import {GluestackUIProvider, Text} from '@gluestack-ui/themed';
import {config} from '@gluestack-ui/config';
import Header from './src/components/Header.tsx';
function App() {
  // useEffect(() => {
  //   connectToRemoteDebugger();
  // }, []);
  const connectToRemoteDebugger = () => {
    NativeDevSettings.setIsDebuggingRemotely(true);
  };
  console.log('My First Latest App');
  return (
    <>
      <GluestackUIProvider config={config}>
        <View
          style={{
            padding: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Header />
          <VideoLinkInput />
        </View>
      </GluestackUIProvider>
    </>
  );
}

export default App;
