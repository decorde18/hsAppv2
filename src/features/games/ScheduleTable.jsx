import styled from 'styled-components';
import Spinner from '../../ui/Spinner';
import { useGamesSeason } from './useGames';

import Table from '../../ui/Table';
import Empty from '../../ui/Empty';
import ScheduleRow from './ScheduleRow';
import { useSearchParams } from 'react-router-dom';
import Heading from '../../ui/Heading';
import { useRecentSeason, useSeason } from '../seasons/useSeasons';

const Right = styled.div`
  text-align: right;
`;

function ScheduleTable() {
  //TODO FUTURE ---need to create context provider in App for recent season... currently it is read in SeasonSelector, move to App --- if no searchParam, use Recent once it loads
  // const { isLoadingRecent, recentSeason } = useRecentSeason();
  const [searchParams] = useSearchParams();

  // if (!searchParams.get('season')) searchParams.set('season', recentSeason.id);
  const season = searchParams.get('season');
  const { isLoadingSeason, season: seasonApi } = useSeason(season);
  const { isLoadingGamesSeason, gamesSeason } = useGamesSeason(season);
  if (!season) return <div>Sorry You Must Have A Season Selected</div>;
  //TODO FUTURE break schedule into {seasonApi.teamLevels["Varsity","JV"] and cycle through
  if (isLoadingGamesSeason /*|| isLoadingRecent*/ || isLoadingSeason)
    return <Spinner />;
  if (!gamesSeason.length) return <Empty resource="Games" />;
  return (
    <>
      <Heading as="h2" location="center">
        Independence High School Girls&#39; <br></br>Soccer Season{' '}
        {seasonApi.season}
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
    </>
  );
}
export default ScheduleTable;
