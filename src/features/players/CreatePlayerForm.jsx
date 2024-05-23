import styled from 'styled-components';
import { useForm, useFieldArray } from 'react-hook-form';
import { useState } from 'react';

import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import { supabaseUrl } from '../../services/supabase';

import { createEditPeople } from '../../services/apiPeople';
import {
  createEditParent,
  createEditPlayerParent,
} from '../../services/apiParents';
import { useCreatePeople } from '../people/useCreatePeople';
import { useCreatePlayerSeason } from './usePlayerSeasons';
import { useCreatePlayer } from './useCreatePlayer';
// import { useCreateParent, useCreatePlayerParent } from '../parents/useParents';
import { useParents } from '../parents/useParents';
import { usePlayers } from '../players/usePlayers';
import { useSeasons } from '../seasons/useSeasons';

import Button from '../../ui/Button';
import Select from '../../ui/Select';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import FormRowVertical from '../../ui/FormRowVertical';
import Heading from '../../ui/Heading';
import Input from '../../ui/Input';
import Row from '../../ui/Row';
import Spinner from '../../ui/Spinner';
import toast from 'react-hot-toast';

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: ${(props) => `url(${props.imgurl})`};
  opacity: 0.5;
  overflow: hidden;
  z-index: -1;
  @media (min-width: 768px) {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }

  @media only screen and (max-width: 62.5em) {
    background-position: top;
    background-size: contain;
    background-repeat: no-repeat;
  }
`;
const Container = styled.div`
  margin: 0;
  max-width: 100rem;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-lg);
  max-height: 95dvh;
  overflow: auto;
  opacity: 0.9;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  /* padding: 2.5dvh 0; */
`;
const Header = styled.header`
  padding: 0 1rem;
`;
const Div2 = styled.div`
  padding: 1rem 5rem;
  border-radius: var(--border-radius-lg);
  /* height: 100dvh; */
  min-width: 95rem;
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
  width: 100%;
  display: flex;
  gap: 1rem;
`;
const VerticalGap = styled.div`
  height: 2rem;
  margin: 2rem;
  border-top: 1px solid var(--color-grey-100);
`;

const gradeArray = [
  { label: '9th', value: 9 },
  { label: '10th', value: 10 },
  { label: '11th', value: 11 },
  { label: '12th', value: 12 },
];
function CreatePlayerForm() {
  const { register, handleSubmit, reset, formState, control, setValue } =
    useForm({
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
  const { isLoadingPlayers } = usePlayers();
  const { isLoadingParents, parents } = useParents();

  const { isCreatingPeople, createPeople } = useCreatePeople();
  const { isCreatingPlayer, createPlayer } = useCreatePlayer();
  const { isCreatingPlayerSeason, createPlayerSeason } =
    useCreatePlayerSeason();
  const isWorking =
    isCreatingPeople ||
    isCreatingPlayer ||
    isCreatingPlayerSeason ||
    isLoadingSeasons ||
    isLoadingPlayers ||
    isLoadingParents;

  const [formerParent, setFormerParent] = useState([
    { index: 0, parentId: 'default' },
  ]);

  function handleSelect(e) {
    //todo I am here, condense and refactor this code
    //todo on remove parent, that id must be removed in state --- that also  means all index after must  be lowered by one
    const value = e.target.value;
    const index = +e.target.name;
    const parent = parents.find((parent) => parent.id === +value);
    //on change, we need to update the state with the index and value
    //we must also setValue - if default to null, otherwise to values
    setFormerParent(
      formerParent.map((former) =>
        former.index === index
          ? { ...former, parentId: parent ? +value : 'default' }
          : { ...former }
      )
    );
    if (value === 'default') return;
    setValue(`parents[${index}].firstName`, parent.people.firstName);
    setValue(`parents[${index}].lastName`, parent.people.lastName);
    setValue(`parents[${index}].email`, parent.people.email);

    return;
  }
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
    resetForm();

    function createAPlayer(playerData) {
      return createPeople(
        // create people records for player
        { ...playerPersonData, gender: 'F' },
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
                  parents.slice().forEach((parent, index) => {
                    const formerP = formerParent.find(
                      (former) => former.index === index
                    );
                    formerP.parentId !== 'default'
                      ? addPlayerParent({
                          player: data.id,
                          parent: formerP.parentId,
                        })
                      : createParents(parent, data.id);
                  });
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
          // createEditPlayerParent({ player: playerId, parent: data.id })
          addPlayerParent({ player: playerId, parent: data.id })
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
    function addPlayerParent({ player, parent }) {
      createEditPlayerParent({ player, parent });
    }
  }

  function addParent(index) {
    setFormerParent([...formerParent, { index, parentId: 'default' }]);
    append({ firstName: '', lastName: '', email: '' });
  }
  function removeParent(index) {
    remove(index);
    setFormerParent(
      formerParent
        .filter((former) => former.index !== index)
        .map((former) =>
          former.index > index
            ? { ...former, index: former.index - 1 }
            : { ...former }
        )
    );
  }
  function resetForm() {
    setFormerParent([{ index: 0, parentId: 'default' }]);
    reset();
  }
  function onError(errors) {
    console.log(errors);
  }
  if (isWorking) return <Spinner />;
  const previousSeason =
    seasons.find((season) => season.id === currentSeason).season - 1;
  const teamPicUrl = `${supabaseUrl}/storage/v1/object/public/teampics/independence${previousSeason}.jpg`;

  const sortedParents = parents
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

  const parentSelectArray = sortedParents.reduce(
    (acc, parent) =>
      (acc = [
        ...acc,
        {
          value: parent.id,
          label: `${parent.people.firstName} ${parent.people.lastName}`,
        },
      ]),
    [{ value: 'default', label: 'Select if a returning parent' }]
  );

  return (
    <>
      <Background imgurl={teamPicUrl} />
      <Container>
        <Div2>
          <Form onSubmit={handleSubmit(onSubmit, onError)}>
            <Header>
              <Heading as="h1" case="upper" location="center">
                new player form
              </Heading>
            </Header>
            <Row>
              <Heading as="h2">Player Information</Heading>
            </Row>
            <Flex>
              <FormRowVertical
                label="First Name *"
                error={errors?.firstName?.message}
              >
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  disabled={isWorking}
                  size="25"
                  register={{
                    ...register('firstName', {
                      required: 'We need the player first name',
                    }),
                  }}
                  ref={null}
                />
              </FormRowVertical>
              <FormRowVertical
                label="Last Name *"
                error={errors?.lastName?.message}
              >
                <Input
                  type="text"
                  id="lastName"
                  register={{
                    ...register('lastName', {
                      required: 'We need the player last name',
                    }),
                  }}
                  disabled={isWorking}
                  size="25"
                  ref={null}
                />
              </FormRowVertical>
              <FormRowVertical label="Email" error={errors?.email?.message}>
                <Input
                  type="email"
                  id="email"
                  register={{
                    ...register('email', {
                      required: false,
                    }),
                  }}
                  disabled={isWorking}
                  size="25"
                  ref={null}
                />
              </FormRowVertical>
            </Flex>
            <Flex>
              <FormRowVertical
                label="Rising Grade *"
                error={errors?.grade?.message}
              >
                <StyledSelect
                  {...register('grade', {
                    required: true,
                  })}
                  disabled={isWorking}
                >
                  {gradeArray.map((grade) => (
                    <option
                      key={`gradeSelect${grade.value}`}
                      value={grade.value}
                    >
                      {grade.label}
                    </option>
                  ))}
                </StyledSelect>
              </FormRowVertical>
              <FormRowVertical
                label="Previous School"
                error={errors?.previousSchool?.message}
              >
                <Input
                  type="text"
                  id="previousSchool"
                  register={{
                    ...register('previousSchool', {
                      required: false,
                    }),
                  }}
                  disabled={isWorking}
                  size="25"
                  ref={null}
                />
              </FormRowVertical>
            </Flex>
            <VerticalGap />
            <Row>
              <Heading as="h2">Parent Information</Heading>
            </Row>
            {fields.map((field, index) => (
              <section key={field.id}>
                <Flex>
                  <Select
                    options={parentSelectArray}
                    name={index}
                    onChange={handleSelect}
                  />
                </Flex>
                <Flex>
                  <FormRowVertical
                    label="First Name *"
                    name="pfirstName"
                    error={errors.parents?.[index]?.firstName.message}
                  >
                    <Input
                      type="text"
                      placeholder={`Enter Parent ${index + 1} First Name`}
                      register={{
                        ...register(`parents.${index}.firstName`, {
                          required: 'We need a parent first name',
                        }),
                      }}
                      disabled={
                        isWorking ||
                        formerParent.filter(
                          (parent) =>
                            parent.index === index &&
                            parent.parentId !== 'default'
                        ).length > 0
                      }
                      size="25"
                      ref={null}
                    />
                  </FormRowVertical>
                  <FormRowVertical
                    label="Last Name *"
                    error={errors.parents?.[index]?.lastName.message}
                  >
                    <Input
                      type="text"
                      placeholder={`Enter Parent ${index + 1} Last Name`}
                      register={{
                        ...register(`parents.${index}.lastName`, {
                          required: 'We need a parent last name',
                        }),
                      }}
                      disabled={
                        isWorking ||
                        formerParent.filter(
                          (parent) =>
                            parent.index === index &&
                            parent.parentId !== 'default'
                        ).length > 0
                      }
                      size="25"
                      ref={null}
                    />
                  </FormRowVertical>
                  <FormRowVertical
                    label="Email *"
                    error={errors.parents?.[index]?.email.message}
                  >
                    <Input
                      type="email"
                      placeholder={`Enter Parent ${index + 1} Email`}
                      disabled={
                        isWorking ||
                        formerParent.filter(
                          (parent) =>
                            parent.index === index &&
                            parent.parentId !== 'default'
                        ).length > 0
                      }
                      register={{
                        ...register(`parents.${index}.email`, {
                          required: 'We need a parent Email',
                        }),
                      }}
                      size="25"
                      ref={null}
                    />
                  </FormRowVertical>
                </Flex>
                <Flex>
                  <div>
                    {fields.length !== 1 && (
                      <Button
                        variation="danger"
                        onClick={() => removeParent(index)}
                      >
                        Remove Parent
                      </Button>
                    )}
                    {fields.length - 1 === index && (
                      <Button
                        variation="primary"
                        onClick={() => addParent(index + 1)}
                      >
                        Add Another Parent
                      </Button>
                    )}
                  </div>
                </Flex>
                <VerticalGap />
              </section>
            ))}
            <FormRow>
              <Button variation="secondary" type="reset" onClick={resetForm}>
                Cancel
              </Button>
              <Button disabled={isWorking}>Add to Email List</Button>
            </FormRow>
          </Form>
        </Div2>
      </Container>
    </>
  );
}

export default CreatePlayerForm;
