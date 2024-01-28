import {
  AddIcon,
  Button,
  ButtonIcon,
  ButtonText,
  Input,
  InputField,
} from '@gluestack-ui/themed';
import React from 'react';

export default function VideoLinkInput() {
  return (
    <>
      <Input
        variant="rounded"
        size="lg"
        isDisabled={false}
        isInvalid={false}
        isReadOnly={false}>
        <InputField placeholder="Enter Youtube Link Here" />
      </Input>
      <Button
        size="lg"
        variant="outline"
        action="positive"
        isDisabled={false}
        isFocusVisible={false}>
        <ButtonText>Download</ButtonText>
        {/* <ButtonIcon as={AddIcon} /> */}
      </Button>
    </>
  );
}
