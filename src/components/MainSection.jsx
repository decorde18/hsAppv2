import { Outlet } from 'react-router-dom';
import styles from './MainSection.module.css';
import AppNav from './AppNav';
function MainSection() {
  return (
    <div className="relative mr-4 h-full grow border border-gray1 px-2 py-1">
      <AppNav></AppNav>
      <Outlet></Outlet>
    </div>
  );
}

export default MainSection;

// flex-basis: 56rem;

// display: flex;
// flex-direction: column;
// align-items: center;
