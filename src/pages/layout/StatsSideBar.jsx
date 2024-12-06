import { styled } from 'styled-components';
import Button from '../../ui/Button';
import { NavLink } from 'react-router-dom';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import { useAppNavContext } from '../../contexts/AppNavContext';
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
  /* justify-content: center; */
  /* align-items: center; */
  gap: 1rem;
  /* width: 100%; */
`;

function StatsSideBar() {
  const { currentSeason } = useCurrentSeason();
  const { active } = useAppNavContext();

  const sideBarButtons = [
    {
      name: 'printRoster',
      link: `../roster?season=${currentSeason}`,
      text: 'Print Roster',
      newWindow: true,
      appNav: 'Main',
    },
    {
      name: 'printSchedule',
      link: `../schedule?season=${currentSeason}`,
      text: 'Print Schedule',
      newWindow: true,
      appNav: 'Main',
    },
    {
      name: 'tssaaRoster',
      link: `../protected/rosterTSSAA?season=${currentSeason}`,
      text: 'TSSAA Roster',
      newWindow: true,
      appNav: 'Main',
    },
    {
      name: 'communication',
      link: `./communication?season=${currentSeason}`,
      text: 'Communication',
      newWindow: false,
      appNav: 'Main',
    },
    {
      name: 'people',
      link: `./people`,
      text: 'People',
      newWindow: false,
      appNav: 'Main',
    },
    {
      name: 'uniformData',
      link: `./uniforms`,
      text: 'Uniform Data',
      newWindow: false,
      appNav: 'Season',
    },

    {
      name: 'scheduleHelper',
      link: `./scheduleHelper`,
      text: 'Schedule Helper',
      newWindow: false,
      appNav: 'Main',
    },
    {
      name: 'events',
      link: `./events`,
      text: 'Events',
      newWindow: false,
      appNav: 'Main',
    },
  ];

  return (
    <Aside>
      <Div>
        {sideBarButtons
          .filter((button) => button.appNav === active)
          .map((button) => {
            return (
              <NavLink
                key={`${button.name}sidebar`}
                to={button.link}
                target={button.newWindow ? '_blank' : null}
              >
                <Button
                  type="fullWidth"
                  variation="secondary"
                  name={button.name}
                >
                  {button.text}
                </Button>
              </NavLink>
            );
          })}
      </Div>
    </Aside>
  );
}

export default StatsSideBar;
