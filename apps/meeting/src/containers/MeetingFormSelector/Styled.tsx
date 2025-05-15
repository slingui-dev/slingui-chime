// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import styled from 'styled-components';

export const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  max-width: 640px;

  @media (min-width: 600px) and (min-height: 600px) {
    border-radius: 16px;
  }
`;

export const StyledDiv = styled.div`
  padding: 0rem;
  flex: 1;
  width: 100%;
`;
