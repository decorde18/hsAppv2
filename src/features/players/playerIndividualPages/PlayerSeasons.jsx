import styled from 'styled-components';

import Heading from '../../../ui/Heading';

const Main = styled.section`
  padding: 2rem;
  overflow: auto;
`;
const Flex = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 1rem;
`;
const SubFlex = styled.div`
  width: 100%;
  display: flex;
  gap: 0.25rem;
`;
const Value = styled.div`
  font-weight: 700;
`;

function PlayerSeasons({ seasonsPlayer, handleSeasonChange, seasons, season }) {
  const sortedSeasons = seasonsPlayer
    .map((seas) => ({
      ...seas,
      teamLevel: seas.teamLevel ? seas.teamLevel.join(' / ') : null,
    }))
    .sort((a, b) => b.grade - a.grade);

  return (
    <>
      <Heading as="h2" case="upper" location="center">
        SEASONS
      </Heading>
      <Main>
        {sortedSeasons.map((seas) => {
          const curSeason = seasons.find((cur) => seas.seasonId === cur.id);
          return (
            <Flex
              key={`seasonPlayer-${seas.seasonId}`}
              id={seas.seasonId}
              onClick={(e) => handleSeasonChange(e.currentTarget.id)}
              style={
                +seas.seasonId === +season.id
                  ? { backgroundColor: 'var(--color-grey-50)' }
                  : null
              }
            >
              <SubFlex>
                <div>Season:</div>
                <Value>{curSeason.season}</Value>
              </SubFlex>
              <SubFlex>
                <div>Number:</div>
                <Value>
                  {seas.number}
                  {seas.secondnumber && <span> / {seas.secondnumber}</span>}
                  {seas.gknumber && <span> / GK:{seas.gknumber}</span>}
                </Value>
              </SubFlex>
              <SubFlex>
                <div>Grade:</div>
                <Value>{seas.grade}</Value>
              </SubFlex>
              <SubFlex>
                <div>Team:</div>
                <Value>{seas.teamLevel}</Value>
              </SubFlex>
              <SubFlex>
                <div>Position:</div>
                <Value>{seas.position}</Value>
              </SubFlex>
              <SubFlex>
                <div>Status:</div>
                <Value>{seas.status}</Value>
              </SubFlex>
            </Flex>
          );
        })}
      </Main>
    </>
  );
}

export default PlayerSeasons;
