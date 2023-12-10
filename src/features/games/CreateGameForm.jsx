import {
  useCreateGame,
  useEditGame,
  useGames,
  useGamesSeason,
} from './useGames';
import { useCreateCalendarEvent } from '../google/useCalendar';

import styled from 'styled-components';

import moment from 'moment';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import Textarea from '../../ui/Textarea';
import FormRow from '../../ui/FormRow';

import { useForm } from 'react-hook-form';
import Select from '../../ui/Select';
import Row from '../../ui/Row';
import Heading from '../../ui/Heading';

import { useLocations } from '../locations/useLocations';
import { useSchools } from '../schools/useSchools';
import Spinner from '../../ui/Spinner';
import { useContext, useEffect, useState } from 'react';
import ButtonChecked from '../../ui/ButtonChecked';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

const Header = styled.header`
  display: flex;
  gap: 5rem;
  justify-content: center;
`;
const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.type === 'white'
        ? 'var(--color-grey-100)'
        : 'var(--color-grey-300)'};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;
const seasonTimes = [
  { value: 'preseason', label: 'Pre-Season' },
  { value: 'regular', label: 'Regular Season' },
  { value: 'postseason', label: 'Post-Season', team: 'varsity' },
];
const gameTypes = [
  {
    value: 'Scrimmage',
    label: 'Pre-Season Scrimmage',
    seasonTime: 'preseason',
  },
  {
    value: 'Play Day',
    label: 'Pre-Season Play Day',
    seasonTime: 'preseason',
  },
  {
    value: 'Game',
    label: 'Regular Season Game',
    seasonTime: 'regular',
  },
  {
    value: 'Tournament',
    label: 'Tournament Game',
    seasonTime: 'regular',
  },
  {
    value: 'Districts',
    label: 'District Tournament',
    seasonTime: 'postseason',
  },
  {
    value: 'Regions',
    label: 'Region Tournament',
    seasonTime: 'postseason',
  },
  {
    value: 'Sub-State',
    label: 'Sectional Game',
    seasonTime: 'postseason',
  },
  {
    value: 'State',
    label: 'State Tournament',
    seasonTime: 'postseason',
  },
];

function CreateGameForm({ gameToEdit = {}, onCloseModal }) {
  const { currentSeason } = useCurrentSeason();
  const { gamesSeason } = useGamesSeason(currentSeason);

  const { isLoadingLocations, locations } = useLocations();
  const { isLoadingSchools, schools } = useSchools();
  const { id: editId, ...editValues } = gameToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const { errors } = formState;
  const { isCreating, createGame } = useCreateGame();
  const { createCalendarEvent, isCreatingCalEvent, dataForCalEvent } =
    useCreateCalendarEvent();

  const { isEditing, editGame } = useEditGame();

  const [team, setTeam] = useState('varsity');
  const [classification, setClassification] = useState('');
  const [location, setLocation] = useState('default');
  const [home, setHome] = useState(false);
  const [district, setDistrict] = useState(false);
  const [seasonTime, setSeasonTime] = useState(false);
  const [gameData, setGameData] = useState();
  const [calData, setCalData] = useState();

  const isWorking = isCreating || isEditing || isCreatingCalEvent;
  useEffect(() => {
    if (isWorking) return;
    if (!gameData || calData !== 'updated') return;
    //get id of created event
    //send ID to created event
    editGame({ newGameData: { calId: dataForCalEvent.id }, id: gameData.id });
    closeModal();
    setGameData(); //clear gameData
    setCalData(); //clear gameData
  }, [calData, dataForCalEvent, editGame, editId, gameData, isWorking]);

  async function sendToCalendar(data) {
    data.opponent = schools.find(
      (school) => +data.opponent === +school.id
    ).school;
    data.location = locations.find(
      (location) => +data.location === +location.id
    ).name;
    data.start = momentObj(data.date, data.time);
    data.end = momentObj(data.date, data.time, 1.5);

    function momentObj(date, time, timeAdded = 0) {
      // tell moment how to parse the input string
      const dateTime = moment(data.date + data.time, 'YYYY-MM-DDLT').add(
        timeAdded,
        'h'
      );
      // conversion
      return dateTime.format('YYYY-MM-DDTHH:mm:s');
    }
    //addToCalendar and get ID
    const calData = { ...data, calendar: data.teamType };

    await createCalendarEvent(calData);
    setCalData('updated');
  }

  function closeModal() {
    reset();
    onCloseModal?.();
  }

  function handleOpponentChange(e) {
    const selectedSchool = schools.find(
      (school) => school.id === +e.target.value
    );
    handleLocationChange(
      selectedSchool.home_location ? selectedSchool.home_location : 'default'
    );
    handleClassificationChange(
      selectedSchool.classification ? selectedSchool.classification : 'default'
    );
    //todo set district similarly
  }
  function handleLocationChange(val) {
    val = +val?.target?.value || val;
    setLocation(val);
  }
  function handleClassificationChange(val) {
    val = val?.target?.value || val;
    setClassification(val);
  }
  //todo create home function
  function handleHomeTeamChange(e) {
    e.preventDefault();
    setHome(!home);
  }
  //todo handle district when opponent is chosen
  function handleDistrictChange(e) {
    e.preventDefault();
    setDistrict(!district);
  }
  function handleTeamTypeChange(e) {
    setTeam(e.target.value);
  }
  //TODO don't hard code Varsity and JV

  function onSubmit(data) {
    data = { ...data, seasonTime, season: currentSeason };
    const editData = (({
      date,
      time,
      district,
      home,
      teamType,
      gameType,
      seasonTime,
      season,
      opponent,
      classification,
      comment,
      location,
    }) => ({
      date,
      time,
      district,
      home,
      teamType,
      gameType,
      seasonTime,
      season,
      opponent,
      classification,
      comment,
      location,
    }))(data);

    if (isEditSession)
      editGame(
        { newGameData: { ...editData }, id: editId },
        {
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          },
        }
      );
    else {
      if (data.time === '') delete data.time;
      createGame(
        { ...data },
        {
          onSuccess: (data) => {
            setGameData(data);
            sendToCalendar(data);
          },
        }
      );
    }
  }

  function onError(errors) {
    console.log(errors);
  }
  if (isLoadingLocations || isLoadingSchools || isWorking) return <Spinner />;

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? 'Modal' : 'regular'}
    >
      <Row>
        <Header as="h2" location="center">
          <span>Team Type </span>
          <StyledSelect
            onChange={handleTeamTypeChange}
            {...register('teamType')}
          >
            <option value="Varsity">Varsity</option>
            <option value="JV">JV</option>
          </StyledSelect>
        </Header>
        <FormRow label="Game Type" error={errors?.gameType?.message}>
          <StyledSelect
            type="white"
            {...register('gameType', {
              validate: (value) =>
                value !== 'default' || 'Please select a game type',
            })}
            defaultValue={'default'}
            onChange={(e) =>
              setSeasonTime(
                e.target.options[e.target.selectedIndex].closest('optgroup')
                  .label
              )
            }
          >
            <option value="default" disabled>
              Please Select Game Type
            </option>
            {seasonTimes.map((type) => {
              if (!type.team || type.team === team)
                return (
                  <optgroup id={type.value} key={type.label} label={type.label}>
                    {gameTypes.map(
                      (typ) =>
                        typ.seasonTime === type.value && (
                          <option value={typ.value} key={typ.value}>
                            {typ.label}
                          </option>
                        )
                    )}
                  </optgroup>
                );
            })}
          </StyledSelect>
        </FormRow>

        <FormRow label="Date *" error={errors?.date?.message}>
          <Input
            type="date"
            id="date"
            disabled={isWorking}
            {...register('date', { required: 'Please Provide a date' })}
          />
        </FormRow>
        <FormRow label="Time" error={errors?.time?.message}>
          <Input
            type="time"
            id="time"
            defaultValue={null}
            disabled={isWorking}
            {...register('time')}
          />
        </FormRow>
        <FormRow label="Opponent *" error={errors?.opponent?.message}>
          <StyledSelect
            {...register('opponent', {
              validate: (value) =>
                value !== 'default' || 'Please select an Opponent',
            })}
            type="white"
            onChange={handleOpponentChange}
            defaultValue={'default'}
          >
            <option value="default" disabled>
              Please Select an Opponent
            </option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.school}
              </option>
            ))}
          </StyledSelect>
        </FormRow>
        <FormRow label="Class" error={errors?.class?.message}>
          <StyledSelect
            type="white"
            {...register('classification', {
              validate: (value) =>
                value !== 'default' || "Please select the opponent's class",
            })}
            value={classification}
            onChange={handleClassificationChange}
          >
            <option value="default">
              Please Select the Opponents&apos; Classification
            </option>
            <option value="I AAA">I AAA</option>
            <option value="I AA">I AA</option>
            <option value="I A">I A</option>
            <option value="II AA">II AA</option>
            <option value="II A">II A</option>
            <option value="NA">N/A</option>
          </StyledSelect>
        </FormRow>
        <FormRow error={errors?.district?.message}>
          <ButtonChecked
            value={district}
            label={district ? 'District Game' : 'Non-District'}
            onClick={handleDistrictChange}
            disabled={isWorking}
          />
          <input
            type="hidden"
            disabled={isWorking}
            {...register('district', { value: district })}
          />
        </FormRow>
        <FormRow error={errors?.home?.message}>
          <input
            type="hidden"
            disabled={isWorking}
            {...register('home', { value: home })}
          />
          <ButtonChecked
            value={home}
            label={home ? 'Home Team' : 'Away Team'}
            onClick={handleHomeTeamChange}
            disabled={isWorking}
          />
        </FormRow>
        <FormRow label="Location *" error={errors?.location?.message}>
          <StyledSelect
            type="white"
            value={location}
            {...register('location', {
              validate: (value) =>
                value !== 'default' || 'Please select a location',
            })}
            onChange={handleLocationChange}
          >
            <option value="default" disabled>
              Please Select Location
            </option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </StyledSelect>
        </FormRow>

        <FormRow label="Comment" error={errors?.comment?.message}>
          <Textarea
            id="comment"
            disabled={isWorking}
            {...register('comment')}
          />
        </FormRow>
      </Row>
      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? 'Edit Game' : 'Create New Game'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateGameForm;
