import Empty from '../../ui/Empty';
import Menus from '../../ui/Menus';
import Spinner from '../../ui/Spinner';
import Table from '../../ui/Table';
import UniformRow from './UniformRow';
import { useUniforms } from './useUniforms';

function UniformTable() {
  const { isLoadingUniforms, uniforms } = useUniforms();
  if (isLoadingUniforms) return <Spinner />;
  if (!uniforms.length) return <Empty resource="Uniforms" />;
  const sortedUniforms = uniforms

    .sort((a, b) => b.year - a.year)
    .sort((a, b) => b.active - a.active);
  return (
    <Menus>
      <Table columns="0.25fr 1fr 1fr 1fr 2fr 1fr 1fr 1fr 0.25fr;">
        <Table.Header>
          <div></div>
          <div>Type</div>
          <div>Brand</div>
          <div>Color</div>
          <div>Style</div>
          <div>Year</div>
          <div>Active</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={sortedUniforms}
          render={(uniform) => (
            <UniformRow uniform={uniform} key={uniform.id} />
          )}
        />
      </Table>
    </Menus>
  );
}

export default UniformTable;
