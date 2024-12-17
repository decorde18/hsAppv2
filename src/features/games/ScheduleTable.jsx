import styled from 'styled-components';

import Spinner from '../../ui/Spinner';
import Table from '../../ui/Table';
import Heading from '../../ui/Heading';
import Empty from '../../ui/Empty';

import ScheduleRow from './ScheduleRow';

import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import { useData } from '../../services/useUniversal';

const PrintStyle = styled.div`
  @media screen {
    margin: 0;
    padding: 1rem 2rem;
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-lg);
    max-height: 95dvh;
    overflow: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
  }
  @media print {
  }
`;
const Right = styled.div`
  text-align: right;
`;

function ScheduleTable() {
  const { currentSeason } = useCurrentSeason();
  const { isLoading: isLoadingGamesSeason, data: gamesSeason } = useData({
    table: 'games',
    filter: [{ field: 'seasonId', value: currentSeason.id }],
  });

  if (isLoadingGamesSeason) return <Spinner />;
  if (!gamesSeason.length) return <Empty resource="Games" />;

  return (
    <PrintStyle>
      <Heading as="h2" location="center">
        Independence High School Girls&#39; <br></br>
        {`Soccer Season ${currentSeason.season}`}
      </Heading>
      {currentSeason.teamLevels.map((team) => (
        <div key={team}>
          <Heading as="h3">{`${team} Schedule`}</Heading>
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
              data={gamesSeason.filter((game) => game.teamType === team)}
              render={(game) => <ScheduleRow game={game} key={game.id} />}
            />
          </Table>
        </div>
      ))}

      <p>*- Denotes District Game</p>
      <p>S- Denotes Pre Season Scrimmage</p>
    </PrintStyle>
  );
}
export default ScheduleTable;
