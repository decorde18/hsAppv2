import { styled } from 'styled-components';

import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

import { NavLink } from 'react-router-dom';

import SeasonSelector from './SeasonSelector';

import Button from '../../ui/Button';
import { useAppNavContext } from '../../contexts/AppNavContext';

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

function AppNav() {
  const { currentSeason } = useCurrentSeason();
  const { active, handleToggle, menuButtons } = useAppNavContext();

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
