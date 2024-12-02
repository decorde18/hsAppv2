import styled from 'styled-components';

import Table from '../../../../ui/Table';
import Input from '../../../../ui/Input';

import { HiTrash } from 'react-icons/hi2';

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1rem 1rem;
  font-size: 2.4rem;
  transition: all 0.2s;
  color: var(--color-red-700);

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: var(--color-grey-50);
  }
`;
function ModalGamesEditTableRow({ each }) {
  function handleChange(e) {
    console.log('change', e.target.value);
  }
  function handleClick(e) {
    //todo on click, take event.id and use modalconfirm
    console.log('click', e.target);
  }
  return (
    <Table.Row>
      {Object.entries(each)
        .filter(([key]) => key !== 'id')
        .map(([key, value]) => (
          <Input key={key} value={value} onChange={handleChange} size="100%" />
        ))}
      <div>
        {each.id > 0 && (
          <StyledButton onClick={handleClick} name={name}>
            <HiTrash />
          </StyledButton>
        )}
      </div>
    </Table.Row>
  );
}

export default ModalGamesEditTableRow;
