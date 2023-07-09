import { Link } from 'react-router-dom';

import { styled } from 'styled-components';
const Img = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  padding-top: 0.25rem;
  padding-left: 0.25rem;
  height: 15rem;
`;
function Logo() {
  return (
    <Link to="/app">
      <Img src="/img/logo.png" alt="IHS Soccer" />
    </Link>
  );
}

export default Logo;
