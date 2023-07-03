import { Link, NavLink, Outlet } from "react-router-dom";
import styles from "./PlayerItem.module.css";
import { usePlayers } from "../contexts/PlayersContexts";

function PlayerItem({ player }) {
  const { currentPlayer, deletePlayer } = usePlayers();
  const { first_name: firstName, last_name: lastName, id } = player;

  function handleClick(e) {
    e.preventDefault();
    deletePlayer(id);
  }

  return (
    <li>
      <Link
        className={`${styles.playerItem} ${
          id === currentPlayer.id ? styles["playerItem--active"] : ""
        }`}
        to={`${id}`}
      >
        <h3 className={styles.name}>
          {firstName} {lastName}
        </h3>
        <p>{player.date_of_birth}</p>
        <p>{player.cell}</p>
        <p>{player.email}</p>
        <p>{player.entry_year}</p>
        <button className={styles.deleteBtn} onClick={handleClick}>
          &times;
        </button>
      </Link>
    </li>
  );
}
export default PlayerItem;
