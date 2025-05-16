// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import styled from 'styled-components';

export const title = `
  text-transform: uppercase;
  font-size: 1rem !important;
  margin-bottom: 1.75rem;
`;

export const StyledPreviewGroup = styled.div`
  margin-bottom: 2.5rem;
`;

export const StyledWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 65rem;
  height: auto;
  padding: 1rem 0 3rem 0;

  > * {
    flex-basis: auto;
  }

  @media (min-width: 900px) {
    flex-direction: row;
    padding: 2.5rem 0 6rem 0;

    > * {
      flex-basis: 50%;
    }

    @media (max-height: 800px) {
      padding: 1rem 0 1rem;
    }
  }
`;

export const StyledAudioGroup = styled.div`
  @media (max-width: 900px) {
    border-right: unset;
    padding-left: 4px!important;
    padding: 4px!important;
  }
`;

export const StyledVideoGroup = styled.div`
  padding: 0 0 0;

  @media (max-width: 900px) {
    padding: 0;
  }
`;

export const StyledInputGroup = styled.div`
  margin-bottom: 1.5rem;
`;
