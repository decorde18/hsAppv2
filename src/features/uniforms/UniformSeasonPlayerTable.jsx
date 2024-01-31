import { useState } from 'react';
import Empty from '../../ui/Empty';
import Menus from '../../ui/Menus';
import Spinner from '../../ui/Spinner';
import Table from '../../ui/Table';
import UniformSeasonPlayerRow from './UniformSeasonPlayerRow';
import {
  useUniformSeasonPlayers,
  useUniformSeason,
  useUniformJerseys,
} from './useUniforms';
import { styled } from 'styled-components';

const Div = styled.div`
  display: flex;
`;

const currentSeason = +localStorage.getItem('currentSeason');
function UniformSeasonPlayerTable() {
  const [selectedTeam, setSelectedTeam] = useState('Varsity');

  const { isLoadingUniformSeasonPlayers, uniformSeasonPlayers } =
    useUniformSeasonPlayers();
  const { isLoadingUniformSeason, uniformSeason } =
    useUniformSeason(currentSeason);
  const { isLoadingUniformJerseys, uniformJerseys } = useUniformJerseys();

  function handleTeamChange(e) {
    setSelectedTeam(e.target.value);
  }
  if (
    isLoadingUniformSeasonPlayers ||
    isLoadingUniformSeason ||
    isLoadingUniformJerseys
  )
    return <Spinner />;
  if (!uniformSeasonPlayers.length) return <Empty resource="Uniform Jerseys" />;
  const uniqueUniformsSet = Array.from(
    new Set(uniformSeason.map((item) => item.team))
  );

  return (
    <>
      <select defaultValue="default" onChange={handleTeamChange}>
        {uniqueUniformsSet.map((unique) => (
          <option key={unique} value={unique}>
            {unique}
          </option>
        ))}
      </select>
      <Div>
        {uniformSeason
          .filter((team) => team.team === selectedTeam)
          .map((jersey) => (
            <Menus key={jersey.id}>
              <Table columns="0.25fr 1fr 1fr 1fr 0.25fr;">
                <Table.Header>
                  <div></div>
                  <div>Number</div>
                  <div>Size</div>
                  <div>Available</div>
                  <div></div>
                </Table.Header>
                <Table.Body
                  data={uniformJerseys}
                  render={(uniformSeason) =>
                    uniformSeason.uniform === jersey.id ? (
                      <UniformSeasonPlayerRow
                        uniformSeason={uniformSeason}
                        key={uniformSeason.id}
                      />
                    ) : null
                  }
                />
              </Table>
            </Menus>
          ))}
      </Div>
    </>
  );
}

export default UniformSeasonPlayerTable;
