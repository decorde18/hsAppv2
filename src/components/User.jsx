import { NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from "../contexts/FakeAuthContexts";
import styles from './User.module.css';

function User() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  function handleClick() {
    logout();
    navigate('/');
  }

  return (
    <div className={styles.user}>
      {/* <img src={user.avatar} alt={user.name} /> */}
      {/* <span>Welcome, {user.name}</span> */}
      {!isAuthenticated ? (
        <NavLink to="/login" className={styles.ctaLink}>
          Login
        </NavLink>
      ) : (
        <button onClick={handleClick}>Logout</button>
      )}
    </div>
  );
}

export default User;
