import { useState } from 'react';
import Empty from '../../ui/Empty';
import Menus from '../../ui/Menus';
import Select from '../../ui/Select';
import Spinner from '../../ui/Spinner';
import Table from '../../ui/Table';
import UniformSeasonRow from './UniformSeasonRow';
import { useUniformSeasons, useUniforms } from './useUniforms';

function UniformSeasonTable() {
  const [selectedJersey, setSelectedJersey] = useState('default');
  const currentSeason = +localStorage.getItem('currentSeason');
  const { isLoadingUniformSeasons, uniformSeasons } = useUniformSeasons();
  const { isLoadingUniforms, uniforms } = useUniforms();

  if (isLoadingUniformSeasons || isLoadingUniforms) return <Spinner />;
  if (!uniformSeasons.length) return <Empty resource="Uniform Jerseys" />;
  const sortedUniformSeasons = uniformSeasons.filter(
    (uniform) => uniform.season === currentSeason
  );
  return (
    <>
      <Menus>
        <Table columns="0.25fr 1fr 3fr 0.25fr;">
          <Table.Header>
            <div></div>
            <div>Team</div>
            <div>Uniform</div>
            <div></div>
          </Table.Header>
          <Table.Body
            data={sortedUniformSeasons}
            render={(uniformSeason) => (
              <UniformSeasonRow
                uniformSeason={uniformSeason}
                key={uniformSeason.id}
              />
            )}
          />
        </Table>
      </Menus>
    </>
  );
}

export default UniformSeasonTable;
