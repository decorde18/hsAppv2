import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

const BASE_URL = "http://localhost:9001";

const PlayersContext = createContext();

const initialState = {
  players: [],
  isLoading: false,
  currentPlayer: {},
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "players/loaded":
      return {
        ...state,
        isLoading: false,
        players: action.payload,
      };
    case "player/loaded":
      return {
        ...state,
        isLoading: false,
        currentPlayer: action.payload,
      };
    case "player/created":
      return {
        ...state,
        isLoading: false,
        players: [...state.players, action.payload],
        currentPlayer: action.payload,
      };
    case "player/deleted":
      return {
        ...state,
        isLoading: false,
        players: state.players.filter((player) => action.payload !== player.id),
        currentPlayer: {},
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}

function PlayersProvider({ children }) {
  const [{ players, isLoading, currentPlayer, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  useEffect(function () {
    async function fetchPlayers() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/players`);
        const data = await res.json();
        dispatch({ type: "players/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading players...",
        });
      }
    }
    fetchPlayers();
  }, []);

  const getPlayer = useCallback(
    async function getPlayer(id) {
      if (Number(id) === currentPlayer.id) return;
      try {
        // setisLoading(true);
        dispatch({ type: "loading" });
        const res = await fetch(`${BASE_URL}/players/${id}`);
        const data = await res.json();
        dispatch({ type: "player/loaded", payload: data });
        // setCurrentPlayer(data);
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading the Player...",
        });
      }
    },
    [currentPlayer.id]
  );
  async function createPlayer(newPlayer) {
    try {
      // setisLoading(true);
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/players`, {
        method: "POST",
        body: JSON.stringify(newPlayer),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      dispatch({ type: "player/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the player...",
      });
    }
  }
  async function deletePlayer(id) {
    dispatch({ type: "loading" });
    try {
      // setisLoading(true);
      await fetch(`${BASE_URL}/players/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "player/deleted", payload: id });
      // setPlayers((players) => players.filter((player) => player.id !== id));
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the player...",
      });
    }
  }
  return (
    <PlayersContext.Provider
      value={{
        players,
        isLoading,
        currentPlayer,
        getPlayer,
        createPlayer,
        deletePlayer,
        error,
      }}
    >
      {children}
    </PlayersContext.Provider>
  );
}
function usePlayers() {
  const context = useContext(PlayersContext);
  if (context === undefined)
    throw new Error("Players Context was used outside of the Players Provider");
  return context;
}

export { PlayersProvider, usePlayers };
