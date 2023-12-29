import Logo from '../../ui/Logo';
import { styled } from 'styled-components';

const StyledHeader = styled.header`
  display: flex;
  margin-bottom: 0.5rem;
  text-align: center;
  justify-content: space-between;
`;
const Div = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: auto;
`;
const H1 = styled.h1`
  margin-top: 2.5rem;
  font-size: 2.25rem;
  line-height: 2.5rem;
  font-weight: 700;
  color: var(--color-brand--2);
`;

function HeaderPublic({ type }) {
  return (
    <StyledHeader className="relative mb-2">
      <Logo></Logo>
      <Div>
        <H1>INDEPENDENCE GIRLS SOCCER</H1>
      </Div>
    </StyledHeader>
  );
}

export default HeaderPublic;
