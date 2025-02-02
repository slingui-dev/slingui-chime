// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';

import MeetingForm from '../MeetingForm';
import { StyledDiv, StyledWrapper } from './Styled';
import { useAppState } from '../../providers/AppStateProvider';
import MeetingSelection from '../../components/MeetingSelection/MeetingSelection';

const MeetingFormSelector: React.FC = () => {
  const {
    meetingId
  } = useAppState();
  const formToShow = meetingId.length > 0 ? <MeetingForm /> : <MeetingSelection></MeetingSelection>;

  return (
    <StyledWrapper>
      <StyledDiv>{formToShow}</StyledDiv>
    </StyledWrapper>
  );
};

export default MeetingFormSelector;
