import { NavLink } from 'react-router-dom';
import styles from './AppNav.module.css';
import Button from './Button';

//TODO see Wild Oasis Sidebar for navlink and hover, active etc
function AppNav() {
  return (
    <ul className=" m-1 flex grow items-center justify-center text-white">
      <li>
        <Button type="nav">
          <NavLink to="players">Players</NavLink>
        </Button>
      </li>
      <li>
        <Button type="nav">
          <NavLink to="games">Games</NavLink>
        </Button>
      </li>
      <li>
        <Button type="nav">
          <NavLink to="stats">Statistics</NavLink>
        </Button>
      </li>
      <li>
        <Button type="nav">Other</Button>
      </li>
    </ul>
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
