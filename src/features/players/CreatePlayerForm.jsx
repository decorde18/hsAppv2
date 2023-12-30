import { styled } from 'styled-components';
import { useForm, useFieldArray } from 'react-hook-form';

import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import { supabaseUrl } from '../../services/supabase';

import { useSeasons } from '../seasons/useSeasons';
import { useCreatePeople } from '../people/useCreatePeople';
import { useCreatePlayerSeason } from './usePlayerSeasons';
import { useCreatePlayer } from './useCreatePlayer';
import { useCreateParent, useCreatePlayerParent } from '../parents/useParents';

import Logo from '../../ui/Logo';

import Button from '../../ui/Button';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Heading from '../../ui/Heading';
import Input from '../../ui/Input';
import Row from '../../ui/Row';
import Spinner from '../../ui/Spinner';
import toast from 'react-hot-toast';
import { createEditPeople } from '../../services/apiPeople';
import {
  createEditParent,
  createEditPlayerParent,
} from '../../services/apiParents';

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: ${(props) => `url(${props.imgurl})`};
  background-size: contain;
  opacity: 0.5;
  overflow: hidden;
  z-index: -1;
`;
const Div = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 100rem;
  background-color: rgba(255, 255, 255, 0.774);
  border-radius: 50px;
`;
const Div2 = styled.div`
  margin: 0px auto 10rem auto;
  border-radius: 50px;
  overflow: auto;
  padding: 3rem;
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

const gradeArray = [
  { label: '9th', value: 9 },
  { label: '10th', value: 10 },
  { label: '11th', value: 11 },
  { label: '12th', value: 12 },
];
function CreatePlayerForm() {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState,
    watch,
    control,
    setValue,
  } = useForm({
    defaultValues: {
      grade: '9',
      parents: [{ firstName: '', lastName: '', email: '' }],
    },
  });
  const { errors } = formState;
  const { fields, append, remove } = useFieldArray({
    name: 'parents',
    control,
  });

  const { currentSeason } = useCurrentSeason();
  const { isLoadingSeasons, seasons } = useSeasons();

  const { isCreatingPeople, createPeople } = useCreatePeople();
  const { isCreatingPlayer, createPlayer } = useCreatePlayer();
  const { isCreatingParent, createParent } = useCreateParent();
  const { isCreatingPlayerParent, createPlayerParent } =
    useCreatePlayerParent();
  const { isCreatingPlayerSeason, createPlayerSeason } =
    useCreatePlayerSeason();
  const isWorking =
    isCreatingPeople ||
    isCreatingPlayer ||
    isCreatingParent ||
    isCreatingPlayerParent ||
    isCreatingPlayerSeason ||
    isLoadingSeasons;
  function onSubmit(data) {
    const { grade, parents, previousSchool, ...playerPersonData } = data;
    // - convert grade to entryYear
    const entryYear =
      +seasons.find((season) => season.id === currentSeason).season -
      +grade +
      9;
    // - take people id add to playerArray and create player
    const playerData = { entryYear, previousSchool }; //returned id
    createAPlayer(playerData);
    while (isWorking) {
      return <Spinner />;
    }
    toast.success('Thanks for your submission');
    reset();

    function createAPlayer(playerData) {
      return createPeople(
        // create people records for player
        { ...playerPersonData },
        {
          onSuccess: (data) =>
            createPlayer(
              { peopleId: data.id, ...playerData },
              {
                onSuccess: (data) => {
                  //take player id and add to playerSeasons
                  createPlayerSeason({
                    playerId: data.id,
                    seasonId: currentSeason,
                    grade,
                  });
                  parents
                    .slice()
                    .forEach((parent) => createParents(parent, data.id));
                  // createParents(data.id);
                },
              }
            ),
        }
      );
    }
    function createParents(parent, playerId) {
      // useMutation won't allow onSuccess calls for each iteration. I can't figure out a different solution so I have to go straigh to API Calls
      createEditPeople({ ...parent })
        .then((data) => createEditParent({ peopleId: data.id }))
        .then((data) =>
          createEditPlayerParent({ player: playerId, parent: data.id })
        );
      // createPeople(
      //   //create people records for each parent
      //   { ...parent },
      //   {
      //     onSuccess: (data) =>
      //       createParent(
      //         // - take people id and add to parentArray and create parent for each parent
      //         { peopleId: data.id },
      //         {
      //           onSuccess: (data) =>
      //             createPlayerParent(
      //               { player: playerId, parent: data.id },
      //               {
      //                 onSuccess: (data) => {
      //                   return;
      //                 },
      //               }
      //             ),
      //         }
      //       ),
      //   }
      // );
    }
  }
  function onError(errors) {
    console.log(errors);
  }

  if (isWorking) return <Spinner />;
  const previousSeason =
    seasons.find((season) => season.id === currentSeason).season - 1;
  const teamPicUrl = `${supabaseUrl}/storage/v1/object/public/teampics/independence${previousSeason}.jpg`;
  return (
    <>
      <Background imgurl={teamPicUrl} />
      <Logo />
      <Div>
        <Heading as="h1" case="upper" location="center">
          new player form
        </Heading>
        <Div2>
          <Form onSubmit={handleSubmit(onSubmit, onError)}>
            <Row>
              <Heading as="h2">Player Information</Heading>
            </Row>
            <FormRow label="First Name *" error={errors?.firstName?.message}>
              <Input
                type="text"
                id="firstName"
                {...register('firstName', {
                  required: 'We need the player first name',
                })}
                disabled={isWorking}
              />
            </FormRow>
            <FormRow label="Last Name *" error={errors?.lastName?.message}>
              <Input
                type="text"
                id="lastName"
                {...register('lastName', {
                  required: 'We need the player last name',
                })}
                disabled={isWorking}
              />
            </FormRow>
            <FormRow label="Rising Grade *" error={errors?.grade?.message}>
              <StyledSelect
                {...register('grade', {
                  required: true,
                })}
                disabled={isWorking}
              >
                {gradeArray.map((grade) => (
                  <option key={`gradeSelect${grade.value}`} value={grade.value}>
                    {grade.label}
                  </option>
                ))}
              </StyledSelect>
            </FormRow>
            <FormRow
              label="Previous School"
              error={errors?.previousSchool?.message}
            >
              <Input
                type="text"
                id="previousSchool"
                {...register('previousSchool', {
                  required: false,
                })}
                disabled={isWorking}
              />
            </FormRow>
            <FormRow label="Email" error={errors?.email?.message}>
              <Input
                type="email"
                id="email"
                {...register('email', {
                  required: false,
                })}
                disabled={isWorking}
              />
            </FormRow>
            <Row>
              <Heading as="h2">Parent Information</Heading>
            </Row>
            {fields.map((field, index) => (
              <section key={field.id}>
                <FormRow
                  label="First Name *"
                  error={errors?.parentfirstName?.message}
                >
                  <Input
                    type="text"
                    placeholder={`Enter Parent ${index + 1} First Name`}
                    {...register(`parents.${index}.firstName`, {
                      required: 'We need a parent first name',
                    })}
                    disabled={isWorking}
                  />
                </FormRow>
                <FormRow
                  label="Last Name *"
                  error={errors?.parentlastName?.message}
                >
                  <Input
                    type="text"
                    placeholder={`Enter Parent ${index + 1} Last Name`}
                    {...register(`parents.${index}.lastName`, {
                      required: 'We need a parent last name',
                    })}
                    disabled={isWorking}
                  />
                </FormRow>
                <FormRow label="Email *" error={errors?.parentemail?.message}>
                  <Input
                    type="email"
                    placeholder={`Enter Parent ${index + 1} Email`}
                    disabled={isWorking}
                    {...register(`parents.${index}.email`, {
                      required: 'We need a parent Email',
                    })}
                  />
                </FormRow>
                <div>
                  {fields.length !== 1 && (
                    <button onClick={() => remove(index)}>Remove Parent</button>
                  )}
                  {fields.length - 1 === index && (
                    <button
                      onClick={() =>
                        append({ firstName: '', lastName: '', email: '' })
                      }
                    >
                      Add Parent
                    </button>
                  )}
                </div>
              </section>
            ))}
            <FormRow>
              <Button variation="secondary" type="reset">
                Cancel
              </Button>
              <Button disabled={isWorking}>Add to Email List</Button>
            </FormRow>
          </Form>
        </Div2>
      </Div>
    </>
  );
}

export default CreatePlayerForm;
