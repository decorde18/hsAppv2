import { Link } from 'react-router-dom';

import { styled } from 'styled-components';
const Img = styled.img`
  height: 15rem;
  z-index: 1;
`;
function Logo() {
  return (
    <Link to="/app">
      <Img src="/img/logo.png" alt="IHS Soccer" />
    </Link>
  );
}

export default Logo;
