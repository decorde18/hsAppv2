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

// .nav a:link,
// .nav a:visited {
//   display: block;
//   color: inherit;
//   text-decoration: none;
//   text-transform: uppercase;
//   font-size: 1.2rem;
//   font-weight: 700;
//   padding: 0.5rem 2rem;
//   border-radius: 5px;
// }

// /* CSS Modules feature */
// .nav a:global(.active) {
//   background-color: var(--color-dark--0);
// }

function AppNav() {
  return (
    <Ul>
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

// .nav {
//   margin-top: 1rem;
//   margin-bottom: 1rem;
// }

// .nav ul {
//   list-style: none;
//   display: flex;
//   background-color: var(--color-dark--2);
//   border-radius: 7px;
// }

// .nav a:link,
// .nav a:visited {
//   display: block;
//   color: inherit;
//   text-decoration: none;
//   text-transform: uppercase;
//   font-size: 1.2rem;
//   font-weight: 700;
//   padding: 0.5rem 2rem;
//   border-radius: 5px;
// }

// /* CSS Modules feature */
// .nav a:global(.active) {
//   background-color: var(--color-dark--0);
// }
