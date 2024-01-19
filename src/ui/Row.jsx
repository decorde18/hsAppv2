import { css, styled } from 'styled-components';

const Row = styled.div`
  display: flex;
  /* ${(props) =>
    props.type === 'horizontal' &&
    css`
      justify-content: space-between;
      align-items: stretch;
    `}
  ${(props) =>
    props.type === 'vertical' &&
    css`
      flex-direction: column;
      gap:1.6rem
      justify-content: space-between;
      align-items: stretch;
    `} */
  ${(props) =>
    props.type === 'vertical' &&
    css`
      flex-direction: column;
      gap: 1.6rem;
    `}
  ${(props) =>
    props.justify &&
    css`
      justify-content: ${props.justify};
    `}
      ${(props) =>
    props.align &&
    css`
      align-items: ${props.align};
    `}
`;
Row.defaultProps = {
  type: 'vertical',
  align: 'center',
  justify: 'space-between',
};
export default Row;
