// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';

import MeetingFormSelector from '../../containers/MeetingFormSelector';
import { StyledLayout } from './Styled';

const Home: React.FC = () => (
  <StyledLayout>
    <MeetingFormSelector />
  </StyledLayout>
);

export default Home;
