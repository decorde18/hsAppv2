import { Link } from 'react-router-dom';
import styles from './Logo.module.css';

function Logo() {
  return (
    <Link to="/app">
      <img
        src="/public/img/logo.png"
        alt="IHS Soccer"
        className="absolute left-0 top-0 h-full pl-1 pt-1"
      />
    </Link>
  );
}

export default Logo;
