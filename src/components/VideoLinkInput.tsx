import {
  Box,
  Button,
  ButtonText,
  CloseIcon,
  HStack,
  Heading,
  Icon,
  Popover,
  PopoverBackdrop,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  VStack,
} from '@gluestack-ui/themed';
import {Linking, PermissionStatus, Platform} from 'react-native';
import React, {useRef, useState} from 'react';
import {
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
import {PopoverArrow} from '@gluestack-ui/themed';
import CryptoJS from 'react-native-crypto-js';

const VideoLinkInput = ({link}) => {
  const [url, setUrl] = useState('');
  const [playing, setPlaying] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [puased, setPaused] = useState(false);
  const [progress, setProgress] = useState(null);
  const [fullScreen, setFullScreen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [size, setSize] = useState(undefined);
  const [speed, setSpeed] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const {config, fs} = RNFetchBlob;
  const fileDir = fs?.dirs?.DownloadDir;
  const videoPath = fileDir + '/download' + '.mp4';
  const encryptionKey = 'safeEncrypt';

  const handleClose = () => {
    setIsOpen(false);
  };
  const handleOpen = () => {
    setIsOpen(true);
    // setShowModal(true);
  };
  const ref = useRef();
  const format = seconds => {
    let mins = parseInt(seconds / 60)
      .toString()
      .padStart(2, '0');
    let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

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
      console.log(granted);
      let notificationsPermissionCheck: PermissionStatus = 'granted';
      if (Platform.Version >= '33') {
        notificationsPermissionCheck = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      }
      console.log(
        'notificationsPermissionCheck:',
        notificationsPermissionCheck,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Storage');
        downloadFile();
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        // openSettings()
        downloadFile();
      } else {
        alert('Storage permission denied');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const downloadFile = () => {
    config({
      // add this option that makes response data to be stored as a file,
      // this is much more performant.
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: fileDir + '/download' + '.mp4',
        description: 'file download',
      },
    })
      .fetch('GET', link)
      .then(res => {
        // the temp file path
        console.log('The file saved to ', res.path());
        alert('file downloaded successfully ');
      });
  };
  let data = [{id: 1}, {id: 2}];
  let ciphertext: any;
  const encryptVideo = () => {
    console.log('Encryt Funct');

    // Encrypt
    ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      'sdgroup',
    ).toString();
    console.log(ciphertext, 'Encrypt');

    // Read the video file
    // console.log(videoPath, 'VideoPath');
    // RNFetchBlob.fs.readStream(videoPath, 'utf8', 4048).then(stream => {
    //   let data = '';
    //   console.log(stream);
    //   stream.open();
    //   stream.onData(chunk => {
    //     console.log(chunk, 'chunk');
    //     data += chunk;
    //   });
    //   stream.onEnd(() => {
    //     console.log(data);
    //   });
    // });
    // const videoData = await fs
    //   .readStream(videoPath, 'base64')
    //   .then((e: any) => {
    //     console.log(e);
    //   });
    // Encrypt the video data
    // const encryptedData = CryptoJS.AES.encrypt(
    //   videoData,
    //   encryptionKey,
    // ).toString();
    // console.log(encryptedData, "Encrypted Data")
  };
  const decryptData = () => {
    // Decrypt
    let bytes = CryptoJS.AES.decrypt(ciphertext, 'sdgroup');
    let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    console.log(decryptedData); // [{id: 1}, {id: 2}]
  };

  const onVideoClick = () => {
    setClicked(!clicked);
  };

  const onControlClick = () => {
    setClicked(!clicked);
  };

  return (
    <View>
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
              // uri: link,
              uri: videoPath,
            }}
            style={{
              width: '100%',
              height: fullScreen ? 350 : 220,
            }}
            rate={speed}
            // muted
            ref={ref}
            onProgress={x => {
              setProgress(x);
            }}
            resizeMode="stretch"
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
                // borderRadius: 20
              }}
              onPress={onControlClick}>
              {/* Back Forword Pause */}
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
              {/* Seek Bar */}
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
                    thumbTintColor="red"
                  />
                </VStack>
              </View>
              {/* PlayBack Speed */}
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
                </TouchableOpacity>
              </View>
              {/* Maximize Screen */}
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
              {/* Minimize Screen */}
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
          width: '100%',
          position: fullScreen ? 'absolute' : 'relative',
          top: 1,
          right: fullScreen ? 25 : 0,
          marginTop: 25,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 20,
          paddingRight: 5,
        }}>
        <Box justifyContent="flex-end">
          <Button
            onPress={() => {
              if (link !== '') {
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
            <ButtonText>Save</ButtonText>
          </Button>
        </Box>
        <Box justifyContent="flex-end">
          <Button
            onPress={encryptVideo}
            size="lg"
            variant="solid"
            action="positive"
            isDisabled={false}
            isFocusVisible={false}>
            <ButtonText>Encrpyt</ButtonText>
          </Button>
        </Box>
        <Box justifyContent="flex-end">
          <Button
            onPress={decryptData}
            size="lg"
            variant="solid"
            action="positive"
            isDisabled={false}
            isFocusVisible={false}>
            <ButtonText>Decrypt</ButtonText>
          </Button>
        </Box>
      </View>
      <Box display='flex' justifyContent='center' alignItems='center'>
        <Text>Object Data</Text>
        {data.map((e,i) => (
          <Text key={i}>{e.id}</Text>
        ))}
        <Text>{ciphertext}</Text>
      </Box>
      {/* <Box>
        <Popover
          isOpen={isOpen}
          onClose={handleClose}
          onOpen={handleOpen}
          placement="top right"
          size="sm"
          // initialFocusRef={}
          trigger={triggerProps => {
            return (
              <Button {...triggerProps}>
                <ButtonText>Popover</ButtonText>
              </Button>
            );
          }}>
          <PopoverBackdrop />
          <PopoverContent>
            <PopoverArrow />
            <PopoverHeader>
              <Heading size="lg">Welcome!</Heading>
              <PopoverCloseButton>
                <Icon as={CloseIcon} />
              </PopoverCloseButton>
            </PopoverHeader>
            <PopoverBody>
              <Text size="sm">
                Join the product tour and start creating your own checklist. Are
                you ready to jump in?
              </Text>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Box> */}
    </View>
  );
};
export default VideoLinkInput;
