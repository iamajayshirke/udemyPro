import React, {useState, useCallback, useRef, useEffect} from 'react';
import {TouchableOpacity, useWindowDimensions} from 'react-native';
import WebView from 'react-native-webview';
import {View, Alert} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
// import {Box, CheckIcon, Icon, Select, Button, Text} from 'native-base';
import Slider from '@react-native-community/slider';
import {Box, Button, Select, Text} from '@gluestack-ui/themed';

function YTPlayer() {
  const {width} = useWindowDimensions();
  // https://www.youtube.com/embed/zFvLoiq58Nk?si=4tgR3XeD7fl8aWxX
  const [playing, setPlaying] = useState(false);
  const [onfullScreen, setOnfullScreen] = useState<any>(false);
  const [vmute, setVmute] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<any>(1); // Initial playback rate
  const playerRef = useRef<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [elapsed, setElapsed] = useState<any>(0);
  const [selectedTime,setSelectedTime] = useState(0)

  async function durationSec() {
    let currduration = await playerRef.current
      .getDuration()
      .then((y: any) => setDuration(y));
  }
  useEffect(()=>{
    handleSeek()
  },[selectedTime])
  useEffect(() => {
    durationSec();
    const interval = setInterval(async () => {
      const elapsed_sec = await playerRef.current.getCurrentTime(); // this is a promise. dont forget to await

      setElapsed(elapsed_sec);
    }, 100); // 100 ms refresh. increase it if you don't require millisecond precision

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handlePlaybackRateChange = (rate: any) => {
    setPlaybackRate(Number(rate));
  };
  const format = seconds => {
    let mins = parseInt(seconds / 60)
      .toString()
      .padStart(2, '0');
    let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const onStateChange = (state: any) => {
   
    if(state == 'unstarted'){
      console.log("unstarted")
      durationSec()
    }
    if (state == 'playing'){
      console.log("Playing")
      durationSec()
    }
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  };

  const togglePlaying = () => {
    setPlaying(prev => !prev);
  };
  const handleSeek = ()=>{
    playerRef.current.seekTo(selectedTime)
  }

  return (
    <>
      <Box style={{position: 'relative'}}>
        <YoutubePlayer
          ref={playerRef}
          height={250}
          width={width}
          play={playing}
          videoId={'TZuQjv5Z6h8'}
          onChangeState={onStateChange}
          mute={vmute}
          playbackRate={playbackRate}
          initialPlayerParams={{controls: false}}
          
        />

        <Box
          style={{
            position: 'absolute',
            backgroundColor: 'transparent',
            width: '100%',
            height: '100%',
            opacity: 0,
          }}>
          <TouchableOpacity
            onPress={() => console.log('TouchableOpacity')}></TouchableOpacity>
        </Box>

        <Box
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            width: '100%',
            gap: 1,
            position: 'absolute',
            backgroundColor: 'black',
            // height:60,
            //  top:200
            bottom: 10,
          }}
          // padding={1}
          // m={1}
        >
          <Button onPress={togglePlaying}>
            <Text>{playing ? 'pause' : 'play'}</Text>
          </Button>
          <Button onPress={() => setVmute(prev => !prev)}>
            <Text>{vmute ? 'unmute' : 'mute'}</Text>
          </Button>

          <Box>
            {/* <Select
            selectedValue={playbackRate}
            // minWidth="50"
            accessibilityLabel="playback speed"
            placeholder="Playback Speed"
            _selectedItem={{
              bg: 'teal.600',
              // endIcon: <CheckIcon size="2" />,
            }}
            mt={1}
            onValueChange={itemValue => handlePlaybackRateChange(itemValue)}>
            <Select.Item label="0.5" value={'0.5'} />
            <Select.Item label="0.25" value={'0.25'} />
            <Select.Item label="Normal" value={'1'} />
            <Select.Item label="1.25" value={'1.25'} />
            <Select.Item label="1.5" value="1.5" />
            <Select.Item label="2" value="2" />
          </Select> */}
          </Box>

          <Button onPress={() => setOnfullScreen((prev: any) => !prev)}>
            <Text>fullScrn</Text>
          </Button>

          {/* <Button
          onPress={() => {
            
          }}>
          <Icon
            as={
              <MaterialCommunityIcons
                name={'volume-off'}
              />
            }
            color="white"
            size={10}
          />
         
        </Button> */}
        </Box>
      </Box>
      <Box style={{width: '100%', marginTop: 0}}>
        <Slider
          style={{width: '100%', height: 40}}
          minimumValue={0}
          maximumValue={duration}
          value={elapsed}
          minimumTrackTintColor="red"
          maximumTrackTintColor="red"
          thumbTintColor="red"
          onValueChange={(e)=>{setSelectedTime(e)}}
        />
        <View style={{flexDirection: 'row'}}>
          <Text style={{flex: 1}}>{'elapsed time'}</Text>
          <Text style={{flex: 1, color: 'green'}}>Current/{format(elapsed)}</Text>
          <Text style={{flex: 1, color: 'green'}}>Total/{format(duration)}</Text>
        </View>
      </Box>
    </>
  );
}

export default YTPlayer;
