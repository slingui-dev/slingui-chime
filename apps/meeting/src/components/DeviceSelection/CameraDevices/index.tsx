// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import {
  PreviewVideo,
  QualitySelection,
  CameraSelection,
} from 'amazon-chime-sdk-component-library-react';

import { StyledInputGroup } from '../Styled';
import { useAppState } from '../../../providers/AppStateProvider';
import { VideoFiltersCpuUtilization } from '../../../types';
import { VideoTransformDropdown } from '../CameraDevices/VideoTransformDropdown';
import { BackgroundReplacementDropdown } from '../CameraDevices/BackgroundReplacementDropdown';
import { Collapse } from '../../Collapse';
import styled from 'styled-components';

export const VideoCard = styled.div`
  overflow: hidden;
  border-radius: 24px;
  display: grid;
  margin-bottom: 12px;
  width: 100%;
`;

const CameraDevices = () => {
  const { videoTransformCpuUtilization } = useAppState();
  const videoTransformsEnabled = videoTransformCpuUtilization !== VideoFiltersCpuUtilization.Disabled;
  return (
    <div>
      <VideoCard>
      <PreviewVideo />
      </VideoCard>
      <StyledInputGroup>
        <CameraSelection />
      </StyledInputGroup>
      <Collapse title="Advanced video settings">
        <StyledInputGroup>
          <QualitySelection />
        </StyledInputGroup>
        {videoTransformsEnabled ?
          <StyledInputGroup>
            <VideoTransformDropdown />
          </StyledInputGroup> : ''
        }
        {videoTransformsEnabled ?
          <StyledInputGroup>
            <BackgroundReplacementDropdown />
          </StyledInputGroup> : ''
        }
      </Collapse>
    </div>
  );
};

export default CameraDevices;
