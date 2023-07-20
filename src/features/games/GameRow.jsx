import styled from 'styled-components';
import { useState } from 'react';
import Table from '../../ui/Table';
import { format } from 'date-fns';
import { formatCurrency, formatTime } from '../../utils/helpers';

// import CreateCabinForm from './CreateCabinForm';
// import { useDeleteCabin } from './useDeleteCabin';
// import { formatCurrency } from '../../utils/helpers';

// import { HiSquare2Stack, HiPencil, HiTrash } from 'react-icons/hi2';
// import { useCreateCabin } from './useCreateCabin';

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;
  padding: 0 2rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const Game = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

function GameRow({ game }) {
  // console.log(game);
  // const [showForm, setShowForm] = useState(false);
  // const { isDeleting, deleteCabin } = useDeleteCabin();
  // const { isCreating, createCabin } = useCreateCabin();
  // const {
  //   id: cabinId,
  //   name,
  //   maxCapacity,
  //   regularPrice,
  //   discount,
  //   description,
  //   image,
  // } = cabin;
  // function handleDuplicate() {
  //   createCabin({
  //     name: `Copy of ${name}`,
  //     maxCapacity,
  //     regularPrice,
  //     discount,
  //     description,
  //     image,
  //   });
  // }
  return (
    <>
      <Table.Row>
        <div></div>
        <div>{game.date && format(new Date(game.date), 'MM/dd/yy')}</div>
        <div>{game.time && formatTime(game.time, true)}</div>
        <Game>{game.schools.school}</Game>
        <div>{game.locations.name}</div>
        <div>{game.teamType}</div>
        <div></div>
      </Table.Row>
      {/* <Price>{formatCurrency(regularPrice)}</Price> */}
      {/* {discount ? (
          <Discount>{formatCurrency(discount)}</Discount>
        ) : (
          <span>&mdash;</span>
        )} */}
      <div>
        {/* <button disabled={isCreating} onClick={handleDuplicate}>
            <HiSquare2Stack />
          </button>
          <button onClick={() => setShowForm((show) => !show)}>
            <HiPencil />
          </button>
          <button onClick={() => deleteCabin(cabinId)} disabled={isDeleting}>
            <HiTrash />
          </button> */}
      </div>
      {/* {showForm && <CreateCabinForm cabinToEdit={cabin} />} */}
    </>
  );
}

export default GameRow;
