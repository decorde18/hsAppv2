import styles from "./Players.module.css";
import { usePlayers } from "../contexts/PlayersContexts";
import Spinner from "./Spinner";
import PlayerItem from "./PlayerItem";
import Message from "./Message";
import Button from "./Button";
import { Outlet } from "react-router-dom";
import SubNav from "./SubNav";

function Players() {
  const { players, isLoading } = usePlayers();
  if (isLoading) return <Spinner />;
  if (!players.length) return <Message message='Add your first player' />;
  return (
    <>
      <SubNav />
      <ul className={styles.playerList}>
        {players.map((player) => (
          <PlayerItem player={player} key={player.id} />
        ))}
      </ul>
    </>
  );
}

export default Players;
