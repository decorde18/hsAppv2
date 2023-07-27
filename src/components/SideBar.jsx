import { styled } from 'styled-components';
import Button from './Button';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../ui/AppLayout';

const Aside = styled.aside`
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 1.5rem;
  margin-left: 0.75rem;
  color: var(--color-light--1);
`;
const Div = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

function SideBar() {
  const { currentSeason } = useContext(AppContext);

  return (
    <Aside>
      <Div>
        <Button type="sideNav">Print Roster</Button>
        <Button type="sideNav">
          <NavLink to={`../schedule?season=${currentSeason}`} target="_blank">
            Print Schedule
          </NavLink>
        </Button>
        <Button type="sideNav">
          <NavLink
            to={`../protected/rosterTSSAA?season=${currentSeason}`}
            target="_blank"
          >
            TSSAA Roster
          </NavLink>
        </Button>
        <Button type="sideNav">
          <NavLink to={`./communication?season=${currentSeason}`}>
            Communication
          </NavLink>
        </Button>
        <Button type="sideNav">
          <NavLink to={`./people`}>People</NavLink>
        </Button>
        <Button type="sideNav">Season Settings</Button>
      </Div>
    </Aside>
  );
}
// <Button type="nav">
//   <NavLink to="stats">Statistics</NavLink>
// </Button>;

export default SideBar;
