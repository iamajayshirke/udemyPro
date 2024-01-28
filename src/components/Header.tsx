import {Heading, Text, View} from '@gluestack-ui/themed';
import React from 'react';

function Header() {
  return (
    <View p="$4">
      <Heading>
        Testing App For{' '}
        <Heading color="$emerald400">Youtube Video Download</Heading>
      </Heading>
      <Text pt="$3">
        gluestack-ui is a simple, modular and accessible component library that
        gives you building blocks to build you React applications.
      </Text>
    </View>
  );
}

export default Header;
