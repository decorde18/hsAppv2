import { useLoaderData } from 'react-router-dom';
// import { usePlayers } from '../../contexts/PlayersContexts';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { getSeason } from './seasonSlice';
import { getSeasons } from '../../services/apiSeasons';

//useSelector is how we read state from the store
function SeasonSelector() {
  const seasons = useLoaderData();
  const recentSeasonYear = seasons.reduce(
    (acc, season) => (acc > +season.season ? acc : season.season),
    []
  );
  const [recentSeason] = seasons.filter(
    (season) => +season.season === +recentSeasonYear
  );
  const [currentSeason, setCurrentSeason] = useState(+recentSeason.id);
  // const seasons = useSelector((state) => console.log(state));
  const dispatch = useDispatch();

  function handleSeasonChange(e) {
    setCurrentSeason(+e.target.value);
    dispatch(getSeason(+e.target.value));
  }
  return (
    <select
      defaultValue={currentSeason}
      onChange={handleSeasonChange}
      className="w-72 py-2 text-center text-xl"
    >
      <option value="createSeason">Add A New Season</option>
      {seasons
        .sort((a, b) => +b.season - +a.season)
        .map((season) => (
          <option value={season.id} key={season.id}>
            Season {season.season} ({season.schoolYear})
          </option>
        ))}
    </select>
  );
}
export async function loader() {
  // const seasons = await getSeasons();
  const seasons = getSeasons();
  return seasons;
}

export default SeasonSelector;
