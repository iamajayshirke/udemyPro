import {Box, Button, ButtonText, HStack, VStack} from '@gluestack-ui/themed';
import {PermissionStatus, Platform} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
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
import CryptoJS from 'react-native-crypto-js';
import RNFS from 'react-native-fs';

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
  const [fileArr, setFileArr] = useState([]);
  const [base64, setBase64] = useState<String>();
  const {config, fs} = RNFetchBlob;
  const fileDir = fs?.dirs?.SDCardApplicationDir + '/files';
  const newFileDir = fs?.dirs?.SDCardApplicationDir + '/files/newFiles';
  console.log(fs?.dirs.CacheDir, 'Directories');
  console.log(fs?.dirs?.SDCardApplicationDir, 'SD Card');
  const smallFile =
    fs?.dirs?.SDCardApplicationDir + '/files' + '/smallVideo.temp';
  const encSmallFile =
    fs?.dirs?.SDCardApplicationDir + '/files' + '/smallVideo.enc';
  const decryptFile =
    fs?.dirs?.SDCardApplicationDir + '/cache' + '/cacheVideo.mp4';

  const videoPath = fileDir + '/smallVid.enc';
  let ciphertext: any;
  useEffect(() => {
    console.log('Fetch');
  }, [fs]);
  // let data = '';
  // console.log(base64, 'Decrypted String');
  const encryptVideo = async () => {
    RNFetchBlob.fs
      .stat(smallFile)
      .then(stats => {
        console.log(stats, 'Statistics');
      })
      .catch(err => {});
    await RNFetchBlob.fs
      .readStream(smallFile, 'base64', 1000000, -1)
      .then(stream => {
        let data = '';
        let count = 0;
        // If Chunk Size is Less than 1.5MB Then Only Stream Opens or Else It Crashes
        stream.open();
        // console.log(stream)
        stream.onData(chunk => {
          fs.mkdir(newFileDir)
            .then(() => {})
            .catch(() => {});
          console.log(chunk, 'Chunks');
          count += 1;
          data += chunk;
          RNFetchBlob.fs
            .writeStream(
              `${fs?.dirs?.SDCardApplicationDir}/files/newFiles/smallVideo.v${count}.enc`,
              'base64',
            )
            .then(stream => {
              stream.write(RNFetchBlob.base64.encode(chunk));
              return stream.close();
            });
        });
        stream.onEnd(() => {
          console.log(data);
          // fs.unlink(smallFile);
        });
      })
      .catch(err => {
        console.log(err);
      });
    // RNFetchBlob.fs.readFile(smallFile, 'base64').then(data => {
    //   if (data) {
    //     let encVideo = CryptoJS.AES.encrypt(data, 'Ajay').toString();
    //     if (encVideo) {
    //       fs.unlink(smallFile);
    //       RNFetchBlob.fs
    //         .writeStream(encSmallFile, 'base64')
    //         .then(async stream => {
    //           const encryptVideo = stream.write(
    //             RNFetchBlob.base64.encode(encVideo),
    //           );
    //           console.log(await encryptVideo, 'Encrypted Video and Encoded');
    //           return stream.close();
    //         });
    //     }
    //   }
    //   console.log('Encryption Done');
    // });
  };
  const sortFileName = (filenames: any) => {
    return filenames.sort(function (a: string, b: string) {
      var regex = /(\D+)|(\d+)/g;
      var partsA = a.match(regex);
      var partsB = b.match(regex);

      while (partsA.length && partsB.length) {
        var partA = partsA.shift();
        var partB = partsB.shift();
        if (isNaN(partA) && isNaN(partB)) {
          if (partA < partB) return -1;
          if (partA > partB) return 1;
        } else {
          partA = parseInt(partA) || 0;
          partB = parseInt(partB) || 0;
          if (partA < partB) return -1;
          if (partA > partB) return 1;
        }
      }
      return partsA.length - partsB.length;
    });
  };
  async function processItem(item: any) {
    // Simulate some asynchronous task, like fetching data or performing a computation
    combineChunksIntoVideo(item);
    // Simulate a delay using setTimeout
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1000 milliseconds delay

    // After the delay, continue with the loop
    console.log('Finished processing item:', item);
  }
  const combineChunksIntoVideo = (fileName: any) => {
    RNFetchBlob.fs
      .readFile(newFileDir + '/' + fileName, 'base64')
      .then(data => {
        const decodedData = RNFetchBlob.base64.decode(data);
        console.log(decodedData, 'Decoded String');
        setBase64(decodedData);
        RNFetchBlob.fs.writeStream(decryptFile, 'base64', true).then(stream => {
          stream.write(decodedData);
          return stream.close();
        });
      });
  };
  const decryptData = async () => {
    RNFetchBlob.fs
      .ls(newFileDir)
      // files will an array contains filenames
      .then(files => {
        setFileArr(files);
      });
    const sorted = sortFileName(fileArr);
    for (const element of sorted) {
      console.log(element, 'For In Loop');
      await processItem(element);
    }
    // RNFetchBlob.fs
    //   .readStream(newFileDir + '/' + fileArr[1], 'base64', 1000000, 5)
    //   .then(stream => {
    //     let data = '';
    //     stream.open();
    //     stream.onData(chunk => {
    //       data += chunk;
    //       console.log(data)
    //       RNFetchBlob.fs
    //         .exists(newFileDir + '/cacheVideo')
    //         .then(exist => {
    //           console.log(exist ? 'Exist' : 'doest');
    //           if (!exist) {
    //             RNFetchBlob.fs.createFile(
    //               newFileDir + '/cacheVideo',
    //               RNFetchBlob.base64.encode(''),
    //               'base64',
    //             );
    //           }
    //         })
    //         .catch(() => {});
    //       // RNFetchBlob.fs.createFile(
    //       //   newFileDir + '/cacheVideo',
    //       //   RNFetchBlob.base64.encode(data),
    //       //   'base64',
    //       // );
    //       // RNFetchBlob.fs.writeStream(newFileDir, 'base64').then(stream => {
    //       //   stream.write(RNFetchBlob.base64.encode(data));
    //       //   return stream.close();
    //       // });
    //     });
    //     stream.onEnd(() => {
    //       const decodedData = RNFetchBlob.base64.decode(data);
    //       console.log(decodedData,"Decoded Data")
    //       // RNFetchBlob.fs
    //       //   .exists(newFileDir + '/cacheVideo')
    //       //   .then(exist => {
    //       //     if (exist) {
    //       //       RNFetchBlob.fs
    //       //         .writeStream(newFileDir + '/cacheVideo', 'base64')
    //       //         .then(async stream => {
    //       //           const decryptedvideo = stream.write(decodedData);
    //       //           console.log(await decryptedvideo);
    //       //           return stream.close();
    //       //         });
    //       //     }
    //       //     console.log(`file ${exist ? '' : 'not'} exists`);
    //       //   })
    //       //   .catch(() => {});
    //     });
    //   });

    // RNFetchBlob.fs.readFile(encSmallFile, 'base64').then(async data => {
    //   // handle the data ..
    //   let decryptedData: any;
    //   console.log(data, 'Encoded and Encrypted String');
    //   const decodedData = RNFetchBlob.base64.decode(data);
    //   console.log(decodedData, 'Decoded and Encrypted String');
    //   let bytes = CryptoJS.AES.decrypt(decodedData, 'Ajay');
    //   console.log(bytes, 'Decoded and Decrpyted, Bytes ===>');
    //   decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    //   console.log(decryptedData, 'Decrypted Data');
    //   setBase64(decryptedData);
    //   RNFetchBlob.fs.writeStream(decSmallFile, 'base64').then(async stream => {
    //     const decryptedvideo = stream.write(decryptedData);
    //     console.log(await decryptedvideo);
    //     return stream.close();
    //   });
    //   console.log(decryptedData);
    // });
  };
  const handleOpen = () => {
    setIsOpen(true);
    // setShowModal(true);
  };
  const ref = useRef();
  const format = (seconds: number) => {
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
  const requestReadStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission to Read',
          message:
            'App needs Read to your Storage ' + 'so you can take Read Videos.',
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
        console.log('You can Read the Storage');
        encryptVideo();
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        // openSettings()
        encryptVideo();
      } else {
        alert('Storage permission denied');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const downloadFile = async () => {
    config({
      // add this option that makes response data to be stored as a file,
      // this is much more performant.
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: fileDir + '/smallVideo.temp',
        description: 'Encrypted File Download',
      },
    })
      .fetch('GET', link)
      .then(async res => {
        let status = res.info().status;
        console.log(res, 'Res');
        // let base64Str = await res.base64();
        // setBase64(base64Str)
        // console.log(base64Str, 'Base64 String');
        if (status == 200) {
          // the conversion is done in native code
          let base64Str = res.base64();
          console.log(base64Str, 'Base64 String');
          // the following conversions are done in js, it's SYNC
          let text = res.text();
          console.log(text, 'Text');
          let json = res.json();
        } else {
          // handle other status codes
        }
        // the temp file path
        console.log('The file saved to ', res.path());
        alert('file downloaded successfully ');
      });
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
            muted
            source={{
              uri: decryptFile,
              // uri: link,
              // uri:`data:video/mp4;base64,${base64}`
            }}
            style={{
              width: '100%',
              height: fullScreen ? 350 : 220,
            }}
            rate={speed}
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
                    ref?.current.seek(parseInt(progress?.currentTime) - 10);
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
                    ref.current.seek(parseInt(progress?.currentTime) + 10);
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
                      {format(progress?.currentTime)}/
                    </Text>
                    <Text style={{color: 'white'}}>
                      {format(progress?.seekableDuration)}
                    </Text>
                  </HStack>

                  <Slider
                    value={progress?.currentTime}
                    style={{width: '80%', height: 40}}
                    minimumValue={0}
                    maximumValue={progress?.seekableDuration}
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
            onPress={requestReadStoragePermission}
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
      <Box display="flex" justifyContent="center" alignItems="center">
        <Text>Object Data</Text>
        {/* {data.map((e, i) => (
          <Text key={i}>{e.id}</Text>
        ))} */}
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
