import {
  AddIcon,
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  Input,
  InputField,
} from '@gluestack-ui/themed';
import React, {useState} from 'react';
import YouTubePlayer from 'rn-yt-player';
import ytdl from 'react-native-ytdl';

const VideoLinkInput = () => {
  const [url, setUrl] = useState();
  const youtubeURL = 'https://m.youtube.com/watch?v=4K_mgJi7AxU';
  // const urls = await ytdl(youtubeURL, {quality: 'highestaudio'});
  const handleInput = (e: {target: any}) => {
    setUrl(e);
  };
  return (
    <>
      <Input
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
      </Input>
      <YouTubePlayer
        hideSettingButton={true}
        videoSource={url}
        innerPlayButtonColor="white"
        hideTopBar={true}
        hideCaptionButton={true}
        hideYTLogo={true}
        accentColor={'green'}
        width="100%"
        height={250}
      />
      <Box marginTop={15}>
        <Button
          size="lg"
          variant="outline"
          action="positive"
          isDisabled={false}
          isFocusVisible={false}>
          <ButtonText>Download</ButtonText>
          {/* <ButtonIcon as={AddIcon} /> */}
        </Button>
      </Box>
    </>
  );
};
export default VideoLinkInput;
