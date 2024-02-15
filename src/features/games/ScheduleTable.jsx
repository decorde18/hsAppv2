import styled from 'styled-components';
import Spinner from '../../ui/Spinner';
import { useGamesSeason } from './useGames';

import Table from '../../ui/Table';
import Empty from '../../ui/Empty';
import ScheduleRow from './ScheduleRow';
import Heading from '../../ui/Heading';
import { useSeason } from '../seasons/useSeasons';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

const Right = styled.div`
  text-align: right;
`;

function ScheduleTable() {
  const { currentSeason } = useCurrentSeason();

  const { isLoadingSeason, season } = useSeason(currentSeason);
  const { isLoadingGamesSeason, gamesSeason } = useGamesSeason(currentSeason);
  //TODO FUTURE break schedule into {season.teamLevels["Varsity","JV"] and cycle through
  if (isLoadingGamesSeason /*|| isLoadingRecent*/ || isLoadingSeason)
    return <Spinner />;
  if (!season) return <div>Sorry You Must Have A Season Selected</div>;
  if (!gamesSeason.length) return <Empty resource="Games" />;
  return (
    <>
      <Heading as="h2" location="center">
        Independence High School Girls&#39; <br></br>
        {`Soccer Season ${season.season}`}
      </Heading>
      <Heading as="h3">Varsity Schedule</Heading>
      <Table columns="2px 49px 50px 180px 150px 1fr 2px">
        <Table.PrintHeader>
          <div></div>
          <Right>Date</Right>
          <Right>Time</Right>
          <div>Opponent</div>
          <div>Location</div>
          <div>Comments</div>
          <div></div>
        </Table.PrintHeader>
        <Table.Body
          data={gamesSeason.filter((game) => game.teamType === 'Varsity')}
          render={(game) => <ScheduleRow game={game} key={game.id} />}
        />
      </Table>
      <Heading as="h3">Junior Varsity Schedule</Heading>
      <Table columns="2px 49px 50px 180px 150px 1fr 2px">
        <Table.PrintHeader>
          <div></div>
          <div>Date</div>
          <div>Time</div>
          <div>Opponent</div>
          <div>Location</div>
          <div>Comments</div>
          <div></div>
        </Table.PrintHeader>
        <Table.Body
          data={gamesSeason.filter((game) => game.teamType === 'JV')}
          render={(game) => <ScheduleRow game={game} key={game.id} />}
        />
      </Table>
      <p>*- Denotes District Game</p>
      <p>S- Denotes Pre Season Scrimmage</p>
    </>
  );
}
export default ScheduleTable;
