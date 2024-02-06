import {
  Box,
  Button,
  ButtonText,
  CircleIcon,
  CloseIcon,
  HStack,
  Heading,
  Icon,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
  VStack,
} from '@gluestack-ui/themed';
import React, {useCallback, useRef, useState} from 'react';
import {
  Alert,
  Image,
  PermissionsAndroid,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Video from 'react-native-video';
import RNFetchBlob from 'rn-fetch-blob';
import Slider from '@react-native-community/slider';
import Orientation from 'react-native-orientation-locker';

const VideoLinkInput = ({link}) => {
  const [url, setUrl] = useState('');
  const [playing, setPlaying] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [puased, setPaused] = useState(false);
  const [progress, setProgress] = useState(null);
  const [fullScreen, setFullScreen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [size, setSize] = useState(undefined);
  const sizes = ['xs', 'sm', 'md', 'lg', 'full'];
  const [speed, setSpeed] = useState(1)
  const handleOpen = () => {
    // setIsOpen(true);
    setShowModal(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  const ref = useRef();
  const format = seconds => {
    let mins = parseInt(seconds / 60)
      .toString()
      .padStart(2, '0');
    let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying(prev => !prev);
  }, []);

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission to Save Video In App',
          message:
            'App needs access to your Storage ' +
            'so you can take Download Videos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Storage');
        downloadFile();
      } else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleInput = (e: {target: any}) => {
    setUrl(e);
  };

  const downloadFile = () => {
    const {config, fs} = RNFetchBlob;
    const date = new Date();
    const fileDir = fs?.dirs?.DownloadDir;
    config({
      // add this option that makes response data to be stored as a file,
      // this is much more performant.
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: fileDir + '/download' + Math.floor(date.getDate()) + '.mp4',
        description: 'file download',
      },
    })
      .fetch('GET', url, {
        //some headers ..
      })
      .then(res => {
        // the temp file path
        console.log('The file saved to ', res.path());
        alert('file downloaded successfully ');
      });
  };

  function alert(arg0: string) {
    throw new Error('Function not implemented.');
  }
  const onVideoClick = () => {
    setClicked(!clicked);
  };

  const onControlClick = () => {
    setClicked(!clicked);
  };
  const handleClick = currentSize => {
    setShowModal(true);
    setSize(currentSize);
  };

  return (
    <>
      {/* <Input
        marginBottom={20}
        variant="rounded"
        size="lg"
        isDisabled={false}
        isInvalid={false}
        isReadOnly={false}>
        <InputField
          onChangeText={handleInput}
          placeholder="Enter Youtube Link Here"
        />
      </Input> */}
      <View
        style={{
          width: '100%',
          height: fullScreen ? '100%' : 200,
          position: fullScreen ? 'absolute' : 'relative',
        }}>
        <TouchableOpacity onPress={onVideoClick}>
          <Video
            paused={puased}
            source={{
              uri: link,
            }}
            style={{width: '100%', height: fullScreen ? 350 : 220}}
            rate={speed}
            // muted
            ref={ref}
            onProgress={x => {
              setProgress(x);
            }}
            resizeMode="cover"
          />
          {clicked && (
            <TouchableOpacity
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                backgroundColor: 'rgba(0,0,0,.4)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={onControlClick}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => {
                    ref.current.seek(parseInt(progress.currentTime) - 10);
                  }}>
                  <Image
                    source={require('../../assets/backward.png')}
                    style={{width: 30, height: 30, tintColor: 'white'}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setPaused(!puased);
                  }}>
                  <Image
                    source={
                      puased
                        ? require('../../assets/play-button.png')
                        : require('../../assets/pause.png')
                    }
                    style={{
                      width: 30,
                      height: 30,
                      tintColor: 'white',
                      marginLeft: 50,
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    ref.current.seek(parseInt(progress.currentTime) + 10);
                  }}>
                  <Image
                    source={require('../../assets/forward.png')}
                    style={{
                      width: 30,
                      height: 30,
                      tintColor: 'white',
                      marginLeft: 50,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  position: 'absolute',
                  bottom: 0,
                  paddingLeft: 20,
                  paddingRight: 20,
                  alignItems: 'center',
                }}>
                <VStack width={'100%'}>
                  <HStack>
                    <Text style={{color: 'white'}}>
                      {format(progress.currentTime)}/
                    </Text>
                    <Text style={{color: 'white'}}>
                      {format(progress.seekableDuration)}
                    </Text>
                  </HStack>

                  <Slider
                  value={progress.currentTime}
                    style={{width: '80%', height: 40}}
                    minimumValue={0}
                    maximumValue={progress.seekableDuration}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#fff"
                    onValueChange={x => {
                      ref.current.seek(x);
                    }}
                  />
                </VStack>
              </View>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  position: 'absolute',
                  bottom: 13,
                  right: 40,
                  paddingLeft: 20,
                  paddingRight: 20,
                  alignItems: 'center',
                }}>
                <TouchableOpacity onPress={handleOpen}>
                  <Image
                    source={require('../../assets/speed.png')}
                    style={{width: 22, height: 22, tintColor: 'white'}}
                  />
                  <Modal
                    isOpen={showModal}
                    onClose={() => {
                      setShowModal(false);
                    }}
                    size="sm">
                    <ModalBackdrop />
                    <ModalContent>
                      <ModalHeader>
                        <Heading size="lg">Playback Speed</Heading>
                        <ModalCloseButton>
                          <Icon as={CloseIcon} />
                        </ModalCloseButton>
                      </ModalHeader>
                      <ModalBody>
                        {/* <Text size="sm">Select Speed Functionality</Text> */}
                        <RadioGroup value={speed} onChange={setSpeed}>
                          <HStack space="sm" gap={20} justifyContent='center' mb={10}>
                            <Radio value={0.5}>
                              <RadioIndicator mr="$2">
                                <RadioIcon as={CircleIcon} />
                              </RadioIndicator>
                              <RadioLabel>0.5x</RadioLabel>
                            </Radio>
                            <Radio value={1}>
                              <RadioIndicator mr="$2">
                                <RadioIcon as={CircleIcon} />
                              </RadioIndicator>
                              <RadioLabel>1x</RadioLabel>
                            </Radio>
                            <Radio value={2}>
                              <RadioIndicator mr="$2">
                                <RadioIcon as={CircleIcon} />
                              </RadioIndicator>
                              <RadioLabel>2x</RadioLabel>
                            </Radio>
                          </HStack>
                        </RadioGroup>
                      </ModalBody>
                    </ModalContent>
                  </Modal>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  position: 'absolute',
                  bottom: 13,
                  right: 3,
                  paddingLeft: 20,
                  paddingRight: 20,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    if (fullScreen) {
                      Orientation.lockToPortrait();
                    } else {
                      Orientation.lockToLandscape();
                    }
                    setFullScreen(!fullScreen);
                  }}>
                  <Image
                    source={require('../../assets/full-size.png')}
                    style={{width: 18, height: 18, tintColor: 'white'}}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  position: 'absolute',
                  top: 10,
                  paddingLeft: 20,
                  paddingRight: 20,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    if (fullScreen) {
                      Orientation.lockToPortrait();
                    } else {
                      Orientation.lockToLandscape();
                    }
                    setFullScreen(!fullScreen);
                  }}>
                  {fullScreen ? (
                    <Image
                      source={require('../../assets/minimize.png')}
                      style={{width: 18, height: 18, tintColor: 'white'}}
                    />
                  ) : (
                    ''
                  )}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>
      <View
        style={{
          width:"100%",
          position: fullScreen ? 'absolute' : 'relative',
          top: 1,
          right: fullScreen ? 25 : 0,
          marginTop: 25,
          display:'flex',
          justifyContent:'flex-end',
          alignItems:'flex-end',
          marginBottom:20
        }}>
        <Box justifyContent='flex-end'>
          <Button
            onPress={() => {
              if (url !== '') {
                requestStoragePermission();
              } else {
                alert('Please Add URL');
              }
            }}
            size="lg"
            variant="solid"
            action="positive"
            isDisabled={false}
            isFocusVisible={false}>
            <ButtonText>Download</ButtonText>
          </Button>
        </Box>
      </View>
    </>
  );
};
export default VideoLinkInput;
