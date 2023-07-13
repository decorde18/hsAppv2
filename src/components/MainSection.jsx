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
`;
// .mainSection {
//   flex-basis: 56rem;
//   background-color: var(--color-dark--1);
//   padding: 2rem 3rem 1.5rem 3rem;

//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   height: calc(85vh);
// }
function MainSection({ seasonProps }) {
  return (
    <Div>
      <AppNav></AppNav>
      <Outlet context={[seasonProps]}></Outlet>
    </Div>
  );
}

export default MainSection;

// flex-basis: 56rem;

// display: flex;
// flex-direction: column;
// align-items: center;
