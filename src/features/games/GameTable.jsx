import styled from 'styled-components';

import GameTableSeasons from './GameTableSeasons';
import GameTableAllTime from './GameTableAllTime';

import { useSession, useSessionContext } from '@supabase/auth-helpers-react';

import { useState } from 'react';
import ButtonGroup from '../../ui/ButtonGroup';
import CreateGameForm from './CreateGameForm';
import CreateGoogleSignedInError from '../Calendar/CreateGoogleSignedInError';
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
          {!session?.provider_token ? (
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
