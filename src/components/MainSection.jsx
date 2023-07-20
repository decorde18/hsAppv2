import { Outlet } from 'react-router-dom';
import { styled } from 'styled-components';

import AppNav from './AppNav';

const Div = styled.div`
  position: relative;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  margin-right: 1rem;
  height: 100%;
  border-width: 1px;
  min-width: 75vw;
  max-width: 1100px;
`;

function MainSection({ seasonProps }) {
  return (
    <Div>
      <AppNav></AppNav>
      <Outlet context={[seasonProps]}></Outlet>
    </Div>
  );
}

export default MainSection;
