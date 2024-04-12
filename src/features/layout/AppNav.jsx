import { styled } from 'styled-components';

import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import SeasonSelector from './SeasonSelector';

import Button from '../../ui/Button';

const Ul = styled.ul`
  width: 80%;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  gap: 10rem;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-md);
`;
const Flex = styled.div`
  display: flex;
  justify-content: center;
`;

const menuButtons = [
  { name: 'Main', link: 'seasonMain' },
  { name: 'Players', link: 'players' },
  { name: 'Games', link: 'games' },
  { name: 'Statistics', link: 'stats' },
  { name: 'Other', link: 'seasonMain' },
];

function AppNav() {
  const { currentSeason } = useCurrentSeason();
  const result = /[^/]*$/.exec(window.location.href)[0].split('?')[0];
  //grab the series of characters not containing a slash" ([^/]*)at the end of the string ($). Then it grabs the matched characters from the returned match object by indexing into it ([0]); then get what is before the ?
  const [active, setActive] = useState();
  useEffect(
    () =>
      setActive(
        menuButtons.find((url) => result === url.link)?.name || 'Other'
      ),
    [result]
  );
  function handleToggle(e) {
    e.target.name === 'Other' ? setActive('Main') : setActive(e.target.name);
  }
  return (
    <>
      <Ul>
        <SeasonSelector />
        <Flex>
          {menuButtons.map((button) => {
            return (
              <NavLink
                to={`${button.link}?season=${currentSeason}`}
                name={button.name}
                key={`${button.name}btn`}
              >
                <li>
                  <Button
                    name={button.name}
                    size="large"
                    variation={active === button.name ? 'primary' : 'secondary'}
                    onClick={handleToggle}
                  >
                    {button.name}
                  </Button>
                </li>
              </NavLink>
            );
          })}
        </Flex>
      </Ul>
    </>
  );
}
export default AppNav;
