// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';

import { StyledWrapper, StyledAudioGroup, StyledVideoGroup } from './Styled';
import MicrophoneDevices from './MicrophoneDevices';
import { Collapse } from './../Collapse';
import SpeakerDevices from './SpeakerDevices';
import { Header } from './../MeetingSelection/MeetingSelection';
import CameraDevices from './CameraDevices';
import MeetingJoinDetails from '../../containers/MeetingJoinDetails';
import { Typography } from 'rmwc';

export const DeviceSelection = () => (

  <div>
    <div>
      <Header></Header>
    </div>
    <StyledWrapper>
      <StyledVideoGroup>
        <CameraDevices />
      </StyledVideoGroup>

      <StyledAudioGroup style={{ paddingLeft: '24px' }}>
        <Typography use="headline5" tag="h2" style={{paddingBottom: '24px', paddingTop: '24px'}}>
          Ready to join?
        </Typography>
        <Collapse title="Audio Input" icon="mic">
          <MicrophoneDevices />
        </Collapse>
        <Collapse title="Audio Output" icon="volume_up">
          <SpeakerDevices />
        </Collapse>

        <MeetingJoinDetails />
      </StyledAudioGroup>
    </StyledWrapper>
  </div>
);