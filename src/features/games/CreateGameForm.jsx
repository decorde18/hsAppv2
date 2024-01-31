import { useEffect, useState } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useForm } from 'react-hook-form';

import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Row from '../../ui/Row';
import Heading from '../../ui/Heading';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import Textarea from '../../ui/Textarea';

import Calendar from '../Calendar/Calendar';
import Spinner from '../../ui/Spinner';
import CreateGoogleSignedInError from '../Calendar/CreateGoogleSignedInError';

import { useSession, useSessionContext } from '@supabase/auth-helpers-react';

import { useSeason } from '../seasons/useSeasons';
import { useLocations } from '../locations/useLocations';
import { useSchools } from '../schools/useSchools';
import { useCreateGame, useEditGame } from './useGames';
import { createEditGoogleCalendarGame } from '../../services/apiGoogle';

const Div = styled.div`
  height: 100%;
`;
const Center = styled.div`
  width: 50%;
  margin: auto;
`;
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
const Flex = styled.div`
  display: flex;
  max-height: 90vh;
`;
const MainForm = styled.div`
  width: 70rem;
  margin: 2rem;
  overflow-y: auto;
`;

const seasonTimes = [
  { value: 'preseason', label: 'Pre-Season' },
  { value: 'regular', label: 'Regular Season' },
  { value: 'postseason', label: 'Post-Season', team: 'Varsity' },
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
  const { isLoading: isLoadingSupabase } = useSessionContext();
  const session = useSession();

  const { isLoadingSeason, season } = useSeason();
  const { isLoadingLocations, locations } = useLocations(0);
  const { isLoadingSchools, schools } = useSchools();

  const { id: editId, ...editValues } = gameToEdit;
  const isEditSession = Boolean(editId);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState,
    setValue,
    watch,
  } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const { isCreating, createGame } = useCreateGame();
  const { isEditing, editGame } = useEditGame();
  const [googleUpdating, setGoogleUpdating] = useState(false);

  const { errors } = formState;

  const isLoading =
    isLoadingSeason ||
    isLoadingLocations ||
    isLoadingSchools ||
    googleUpdating ||
    isLoadingSupabase;
  const isWorking = isLoading || isCreating || isEditing || googleUpdating;

  const [gameOpponent, setGameOpponent] = useState(
    getValues('opponent') || 'default'
  );
  const [gameScheduleType, setGameScheduleType] = useState(
    getValues('teamType') || 'both'
  );
  const [startDate, setStartDate] = useState(new Date()); //state values for Calenader Page
  const [endDate, setEndDate] = useState(new Date()); //state values for Calenader Page
  //update gameType array on seasonLoad
  useEffect(
    function () {
      if (!isLoading) return;
      if (isEditSession) return;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading]
  );
  //updates the opponent state with district, home location, classification
  useEffect(
    function () {
      if (isLoading) return;
      const opponent = schools.find(
        (school) => school.id === watch('opponent')
      );
      handleSetValue('classification', opponent?.classification || 'default');
      opponent?.region == season.region && opponent?.district == season.district
        ? handleSetValue('district', true)
        : handleSetValue('district', false);
      !watch('home') &&
        handleSetValue('location', opponent?.home_location || 'default');
      setGameOpponent(opponent);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, schools, gameOpponent]
  );
  useEffect(
    function () {
      if (isLoading) return;
      setStartDate(new Date(`8/1/${season.season}`));
      setEndDate(new Date(`10/31/${season.season}`));
    },
    [isLoading]
  );
  function handleSelectChange(e) {
    const name = e.target.name;
    const value = isNaN(Number(e.target.value))
      ? e.target.value
      : Number(e.target.value);
    if (name.startsWith('gameType')) {
      gameTypeChange(e);
      return;
    }
    handleSetValue(name, value);
    name === 'opponent' && setGameOpponent(value);
  }
  function handleButtonClick(e) {
    e.preventDefault();
    const name = e.target.name;
    handleSetValue(name, !getValues(name));
    name === 'home' && homeChange();
  }
  function handleTeamButtonChange(e) {
    //updates the game type
    e.preventDefault();
    setGameScheduleType(e.target.value);
    e.target.value !== 'both' && setValue('teamType', e.target.value);
  }
  function gameTypeChange(e) {
    if (gameScheduleType === 'both')
      //sets the value for if both, and updates any others with same if they don't already have a value
      Object.keys(getValues())
        .filter((val) => val.startsWith('gameType'))
        .map(
          (val) =>
            (getValues(val) === 'default' || e.target.name === val) &&
            setValue(val, e.target.value)
        );

    handleSetValue('gameType', e.target.value); //sets the gameType if both or not
  }
  function handleSetValue(name, value) {
    setValue(name, value);
  }
  function homeChange() {
    watch('home')
      ? handleSetValue('location', season.home_location)
      : handleSetValue('location', gameOpponent?.home_location);
  }
  function onSubmit(data) {
    data.home = !!data.home;
    setGoogleUpdating(true);
    let teamSchedules;
    const {
      created_at,
      updated_at,
      goals,
      locations: loc,
      schools: sch,
      ...newData
    } = data;
    if (isEditSession) {
      sendToCalendar(newData);
      editGame(
        { newData: { ...newData }, id: editId },
        {
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          },
        }
      );
    } else {
      gameScheduleType === 'both' //create array of teams to schedule ie JV, V or Both
        ? (teamSchedules = season.teamLevels)
        : (teamSchedules = [gameScheduleType]);
      teamSchedules.forEach((team) => {
        //iterate through each team we are scheduling,
        const newData = { ...data };
        //time & gameType need to be broken into JV and V
        const separationArray = ['time', 'gameType']; //array of combined fields we need to remove
        const newArray = separationArray.reduce((acc, cur) => {
          const curKey = teamSchedules.length > 1 ? `${cur}${team}` : [cur];
          const curValue = data[curKey];
          for (const key in newData) {
            //  delete all keys that are affected by combined fields
            if (key.startsWith(`${cur}`)) delete newData[key];
          }
          return { ...acc, [cur]: curValue }; //add only the value with new key for current team
        }, []);
        const seasonTime = seasonTimes.find(
          (tim) =>
            tim.value ===
            gameTypes.find((type) => type.value === newArray.gameType)
              .seasonTime
        ).label;
        const teamData = {
          // all data for team - send to calendar, send to create/edit
          ...newArray,
          ...newData,
          //add teamType
          teamType: team,
          //add season
          season: season.id,
          seasonTime,
        };
        //add calData
        sendToCalendar(teamData);
      });
    }
    async function sendToCalendar(calData) {
      const googleCalData = { ...calData };
      !calData.time && delete calData.time;
      googleCalData.opponent = schools.find(
        (school) => +calData.opponent === +school.id
      ).school;
      googleCalData.location = locations.find(
        (location) => +calData.location === +location.id
      ).name;
      googleCalData.timeZone = 'America/Chicago';
      if (googleCalData.time) {
        googleCalData.start = convertToGoogleDateTime(
          calData.date,
          calData.time
        );
        googleCalData.end = convertToGoogleDateTime(
          calData.date,
          calData.time,
          1.5
        );
      }
      // addToCalendar and get ID
      createEditGoogleCalendarGame(
        {
          ...googleCalData,
          calendar: calData.teamType,
        },
        isEditSession
      ).then((data) => {
        setGoogleUpdating(false);
        if (isEditSession) return;
        createGame({
          ...calData,
          teamType: calData.teamType,
          calId: data.id,
        }).then(() => closeModal());
      });

      function convertToGoogleDateTime(date, time, timeAdded = 0) {
        // tell moment how to parse the input
        const dateTime = moment(date + time, 'YYYY-MM-DDLT').add(
          timeAdded,
          'h'
        );
        // conversion
        return dateTime.format('YYYY-MM-DDTHH:mm:s');
      }

      return;
    }
  }
  function closeModal() {
    reset();
    onCloseModal?.();
  }
  function onError(errors) {
    console.log(errors);
  }

  if (isLoading || isWorking) return <Spinner />;
  if (!session?.provider_token) return <CreateGoogleSignedInError />;
  return (
    <Div>
      <Flex>
        <Calendar startDate={startDate} endDate={endDate} />
        <MainForm>
          <Form
            onSubmit={handleSubmit(onSubmit, onError)}
            type={closeModal ? 'Modal' : 'regular'}
          >
            <Center>
              {isEditSession ? (
                <Heading as={'h4'}>EDIT GAME</Heading>
              ) : (
                <Heading as={'h4'}>CREATE GAME</Heading>
              )}
            </Center>
            {/* Team Type */}
            <Center>
              <ButtonGroup>
                {season.teamLevels.map((team) => {
                  return (
                    <Button
                      key={`${team}Button`}
                      value={team}
                      name="gameScheduleType"
                      variation={
                        gameScheduleType === team ? 'primary' : 'secondary'
                      }
                      onClick={handleTeamButtonChange}
                    >
                      {team}
                    </Button>
                  );
                })}
                {!isEditSession && (
                  <Button
                    value="both"
                    name="gameScheduleType"
                    variation={
                      gameScheduleType === 'both' ? 'primary' : 'secondary'
                    }
                    onClick={handleTeamButtonChange}
                  >
                    BOTH
                  </Button>
                )}
              </ButtonGroup>
            </Center>
            {/* date and time */}
            <FormRow label="Date *" error={errors?.date?.message}>
              <Input
                type="date"
                id="date"
                disabled={isWorking}
                register={{
                  ...register('date', { required: 'Please Provide a date' }),
                }}
              />
            </FormRow>
            <Row type="horizontal">
              {season.teamLevels.map((team) => {
                if (team === gameScheduleType || gameScheduleType === 'both')
                  return (
                    <Row type="vertical" key={`${team}Column`}>
                      <Heading as={'h2'}>{team}</Heading>
                      <Row>
                        <Flex>
                          <FormRow label="Time" error={errors?.time?.message}>
                            <Input
                              type="time"
                              id={
                                gameScheduleType !== 'both'
                                  ? 'time'
                                  : `time${team}`
                              }
                              disabled={isWorking}
                              register={{
                                ...register(
                                  gameScheduleType !== 'both'
                                    ? 'time'
                                    : `time${team}`
                                ),
                              }}
                            />
                          </FormRow>
                          {watch('time') && (
                            <div>
                              INCLUDE UPDATED TIME IF NOT
                              {moment(
                                new Date(
                                  '1970-01-01T' + watch('time').split('-')[0]
                                )
                              ).format('LT')}
                            </div>
                          )}
                        </Flex>
                      </Row>
                      <FormRow
                        label="Game Type *"
                        error={errors?.gameType?.message}
                      >
                        <StyledSelect
                          type="white"
                          id={
                            gameScheduleType !== 'both'
                              ? 'gameType'
                              : `gameType${team}`
                          }
                          {...register(
                            gameScheduleType !== 'both'
                              ? 'gameType'
                              : `gameType${team}`,
                            {
                              validate: (value) =>
                                value !== 'default' ||
                                'Please select a game type',
                            }
                          )}
                          value={
                            (gameScheduleType !== 'both'
                              ? watch('gameType')
                              : watch(`gameType${team}`)) || 'default'
                          }
                          onChange={handleSelectChange}
                        >
                          <option value="default" disabled>
                            Please Select Game Type
                          </option>
                          {seasonTimes.map((type) => {
                            if (!type.team || type.team === team)
                              return (
                                <optgroup
                                  id={`${type.value}${team}`}
                                  key={`${type.label}${team}`}
                                  label={type.label}
                                >
                                  {gameTypes.map(
                                    (typ) =>
                                      typ.seasonTime === type.value && (
                                        <option
                                          value={typ.value}
                                          key={`${typ.value}${team}`}
                                        >
                                          {typ.label}
                                        </option>
                                      )
                                  )}
                                </optgroup>
                              );
                          })}
                        </StyledSelect>
                      </FormRow>
                    </Row>
                  );
              })}
            </Row>
            {/* Opponent and opponent details (Class District) */}
            <Heading as={'h3'}>OPPONENT</Heading>
            <FormRow label="Opponent *" error={errors?.opponent?.message}>
              <StyledSelect
                type="white"
                id={'opponent'}
                {...register('opponent', {
                  validate: (value) =>
                    value !== 'default' || 'Please select an Opponent',
                })}
                onChange={handleSelectChange}
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
            {/* Game details */}
            <Row type="horizontal">
              <FormRow error={errors?.district?.message}>
                <Button
                  size="small"
                  name="district"
                  value={watch('district')}
                  variation={watch('district') ? 'primary' : 'secondary'}
                  onClick={handleButtonClick}
                >
                  {watch('district') ? 'District' : 'Non-District'}
                </Button>
                <input
                  type="hidden"
                  disabled={isWorking}
                  {...register('district')}
                />
              </FormRow>
              <FormRow />
              <FormRow
                label="Classification"
                error={errors?.classification?.message}
              >
                <StyledSelect
                  type="white"
                  id="classification"
                  {...register('classification', {
                    validate: (value) =>
                      value !== 'default' ||
                      "Please select the opponent's class",
                  })}
                  onChange={handleSelectChange}
                  defaultValue={'default'}
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
            </Row>
            {/* location  &  Home/Away */}
            <Row type="horizontal">
              <FormRow>
                <Button
                  name="home"
                  variation={watch('home') ? 'primary' : 'secondary'}
                  onClick={handleButtonClick}
                >
                  {watch('home') ? 'Home' : 'Away'}
                </Button>
                <input
                  defaultValue={watch('home')}
                  type="hidden"
                  disabled={isWorking}
                  {...register('home')}
                />
              </FormRow>
              <FormRow />
              <FormRow label="Location *" error={errors?.location?.message}>
                <StyledSelect
                  type="white"
                  id="location"
                  {...register('location', {
                    validate: (value) =>
                      value !== 'default' || 'Please select a location',
                  })}
                  onChange={handleSelectChange}
                  defaultValue={'default'}
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
            </Row>
            {/* comment */}
            <FormRow label="Comment" error={errors?.comment?.message}>
              <Textarea
                id="comment"
                disabled={isWorking}
                {...register('comment')}
              />
            </FormRow>
            {/* submit buttons */}
            <FormRow>
              <Button
                variation="secondary"
                type="reset"
                onClick={() => closeModal?.()}
              >
                Cancel
              </Button>
              <Button disabled={isWorking}>
                {isEditSession ? 'Edit Game' : 'Create New Game'}
              </Button>
            </FormRow>
          </Form>
        </MainForm>
      </Flex>
    </Div>
  );
}
export default CreateGameForm;
