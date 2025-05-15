// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';

import MeetingForm from '../MeetingForm';
import { StyledDiv, StyledWrapper } from './Styled';
import MeetingSelection from '../../components/MeetingSelection/MeetingSelection';

const MeetingFormSelector: React.FC = () => {

  return (
    <StyledWrapper>
      <StyledDiv>
        <MeetingSelection></MeetingSelection>
        <MeetingForm />
      </StyledDiv>
    </StyledWrapper>
  );
};

export default MeetingFormSelector;
