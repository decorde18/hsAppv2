import { useCreateGame, useEditGame } from './useGames';
import styled from 'styled-components';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import Textarea from '../../ui/Textarea';
import FormRow from '../../ui/FormRow';

import { useForm } from 'react-hook-form';
import Select from '../../ui/Select';
import Row from '../../ui/Row';
import Heading from '../../ui/Heading';
import { useQueryClient } from '@tanstack/react-query';
import { useLocations } from '../locations/useLocations';
import { useSchools } from '../schools/useSchools';
import Spinner from '../../ui/Spinner';
import { useState } from 'react';
import ButtonChecked from '../../ui/ButtonChecked';

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
  const queryClient = useQueryClient();
  // const games = queryClient.getQueryData(['games']);
  const { isLoadingLocations, locations } = useLocations();
  const { isLoadingSchools, schools } = useSchools();
  const { id: editId, ...editValues } = gameToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const { errors } = formState;
  const { isCreating, createGame } = useCreateGame();

  const { isEditing, editGame } = useEditGame();

  const [team, setTeam] = useState('varsity');
  const [classification, setClassification] = useState('');
  const [location, setLocation] = useState('default');
  const [home, setHome] = useState(false);
  const [district, setDistrict] = useState(false);
  const [seasonTime, setSeasonTime] = useState(false);

  const isWorking = isCreating || isEditing;
  if (isLoadingLocations || isLoadingSchools) return <Spinner />;

  function handleOpponentChange(e) {
    const selectedSchool = schools.find(
      (school) => school.id === +e.target.value
    );
    setLocation(
      selectedSchool.home_location ? selectedSchool.home_location : 'default'
    );
    setClassification(
      selectedSchool.classification ? selectedSchool.classification : 'default'
    );
    //todo set district similarly
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
    if (isEditSession)
      editGame(
        { newGameData: { ...data }, id: editId },
        {
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          },
        }
      );
    else {
      data = { ...data, seasonTime };
      console.log(data);
    }
    // createGame(
    //   { ...data },
    //   {
    //     onSuccess: (data) => {
    //       reset();
    //       onCloseModal?.();
    //     },
    //   }
    // );
  }
  function onError(errors) {
    console.log(errors);
  }
  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? 'Modal' : 'regular'}
    >
      <Row>
        <Header as="h2" location="center">
          <span>Team Type </span>
          <StyledSelect onChange={handleTeamTypeChange}>
            <option value="varsity">Varsity</option>
            <option value="jv">JV</option>
          </StyledSelect>
        </Header>
        <FormRow label="Game Type" error={errors?.gameType?.message}>
          <StyledSelect
            type="white"
            {...register('gameType', { required: 'This field is required' })}
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
            {...register('date', { required: 'This field is required' })}
          />
        </FormRow>
        <FormRow label="Time" error={errors?.time?.message}>
          <Input
            type="time"
            id="time"
            disabled={isWorking}
            {...register('time')}
          />
        </FormRow>
        <FormRow label="Opponent *" error={errors?.opponent?.message}>
          <StyledSelect
            {...register('opponent', { required: 'This field is required' })}
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
        <FormRow label="Class" error={errors?.classification?.message}>
          <StyledSelect
            type="white"
            // onChange={handleOpponentChange}
            // value={''}
            {...register('classification', {
              required: 'This field is required',
            })}
            value={classification}
            onChange={(e) => setClassification(e.target.value)}
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
            {...register('district')}
            value={district}
            label={district ? 'District Game' : 'Non-District'}
            onClick={handleDistrictChange}
          />
        </FormRow>
        <FormRow error={errors?.home?.message}>
          <ButtonChecked
            {...register('home')}
            value={home}
            label={home ? 'Home Team' : 'Away Team'}
            onClick={handleHomeTeamChange}
          />
        </FormRow>
        <FormRow label="Location *" error={errors?.location?.message}>
          <StyledSelect
            type="white"
            value={location}
            {...register('location', { required: 'This field is required' })}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="default" disabled>
              Please Select Location
            </option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
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
// function onSubmit(data) {
//   // mutate(data); //no image needed
//   const image = typeof data.image === 'string' ? data.image : data.image[0];
//   if (isEditSession)
//     editGame(
//       { newGameData: { ...data, image }, id: editId },
//       {
//         onSuccess: (data) => {
//           reset();
//           onCloseModal?.();
//         },
//       }
//     );
//   else
//     createGame(
//       { ...data, image: data.image[0] },
//       {
//         onSuccess: (data) => {
//           reset();
//           onCloseModal?.();
//         },
//       }
//     );
// }
// function onError(errors) {
//   console.log(errors);
// }
