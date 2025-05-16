// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';

import {
  Flex,
  Heading,
} from 'amazon-chime-sdk-component-library-react';

import { useAppState } from '../../providers/AppStateProvider';
import { StyledList } from './Styled';

const MeetingDetails = () => {
  const { meetingId } = useAppState();

  return (
    <Flex container layout="fill-space-centered">
      <Flex mb="2rem" mr={{ md: '2rem' }} px="1rem">
        <Heading level={4} tag="h1" mb={2}>
          Classroom information:
        </Heading>
        <StyledList>
          <div>
            <dt>Classroom ID</dt>
            <dd>{meetingId}</dd>
          </div>
        </StyledList>
        {/* <PrimaryButton
          mt={4}
          label={theme === 'light' ? 'Dark mode' : 'Light mode'}
          onClick={toggleTheme}
        ></PrimaryButton> */}
      </Flex>
    </Flex>
  );
};

export default MeetingDetails;
