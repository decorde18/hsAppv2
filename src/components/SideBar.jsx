import { styled } from 'styled-components';
import Button from '../ui/Button';
import { NavLink } from 'react-router-dom';
import { useCurrentSeason } from '../contexts/CurrentSeasonContext';
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
  const { currentSeason } = useCurrentSeason();

  return (
    <Aside>
      <Div>
        <Button type="sideNav">
          <NavLink to={`../roster?season=${currentSeason}`} target="_blank">
            Print Roster
          </NavLink>
        </Button>
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
        <Button type="sideNav">
          <NavLink to={`./uniforms`}>Uniform Data</NavLink>
        </Button>
        <Button type="sideNav">
          <NavLink to={`./uniformJerseys`}>Uniform Jerseys</NavLink>
        </Button>
        <Button type="sideNav">
          <NavLink to={`./uniformSeasonPlayers`}>Uniform Assignments</NavLink>
        </Button>
        <Button type="sideNav">
          <NavLink to={`./uniformSeasons`}>Uniform Seasons</NavLink>
        </Button>
        <Button type="sideNav">
          <NavLink to={`./scheduleHelper`}>Schedule Helper</NavLink>
        </Button>
      </Div>
    </Aside>
  );
}

export default SideBar;
