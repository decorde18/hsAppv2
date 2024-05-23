import styled, { css } from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: ${(props) => `repeat( ${props.columns},1fr)`};
  grid-template-rows: ${(props) => `repeat( ${props.rows},1fr)`};
`;

export default Grid;
