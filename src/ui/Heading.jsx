import styled, { css } from 'styled-components';

const Heading = styled.h1`
  ${(props) =>
    props.type === 'h1' &&
    css`
      font-size: 30px;
      font-weight: 600;
    `}
  ${(props) =>
    props.as === 'h2' &&
    css`
      font-size: 2rem;
      font-weight: 600;
    `}
  ${(props) =>
    props.as === 'h3' &&
    css`
      font-size: 2rem;
      font-weight: 400;
    `}

  ${(props) =>
    props.as === 'h4' &&
    css`
      font-size: 3rem;
      font-weight: 600;
    `}
  ${(
    props //currently not used, use as needed
  ) =>
    props.as === 'h5' &&
    css`
      font-size: 2.5rem;
      font-weight: 400;
    `}
  ${(props) =>
    props.location === 'center' &&
    css`
      text-align: center;
    `}
  ${(props) =>
    props.location === 'left' &&
    css`
      text-align: left;
    `}
      ${(props) =>
    props.case === 'upper' &&
    css`
      text-transform: uppercase;
    `}
    line-height:1.4
`;

export default Heading;
