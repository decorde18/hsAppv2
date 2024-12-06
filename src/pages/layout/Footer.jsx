import { styled } from 'styled-components';

const StyledFooter = styled.footer`
  flex: 0;
  margin-top: auto;
  padding: 2rem;
`;

const Copyright = styled.footer`
  font-size: 1.2rem;
  color: var(--color-light--50);
  text-align: center;
`;

function Footer() {
  return (
    <StyledFooter>
      <Copyright>copyright David Cordero de Jesus</Copyright>
    </StyledFooter>
  );
}

export default Footer;
