import { styled } from 'styled-components';

import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

import { NavLink } from 'react-router-dom';

import SeasonSelector from './SeasonSelector';

import Button from '../../ui/Button';
import { useAppNavContext } from '../../contexts/AppNavContext';

const Section = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: auto 1fr;
`;
const Select = styled.div`
  padding: 0.5rem;
  cursor: pointer;
`;
const Nav = styled.nav`
  display: flex;
  gap: 1rem;
  overflow-x: auto; /* Allows horizontal scrolling for buttons */
  scrollbar-width: thin; /* Styling for modern browsers */
  padding: 0.5rem 0;
  flex-grow: 1;
  white-space: nowrap; /* Prevent buttons from wrapping */
`;

function AppNav() {
  const { currentSeason } = useCurrentSeason();
  const { active, handleToggle, menuButtons } = useAppNavContext();

  return (
    <Section>
      <Select>
        <SeasonSelector />
      </Select>
      <Nav>
        {menuButtons.map((button) => {
          return (
            <NavLink
              to={`${button.link}?season=${currentSeason.id}`}
              name={button.name}
              key={`${button.name}btn`}
            >
              <Button
                name={button.name}
                size="large"
                variation={active === button.name ? 'primary' : 'secondary'}
                onClick={handleToggle}
              >
                {button.name}
              </Button>
            </NavLink>
          );
        })}
      </Nav>
    </Section>
  );
}
export default AppNav;
