import Empty from '../../ui/Empty';
import Menus from '../../ui/Menus';
import Spinner from '../../ui/Spinner';
import Table from '../../ui/Table';
import UniformJerseyRow from './UniformJerseyRow';
import { useData } from '../../services/useUniversal';
import styled from 'styled-components';
import Heading from '../../ui/Heading';
import { id } from 'date-fns/locale';

const Container = styled.div`
  display: flex;
  gap: 5rem;
  width: 100%;
`;
function UniformJerseyTable() {
  const { isLoading: isLoadingUniformJerseys, data: uniformJerseys } = useData({
    table: 'uniformJerseys',
    filter: [
      { field: 'type', value: 'Jersey' },
      { field: 'active', value: true },
    ],
  });

  if (isLoadingUniformJerseys) return <Spinner />;
  if (!uniformJerseys.length) return <Empty resource="Uniform Jerseys" />;
  const activeUniforms = [
    ...new Set(uniformJerseys.map((jersey) => jersey.uniformid)),
  ];
  const uniforms = activeUniforms.map((uniformid) =>
    uniformJerseys.find((uniform) => uniformid === uniform.uniformid)
  );
  const sortedUniformJerseys = uniformJerseys.sort(
    (a, b) => a.number - b.number
  );
  return (
    <Container>
      {uniforms.map((uniform) => (
        <div key={uniform.uniformid}>
          <Menus>
            <Heading as="h2">
              {uniform.brand} {uniform.style} {uniform.color}
            </Heading>
            <Table columns="0.25fr 1fr 1fr 1fr 1fr 0.25fr;">
              <Table.Header>
                <div></div>
                <div>Number</div>
                <div>Size</div>
                <div>Available</div>
                <div></div>
              </Table.Header>
              <Table.Body
                data={sortedUniformJerseys.filter(
                  (jerseys) => jerseys.uniformid === uniform.uniformid
                )}
                render={(uniformJersey) => (
                  <UniformJerseyRow
                    uniformJersey={uniformJersey}
                    key={uniformJersey.uniformid}
                  />
                )}
              />
            </Table>
          </Menus>
        </div>
      ))}
    </Container>
  );
}

export default UniformJerseyTable;
