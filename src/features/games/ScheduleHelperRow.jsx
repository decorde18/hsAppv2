import styled, { css } from 'styled-components';
import Heading from '../../ui/Heading';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import { useSeasons } from '../seasons/useSeasons';
import { useSchools } from '../schools/useSchools';
import { usePeople } from '../people/usePeople';
import { useCoaches } from '../coaches/useCoaches';

import Modal from '../../ui/Modal';
import ModalConfirm from '../../ui/ModalConfirm';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import Select from '../../ui/Select';
import Input from '../../ui/Input';
import Checkbox from '../../ui/Checkbox';

import CreatePeopleForm from '../people/CreatePeopleForm';

import { HiPencil, HiTrash, HiMiniXMark } from 'react-icons/hi2';

import {
  useScheduleHelper,
  useCreateScheduleHelper,
  useEditScheduleHelper,
  useDeleteScheduleHelper,
} from './useGames';
import { statusArray, likelihoodArray } from './ScheduleHelperArrays';
import { useEffect, useState } from 'react';
import Button from '../../ui/Button';

function ScheduleHelperRow({
  scheduleHelper,
  school,
  coach,
  updateEmailList,
  isChecked,
  onCloseModal,
}) {
  const { editScheduleHelper, isEditing } = useEditScheduleHelper();
  const { isDeleting, deleteScheduleHelper } = useDeleteScheduleHelper();

  const { currentSeason } = useCurrentSeason();
  const { isLoadingSeasons, seasons } = useSeasons();
  const { isLoadingSchools, schools } = useSchools();
  const { isLoadingPeople, people } = usePeople();
  const { isLoadingCoaches, coaches } = useCoaches();

  const isLoading =
    isLoadingPeople || isLoadingSeasons || isLoadingSchools || isLoadingCoaches;
  const isWorking = isDeleting || isEditing;

  function handleSelectChange(e) {
    const name = e.target.name;
    const value = isNaN(e.target.value) ? e.target.value : +e.target.value;
    if (name === 'coach') updateCoach(value);
    else editScheduleHelper({ [name]: value, id: scheduleHelper.id });
  }
  function handleBlur(e) {
    const { value } = e.target;
    editScheduleHelper({ notes: value, id: scheduleHelper.id });
  }
  function handleChange(e) {
    updateEmailList(e.target.checked, scheduleHelper.opponent);
  }

  function updateCoach(coach) {}
  // editScheduleHelper({ girls_coach: coach, id: scheduleHelper.id });

  // function UpdateCoachModal() {
  //   return (

  //   );
  // }
  function closeModal() {
    deleteScheduleHelper(scheduleHelper.id);
    onCloseModal?.();
  }
  if (isLoading) return;
  const sortedCoaches = coaches
    .sort(function (a, b) {
      if (a.people.firstName < b.people.firstName) {
        return -1;
      }
      if (a.people.firstName > b.people.firstName) {
        return 1;
      }
      return 0;
    })
    .sort(function (a, b) {
      if (a.people.lastName < b.people.lastName) {
        return -1;
      }
      if (a.people.lastName > b.people.lastName) {
        return 1;
      }
      return 0;
    });
  return (
    <Table.Row>
      <Select
        name="opponent"
        disabled={isWorking}
        onChange={handleSelectChange}
        value={school.id}
        options={[
          { label: 'Please Select an Opponent', value: 'default' },
          ...schools.map((school) => ({
            label: school.school,
            value: school.id,
          })),
        ]}
      />
      <div>
        {coach ? (
          coach.people.firstName + ' ' + coach.people.lastName
        ) : (
          <Select
            key={`coach${scheduleHelper.id}`}
            name="coach"
            disabled={isWorking}
            onChange={handleSelectChange}
            options={[
              { label: 'No Coach Listed', value: 'default' },
              // { label: 'ADD A COACH NOT LISTED', value: 'addAnother' },
              ...sortedCoaches.map((coach) => ({
                label: `${coach.people.firstName} ${coach.people.lastName}`,
                value: coach.coach,
              })),
            ]}
          ></Select>
        )}
      </div>

      <Select
        options={likelihoodArray}
        onChange={handleSelectChange}
        name="likelihood"
        disabled={isWorking}
        value={
          likelihoodArray.find((val) => val.value === scheduleHelper.likelihood)
            .value
        }
      />
      <Select
        options={statusArray}
        onChange={handleSelectChange}
        name="status"
        disabled={isWorking}
        value={
          statusArray.find((val) => val.value === scheduleHelper.status).value
        }
      />
      <Input
        type="text"
        onBlur={handleBlur}
        disabled={isWorking}
        placeholder={scheduleHelper.notes}
      />
      <Checkbox
        size="small"
        label=""
        onChange={handleChange}
        checked={isChecked}
      />
      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={scheduleHelper.id} />
          <Menus.List id={scheduleHelper.id}>
            <Modal.Open opens="delete">
              <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
            </Modal.Open>
            <Modal.Open opens="addCoach">
              <Menus.Button icon={<HiTrash />}>Add A Coach</Menus.Button>
            </Modal.Open>
          </Menus.List>
        </Menus.Menu>
        <Modal.Window name="delete">
          <ModalConfirm
            resourceName="scheduleHelper"
            onConfirm={closeModal}
            disabled={isWorking}
            confirmType="delete"
          />
        </Modal.Window>
        <Modal.Window name={'addCoach'}>
          <CreatePeopleForm schoolToAddTo={school.id} />
        </Modal.Window>
      </Modal>
    </Table.Row>
  );
}

export default ScheduleHelperRow;

// <Modal>
//   {!session?.provider_token ? (
//     <Modal.Open opens="game-form-error">
//       <div>You are not logged in to Google in order to add games</div>
//     </Modal.Open>
//   ) : (
//     <Modal.Open opens="game-form">
//       <Button type="selected" variation="primary">
//         Add New game
//       </Button>
//     </Modal.Open>
//   )}
//   <Modal.Window name="game-form-error">
//     <CreateGoogleSignedInError />
//   </Modal.Window>
//   <Modal.Window name="game-form">
//     <CreateGameForm />
//   </Modal.Window>
// </Modal>
