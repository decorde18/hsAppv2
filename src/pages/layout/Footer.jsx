import { styled } from 'styled-components';

const StyledFooter = styled.footer`
  margin-top: auto;
  padding: 2rem;
`;

// .copyright {
//   font-size: 1.2rem;
//   color: var(--color-light--1);
// }

function Footer() {
  return <StyledFooter>FOOTER</StyledFooter>;
}

export default Footer;
