import { useState } from 'react';
import Empty from '../../ui/Empty';
import Menus from '../../ui/Menus';
import Select from '../../ui/Select';
import Spinner from '../../ui/Spinner';
import Table from '../../ui/Table';
import UniformJerseyRow from './UniformJerseyRow';
import { useUniformJerseys, useUniforms } from './useUniforms';

function UniformJerseyTable() {
  const [selectedJersey, setSelectedJersey] = useState('default');

  const { isLoadingUniformJerseys, uniformJerseys } = useUniformJerseys();
  const { isLoadingUniforms, uniforms } = useUniforms();
  function handleJerseyChange(e) {
    setSelectedJersey(e.target.value);
  }
  if (isLoadingUniformJerseys || isLoadingUniforms) return <Spinner />;
  if (!uniformJerseys.length) return <Empty resource="Uniform Jerseys" />;

  const sortedUniformJerseys = uniformJerseys
    .filter((uniform) => uniform.uniform === +selectedJersey)
    .sort((a, b) => a.number - b.number);
  return (
    <>
      <select defaultValue="default" onChange={handleJerseyChange}>
        <option value="default">Choose uniform style</option>
        {uniforms
          .filter((uniform) => uniform.type.includes('Jersey'))
          .filter((uniform) => uniform.active === true)
          .map((uniform) => (
            <option key={uniform.id} value={uniform.id}>
              {uniform.style} {uniform.color}
            </option>
          ))}
      </select>

      <Menus>
        <Table columns="0.25fr 1fr 1fr 1fr 1fr 0.25fr;">
          <Table.Header>
            <div></div>
            <div>Number</div>
            <div>Size</div>
            <div>Available</div>
            <div></div>
          </Table.Header>
          <Table.Body
            data={sortedUniformJerseys}
            render={(uniformJersey) => (
              <UniformJerseyRow
                uniformJersey={uniformJersey}
                key={uniformJersey.id}
              />
            )}
          />
        </Table>
      </Menus>
    </>
  );
}

export default UniformJerseyTable;
