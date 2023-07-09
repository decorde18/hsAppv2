import styled from 'styled-components';
import { useState } from 'react';

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

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Player = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

const Price = styled.div`
  font-family: 'Sono';
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: 'Sono';
  font-weight: 500;
  color: var(--color-green-700);
`;

function PlayerRow({ player }) {
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
      <TableRow role="row">
        {/* <img src={image} /> */}
        <Player>{`${player.people.firstName} ${player.people.lastName}`}</Player>
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
      </TableRow>
      {/* {showForm && <CreateCabinForm cabinToEdit={cabin} />} */}
    </>
  );
}

export default PlayerRow;
