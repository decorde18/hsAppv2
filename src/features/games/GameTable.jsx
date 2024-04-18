import styled from 'styled-components';

import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';

import GameTableSeasons from './GameTableSeasons';
import GameTableAllTime from './GameTableAllTime';
import CreateGameForm from './CreateGameForm';
import CreateGoogleSignedInError from '../Calendar/CreateGoogleSignedInError';

import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';

const StyledDiv = styled.div`
  display: flex;
  gap: 2px;
  justify-content: space-between;
`;

function GameTable() {
  const session = useSession();
  const [tableData, setTableData] = useState('Season');
  const [filteredCount, setFilteredCount] = useState();

  function handleButtonGroupChange(e) {
    setTableData(e.target.name);
  }
  console.log(session);
  return (
    <>
      <StyledDiv>
        <ButtonGroup
          btnArray={['Season', 'All-Time']}
          defaultBtn={tableData}
          onChange={handleButtonGroupChange}
        />
        <div>{filteredCount} games</div>
        <Modal>
          {!session?.provider_token ||
          !process.env.NODE_ENV ||
          process.env.NODE_ENV !== 'development' ? (
            <Modal.Open opens="game-form-error">
              <div>You are not logged in to Google in order to add games</div>
            </Modal.Open>
          ) : (
            <Modal.Open opens="game-form">
              <Button type="selected" variation="primary">
                Add New game
              </Button>
            </Modal.Open>
          )}

          {(!process.env.NODE_ENV ||
            process.env.NODE_ENV === 'development') && (
            <Modal.Open opens="game-form">
              <Button type="selected" variation="primary">
                DEVELOPMENT
              </Button>
            </Modal.Open>
          )}

          <Modal.Window name="game-form-error">
            <CreateGoogleSignedInError />
          </Modal.Window>
          <Modal.Window name="game-form">
            <CreateGameForm />
          </Modal.Window>
        </Modal>
      </StyledDiv>
      {tableData === 'Season' ? (
        <GameTableSeasons setFilteredCount={setFilteredCount} />
      ) : (
        <GameTableAllTime setFilteredCount={setFilteredCount} />
      )}
    </>
  );
}
export default GameTable;
