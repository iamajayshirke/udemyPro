import {Heading, Text, View} from '@gluestack-ui/themed';
import React from 'react';

function Header() {
  return (
    <View p="$4">
      <Heading>
        Testing App{' '}
        <Heading color="$amber700">Youtube Video Download</Heading>
      </Heading>
      <Text pt="$3">
        Simply Take Youtube Video Url As a Input And Download Video In MP4 Format
      </Text>
    </View>
  );
}

export default Header;
