import { NavLink } from 'react-router-dom';
import { styled } from 'styled-components';
import Button from '../../ui/Button';
import { useState } from 'react';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

const Ul = styled.ul`
  display: flex;
  justify-content: center;
  background-color: var(--color-light--2);
  border-radius: var(--border-radius-md);
  margin: 2rem;
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Li = styled.li``;

const menuButtons = [
  { name: 'Main', link: 'seasonMain' },
  { name: 'Players', link: 'players' },
  { name: 'Games', link: 'games' },
  { name: 'Statistics', link: 'stats' },
  { name: 'Other' },
];

function AppNav() {
  const { currentSeason } = useCurrentSeason();
  const [active, setActive] = useState('Main');
  function handleToggle(e) {
    setActive(e.target.name);
  }
  return (
    <Ul>
      {menuButtons.map((button) => {
        return (
          <NavLink
            to={`${button.link}?season=${currentSeason}`}
            name={button.name}
            key={`${button.name}btn`}
          >
            <Li>
              <Button
                size="large"
                variation={active === button.name ? 'primary' : 'secondary'}
                onClick={handleToggle}
              >
                {button.name}
              </Button>
            </Li>
          </NavLink>
        );
      })}
    </Ul>
  );
}
export default AppNav;
