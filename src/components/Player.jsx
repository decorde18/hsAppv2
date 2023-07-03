import { Link, useParams } from "react-router-dom";
import styles from "./Player.module.css";
import { usePlayers } from "../contexts/PlayersContexts";
import Spinner from "./Spinner";
import BackButton from "./BackButton";
import { useEffect } from "react";

function Player() {
  const { id } = useParams(); // destructured based on what we called it in App path='players/:id'
  const { currentPlayer, getPlayer, isLoading } = usePlayers();
  // console.log(currentPlayer);
  useEffect(
    function () {
      getPlayer(id);
    },
    [id, getPlayer]
  );
  if (isLoading) return <Spinner />;
  return (
    <div>
      <h2>
        {currentPlayer.first_name} {currentPlayer.last_name}
      </h2>
      <div>{<BackButton />}</div>
    </div>
  );
}
export default Player;
