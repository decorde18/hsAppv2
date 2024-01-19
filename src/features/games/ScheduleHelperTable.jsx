import styled from 'styled-components';
import Spinner from '../../ui/Spinner';

import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

import {
  useScheduleHelper,
  useCreateScheduleHelper,
  useEditScheduleHelper,
  useDeleteScheduleHelper,
} from './useGames';
import { useSeasons } from '../seasons/useSeasons';
import { useSchools } from '../schools/useSchools';
import { useCoaches } from '../coaches/useCoaches';

import ScheduleHelperRow from './ScheduleHelperRow';

import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import Button from '../../ui/Button';
import Checkbox from '../../ui/Checkbox';
import Heading from '../../ui/Heading';

import { statusArray, likelihoodArray } from './ScheduleHelperArrays';

import { useState } from 'react';

const StyledDiv = styled.div`
  display: flex;
  gap: 2px;
  justify-content: space-between;
`;
const Flex = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 6fr 1fr;
  /* justify-content: space-between; */
`;

function ScheduleHelperTable() {
  const { isLoadingScheduleHelpers, scheduleHelpers } = useScheduleHelper();
  const { isLoadingSeasons, seasons } = useSeasons();
  const { currentSeason } = useCurrentSeason();
  const { isLoadingSchools, schools } = useSchools();
  const { isLoadingCoaches, coaches } = useCoaches();

  const { createScheduleHelper, isCreating } = useCreateScheduleHelper();

  const isWorking =
    isLoadingSeasons ||
    isLoadingScheduleHelpers ||
    isLoadingSchools ||
    isLoadingCoaches;
  const [emailArray, setEmailArray] = useState([]);
  const [emailList, setEmailList] = useState([]);

  function handleClick(e) {
    createScheduleHelper({
      opponent: 390,
      season: currentSeason,
      likelihood: 'hopeful',
      status: e.target.name,
    });
  }
  function handleChange(e) {
    const matched = scheduleHelpers
      .filter((helper) => e.target.name === helper.status)
      .map((item) => item.opponent);
    const unmatched = emailArray.filter((item) => !matched.includes(item));
    e.target.checked
      ? setEmailArray([...new Set([...emailArray, ...matched])])
      : setEmailArray(unmatched);
  }
  function updateEmailList(action, opponent) {
    //todo, when unclick, the all should turn off
    // todo I AM HERE see todo fix on row
    const array = action
      ? [...emailArray, opponent]
      : emailArray.filter((item) => item !== opponent);

    setEmailArray([...new Set(array)]);
  }
  if (isWorking) return <Spinner />;
  return (
    <Menus>
      {/* Menus is needed anytime you have menus in the subrows */}
      <Table columns=" 1.25fr 1.25fr .75fr .75fr 1fr .25fr .25fr">
        <Table.Header>
          <div>Opponent</div>
          <div>Coach</div>
          <div>Likelihood</div>
          <div>Status</div>
          <div>Notes</div>
          <div>Email</div>
          <div></div>
        </Table.Header>
        {statusArray
          .sort((a, b) => b.rank - a.rank)
          .map((status) => (
            <div key={status.rank}>
              <Table.Header>
                <div>{status.label}</div>
                {status.newBtn ? (
                  <Button
                    size="xsmall"
                    name={status.value}
                    variation="primary"
                    onClick={handleClick}
                    disabled={isCreating}
                  >
                    Add Opponent
                  </Button>
                ) : (
                  <div />
                )}
                <div />
                <div />
                <div />
                <Checkbox
                  label=""
                  name={status.value}
                  onChange={(e) => handleChange(e, true)}
                />
              </Table.Header>
              <Heading />
              <Table.Body
                data={scheduleHelpers
                  .filter((helper) => helper.status === status.value)
                  .sort(
                    (a, b) =>
                      likelihoodArray.find(
                        (like) => a.likelihood === like.value
                      ).rank -
                      likelihoodArray.find(
                        (like) => b.likelihood === like.value
                      ).rank
                  )}
                render={(scheduleHelper) => {
                  const school = schools.find(
                    (school) => school.id === scheduleHelper.opponent
                  );
                  return (
                    <ScheduleHelperRow
                      scheduleHelper={scheduleHelper}
                      school={school}
                      coach={coaches.find((coach) => coach.team === school.id)}
                      updateEmailList={updateEmailList}
                      isChecked={emailArray.includes(scheduleHelper.opponent)}
                      key={scheduleHelper.id}
                    />
                  );
                }}
              ></Table.Body>
            </div>
          ))}
      </Table>
    </Menus>
  );
}

export default ScheduleHelperTable;
