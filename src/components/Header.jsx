import styles from './Header.module.css';
// import User from '../components/User';
import Logo from './Logo';
import SeasonSelector from '../features/seasons/SeasonSelector';
// import { useAuth } from '../contexts/FakeAuthContexts';

function Header() {
  // const { isAuthenticated } = useAuth();
  return (
    <header className="relative mb-2">
      <Logo></Logo>
      <div className="flex h-full flex-col">
        <h1 className="mt-10 text-4xl font-bold text-navy">
          INDEPENDENCE GIRLS SOCCER
        </h1>
        <div className="mb-5 mt-auto">
          <SeasonSelector />
        </div>
      </div>
      {/* {isAuthenticated ? <User /> : null} */}
    </header>
  );
}

export default Header;
