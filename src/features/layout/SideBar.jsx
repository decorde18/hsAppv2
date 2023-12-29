import { styled } from 'styled-components';
import Button from '../../ui/Button';
import { NavLink } from 'react-router-dom';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
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

  const sideBarButtons = [
    {
      name: 'printRoster',
      link: `../roster?season=${currentSeason}`,
      text: 'Print Roster',
      newWindow: true,
    },
    {
      name: 'printSchedule',
      link: `../schedule?season=${currentSeason}`,
      text: 'Print Schedule',
      newWindow: true,
    },
    {
      name: 'tssaaRoster',
      link: `../protected/rosterTSSAA?season=${currentSeason}`,
      text: 'TSSAA Roster',
      newWindow: true,
    },
    {
      name: 'communication',
      link: `./communication?season=${currentSeason}`,
      text: 'Communication',
      newWindow: false,
    },
    {
      name: 'people',
      link: `./people`,
      text: 'People',
      newWindow: false,
    },
    {
      name: 'uniformData',
      link: `./uniforms`,
      text: 'Uniform Data',
      newWindow: false,
    },
    {
      name: 'uniformJerseys',
      link: `./uniformJerseys`,
      text: 'Uniform Jerseys',
      newWindow: false,
    },
    {
      name: 'uniformAssignments',
      link: `./uniformSeasonPlayers`,
      text: 'Uniform Assignments',
      newWindow: false,
    },
    {
      name: 'uniformSeasons',
      link: `./uniformSeasons`,
      text: 'Uniform Seasons',
      newWindow: false,
    },
    {
      name: 'scheduleHelper',
      link: `./scheduleHelper`,
      text: 'Schedule Helper',
      newWindow: false,
    },
    {
      name: 'events',
      link: `./events`,
      text: 'Events',
      newWindow: false,
    },
  ];

  return (
    <Aside>
      <Div>
        {sideBarButtons.map((button) => {
          return (
            <Button
              key={`${button.name}sidebar`}
              type="fullWidth"
              variation="secondary"
              name={button.name}
            >
              <NavLink
                to={button.link}
                target={button.newWindow ? '_blank' : null}
              >
                {button.text}
              </NavLink>
            </Button>
          );
        })}
      </Div>
    </Aside>
  );
}

export default SideBar;
