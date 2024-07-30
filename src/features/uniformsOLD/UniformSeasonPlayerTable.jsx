import { useState } from 'react';
import Empty from '../../ui/Empty';
import Menus from '../../ui/Menus';
import Spinner from '../../ui/Spinner';
import Table from '../../ui/Table';

import { styled } from 'styled-components';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import { useData } from '../../services/useUniversal';
import UniformSeasonPlayerRow from './UniformSeasonPlayerRow';
import Heading from '../../ui/Heading';

const sizes = ['S', 'M', 'L', 'XL'];

const Div = styled.div`
  display: flex;
`;

function UniformSeasonPlayerTable() {
  const { currentSeason } = useCurrentSeason();

  const [selectedTeam, setSelectedTeam] = useState('Varsity');

  const {
    isLoading: isLoadingUniformSeasonPlayers,
    data: uniformSeasonPlayers,
  } = useData({
    table: 'uniformSeasonPlayers',
    filter: [{ field: 'season', value: currentSeason }],
  });
  const { isLoading: isLoadingUniformSeason, data: uniformSeason } = useData({
    table: 'uniformSeasons',
    filter: [{ field: 'season', value: currentSeason }],
  });
  const { isLoading: isLoadingUniformJerseys, data: uniformJerseys } = useData({
    table: 'uniformJerseys',
    filter: [
      { field: 'type', value: 'Jersey' },
      { field: 'active', value: true },
    ],
    sort: [{ field: 'number' }],
  });

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

  const activeUniforms = [
    ...new Set(uniformJerseys.map((jersey) => jersey.uniformid)),
  ];
  const uniforms = activeUniforms.map((uniformid) =>
    uniformJerseys.find((uniform) => uniformid === uniform.uniformid)
  );

  const uniformsBySize = sizes.map((size) => ({
    size,
    numbers: uniformJerseys
      .filter(
        (jersey) =>
          jersey.size === size && jersey.uniformid === activeUniforms[0] //todo future only uses the first uniform
      )
      .map((jersey) => jersey.number),
  }));

  const availableUniforms = uniformSeasonPlayers.filter(
    (uniform) =>
      !uniform.seasonPlayer &&
      uniform.type === 'Jersey' &&
      uniform.uniformid === activeUniforms[0]
  );
  const availableUniformsBySize = uniformJerseys.filter(
    (uniform) =>
      uniform.jerseyid ===
      uniformSeason
        .filter((uniform) => !uniform.seasonPlayer)
        .some((uniform) => uniform.jerseyid)
  );
  console.log(uniformSeasonPlayers);
  //todo future if varsity shirts don't match ie 3 in navy is large and 3 in white is medium or lost, allow player to choose a different number for that color
  return (
    <>
      <Div>
        {uniformsBySize.map((jerseys) => (
          <div key={jerseys.size}>
            <Heading as={'h2'}>{jerseys.size}</Heading>
            <div>{JSON.stringify(jerseys.numbers)}</div>
          </div>
        ))}
      </Div>
      <Div>
        {uniforms.map((uniform) => (
          <Menus key={uniform.uniformid}>
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
                  uniformSeason.uniformid === uniform.uniformid ? (
                    <UniformSeasonPlayerRow
                      uniformSeason={uniformSeason}
                      key={uniformSeason.uniformid}
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
  // return (
  //   <>
  //     {/* <select defaultValue="default" onChange={handleTeamChange}>
  //       {uniqueUniformsSet.map((unique) => (
  //         <option key={unique} value={unique}>
  //           {unique}
  //         </option>
  //       ))}
  //     </select> */}
  //     <Div>
  //       {uniformSeason.map((jersey) => (
  //         <Menus key={jersey.id}>
  //           <Table columns="0.25fr 1fr 1fr 1fr 0.25fr;">
  //             <Table.Header>
  //               <div></div>
  //               <div>Number</div>
  //               <div>Size</div>
  //               <div>Available</div>
  //               <div></div>
  //             </Table.Header>
  //             <Table.Body
  //               data={uniformJerseys}
  //               render={(uniformSeason) =>
  //                 uniformSeason.uniformid === jersey.id ? (
  //                   <UniformSeasonPlayerRow
  //                     uniformSeason={uniformSeason}
  //                     key={uniformSeason.uniformid}
  //                   />
  //                 ) : null
  //               }
  //             />
  //           </Table>
  //         </Menus>
  //       ))}
  //     </Div>
  //   </>
  // );
}

export default UniformSeasonPlayerTable;
