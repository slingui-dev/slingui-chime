// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import {
  MicSelection,
} from 'amazon-chime-sdk-component-library-react';

import MicrophoneActivityPreview from './MicrophoneActivityPreview';

const MicrophoneDevices = () => {
  return (
    <div>
      <MicSelection />
      <MicrophoneActivityPreview />
    </div>
  );
};

export default MicrophoneDevices;
