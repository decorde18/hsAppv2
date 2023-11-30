import { NavLink } from 'react-router-dom';
import { styled } from 'styled-components';
import Button from './Button';

//TODO see Wild Oasis Sidebar for navlink and hover, active etc

const Ul = styled.ul`
  display: flex;
  justify-content: center;
  background-color: var(--color-light--2);
  border-radius: 7px;
  margin: 1rem;
  padding: 1rem;
`;

const Li = styled.li``;

function AppNav() {
  return (
    <Ul>
      <Li>
        <Button type="nav">
          <NavLink to="seasonMain">Main</NavLink>
        </Button>
      </Li>
      <Li>
        <Button type="nav">
          <NavLink to="players">Players</NavLink>
        </Button>
      </Li>
      <Li>
        <Button type="nav">
          <NavLink to="games">Games</NavLink>
        </Button>
      </Li>
      <Li>
        <Button type="nav">
          <NavLink to="stats">Statistics</NavLink>
        </Button>
      </Li>
      <Li>
        <Button type="nav">Other</Button>
      </Li>
    </Ul>
  );
}

export default AppNav;
