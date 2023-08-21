import styled from 'styled-components';
import Spinner from '../../ui/Spinner';

import { useSeason } from '../seasons/useSeasons';
import { usePlayerSeasons } from './usePlayerSeasons';

import Table from '../../ui/Table';
import Empty from '../../ui/Empty';

import { useSearchParams } from 'react-router-dom';
import Heading from '../../ui/Heading';
import PublicPlayerRow from './PublicPlayerRow';
import {
  useUniformSeasons,
  useUniformSeasonPlayers,
} from '../uniforms/useUniforms';
import { useEffect, useState } from 'react';

const Right = styled.div`
  text-align: right;
`;
const Center = styled.div`
  text-align: center;
  width: 100%;
`;
const Div = styled.div`
  display: flex;
  gap: 50px;
  padding-bottom: 2.5rem;
`;
const People = styled.div`
  font-size: 1.3rem;
`;
function PublicPlayerTable() {
  const [searchParams] = useSearchParams();
  const season = searchParams.get('season');
  const { isLoadingSeason, season: seasonApi } = useSeason(season);
  const { isLoadingUniformSeasonPlayers, uniformSeasonPlayers } =
    useUniformSeasonPlayers();
  const { isLoadingPlayerSeasons, playerSeasons } = usePlayerSeasons();
  const { uniformSeasons } = useUniformSeasons();

  if (!season) return <div>Sorry You Must Have A Season Selected</div>;
  if (isLoadingPlayerSeasons || isLoadingSeason) return <Spinner />;
  if (!playerSeasons.length) return <Empty resource="Players" />;

  const roster = playerSeasons.filter(
    (player) => +player.seasonId === +season && player.status === 'Rostered'
  );
  // .sort((a, b) => +a.grade - +b.grade);
  const gkUnis = uniformSeasons.find(
    (uni) =>
      uni.season === +season &&
      uni.team === 'GK' &&
      uni.uniforms.type === 'GK Jersey'
  );
  const rosteredWithNumber = roster
    .map((player) => ({
      ...player,
      uniform: uniformSeasonPlayers.find(
        (jersey) => jersey.seasonPlayer === player.id
      ),
    }))
    .sort(
      (a, b) =>
        +a.uniform?.uniformJerseys.number - +b.uniform?.uniformJerseys.number
    );
  const rosteredWithNumberGk = roster
    .map((player) => ({
      ...player,
      uniform: uniformSeasonPlayers.find(
        (jersey) =>
          jersey.uniformJerseys.uniform == gkUnis.uniform &&
          jersey.seasonPlayer === player.id
      ),
    }))
    .sort(
      (a, b) =>
        +a.uniform?.uniformJerseys.number - +b.uniform?.uniformJerseys.number
    )
    .filter((player) => player.uniform);

  return (
    <>
      <Heading as="h2" location="center">
        Independence High School Girls&#39; <br></br>Soccer Season{' '}
        {seasonApi.season}
      </Heading>
      <Div>
        <div>
          <Heading as="h3">Varsity Roster</Heading>
          <Table columns=".25fr .5fr 2fr .5fr .75fr">
            <Table.PrintHeader>
              <div></div>
              <div>#</div>
              <Center>Player Name</Center>

              <Center>Grade</Center>
              <Center>Pos</Center>
            </Table.PrintHeader>
            <Table.Body
              data={rosteredWithNumber.filter((player) =>
                player.teamLevel.includes('Varsity')
              )}
              render={(player) => (
                <PublicPlayerRow player={player} key={`V-${player.id}`} />
              )}
            />
          </Table>
        </div>
        <div>
          <Heading as="h3">JV Roster</Heading>
          <Table columns=".25fr .5fr 2fr .5fr .75fr">
            <Table.PrintHeader>
              <div></div>
              <div>#</div>
              <Center>Player Name</Center>

              <Center>Grade</Center>
              <Center>Pos</Center>
            </Table.PrintHeader>
            <Table.Body
              data={rosteredWithNumber.filter((player) =>
                player.teamLevel.includes('JV')
              )}
              render={(player) => (
                <PublicPlayerRow player={player} key={`JV-${player.id}`} />
              )}
            />
          </Table>
        </div>
      </Div>
      <Div>
        <div>
          {' '}
          <Heading as="h3">GK</Heading>
          <Table columns=".25fr .5fr 2fr .5fr .75fr">
            <Table.PrintHeader>
              <div></div>
              <div>#</div>
              <Center>Player Name</Center>

              <Center>Grade</Center>
              <Center></Center>
            </Table.PrintHeader>
            <Table.Body
              data={rosteredWithNumberGk.filter((player) =>
                player.teamLevel.includes('Varsity')
              )}
              render={(player) => (
                <PublicPlayerRow player={player} key={`V-GK-${player.id}`} />
              )}
            />
          </Table>
        </div>
        <div>
          <Heading as="h3">GK</Heading>
          <Table columns=".25fr .5fr 2fr .5fr .75fr">
            <Table.PrintHeader>
              <div></div>
              <div>#</div>
              <Center>Player Name</Center>

              <Center>Grade</Center>
              <Center></Center>
            </Table.PrintHeader>
            <Table.Body
              data={rosteredWithNumberGk.filter((player) =>
                player.teamLevel.includes('JV')
              )}
              render={(player) => (
                <PublicPlayerRow player={player} key={`JV-GK-${player.id}`} />
              )}
            />
          </Table>
        </div>
      </Div>
      <Div>
        <div>
          <Heading as="h3">Team Personnel</Heading>
          <People>
            <strong>Head Coach:</strong>
            <span>
              {' '}
              {`${seasonApi.people.firstName} ${seasonApi.people.lastName}`}
            </span>
          </People>
          <People>
            <strong>Assistant Coaches:</strong>
            <span> {seasonApi.assistant_coaches}</span>
          </People>
          {seasonApi.manager ? (
            <div>
              <strong>Managers:</strong>
              <span> {seasonApi.manager}</span>
            </div>
          ) : (
            <div></div>
          )}
          <People>
            <strong>Trainer:</strong>
            <span> {seasonApi.trainer}</span>
          </People>
        </div>
        <div>
          <Heading as="h3">Administration</Heading>
          <People>
            <strong>Principal:</strong>
            <span> {seasonApi.principal}</span>
          </People>
          <People>
            <strong>Assistant Principals:</strong>
            <span> {seasonApi.assistantPrincipals}</span>
          </People>
          <People>
            <strong>Athletic Director:</strong>
            <span> {seasonApi.athleticDirector}</span>
          </People>
        </div>
      </Div>
    </>
  );
}

export default PublicPlayerTable;
