import styles from "./SubNav.module.css";
function SubNav() {
  return (
    <div className={styles.nav}>
      <ul>
        <li>
          <div className={styles.btn}>Season</div>
        </li>
        <li>
          <div className={styles.btn}>All-Time</div>
        </li>
      </ul>
    </div>
  );
}

export default SubNav;
