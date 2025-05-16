// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { StyledLayout } from './Styled';
import { DeviceSelection } from '../../components/DeviceSelection';

const DeviceSetup: React.FC = () => (
  <StyledLayout>
    <DeviceSelection />
  </StyledLayout>
);

export default DeviceSetup;
