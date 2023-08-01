import Button from '../../ui/Button';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Heading from '../../ui/Heading';
import Input from '../../ui/Input';
import Row from '../../ui/Row';

import { useForm } from 'react-hook-form';
import { useCreatePeople } from '../people/useCreatePeople';
import { useCreatePlayerSeason } from './usePlayerSeasons';
import { useCreatePlayer } from './useCreatePlayer';
import { useEditPlayer } from './useEditPlayer';
import { useCreateParent, useCreatePlayerParent } from '../parents/useParents';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../App';

//TODO FUTURE if new person is not needed, get person

function CreatePlayerForm({ playerToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = playerToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;
  const { isCreatingPeople, createPeople } = useCreatePeople();
  const { isCreatingPlayer, createPlayer } = useCreatePlayer();
  const { isCreatingParent, createParent } = useCreateParent();
  const { isCreatingPlayerParent, createPlayerParent } =
    useCreatePlayerParent();
  const { isCreatingPlayerSeason, createPlayerSeason } =
    useCreatePlayerSeason();

  const { isEditingPlayer, editPlayer } = useEditPlayer();

  const { currentSeason } = useContext(AppContext);

  let parentId;
  let playerId;

  const isWorking = false;
  function onSubmit(data) {
    if (isEditSession) {
      const { people: playerPeopleData } = { data };
      delete data.people;
      editPlayer(
        { newPlayerData: data, id: editId },
        {
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          },
          onError: (err) => console.log(err),
        }
      );
      return;
    }

    //separate player from parent
    const { parentfirstName, parentlastName, parentemail, ...playerTempData } =
      data;
    const parentPeopleData = {
      firstName: parentfirstName,
      lastName: parentlastName,
      email: parentemail,
    };
    const { grade, previousSchool, ...playerPeopleData } = playerTempData;

    //get player entryYear
    const entryYear = currentSeason.season - (+grade - 9);
    const playerData = { previousSchool, entryYear };

    createPeople(
      { ...playerPeopleData },
      {
        onSuccess: (data) => {
          // create player and get ID
          createPlayer(
            { peopleId: data.id, ...playerData },
            {
              onSuccess: (data) => {
                playerId = data.id;
                createPeople(
                  { ...parentPeopleData },
                  {
                    onSuccess: (data) => {
                      // create player and get ID
                      createParent(
                        { peopleId: data.id },
                        {
                          onSuccess: (data) => {
                            parentId = data.id;
                            addPlayerParent();
                          },
                        }
                      );
                    },
                  }
                );
              },
            }
          );
        },
      }
    );
    function addPlayerParent() {
      createPlayerParent({ player: playerId, parent: parentId });
      addPlayerSeason();
    }
    function addPlayerSeason() {
      createPlayerSeason({
        playerId,
        seasonId: currentSeason.id,
        grade,
        status: 'Interested',
      });

      reset();
      onCloseModal?.();
    }
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
        <Heading as="h2">Player Information</Heading>
        <FormRow label="First Name *" error={errors?.firstName?.message}>
          <Input
            type="text"
            id="firstName"
            {...register('people.firstName', {
              required: 'We need your first name',
            })}
            disabled={isWorking}
          />
        </FormRow>
        <FormRow label="Last Name *" error={errors?.lastName?.message}>
          <Input
            type="text"
            id="lastName"
            {...register('people.lastName', {
              required: 'We need your last name',
            })}
            disabled={isWorking}
          />
        </FormRow>
        {isEditSession && (
          <FormRow label="Date of Birth" error={errors?.dateOfBirth?.message}>
            <Input
              type="date"
              id="dateOfBirth"
              {...register('dateOfBirth')}
              disabled={isWorking}
            />
          </FormRow>
        )}
        {!isEditSession && (
          <FormRow label="Rising Grade *" error={errors?.grade?.message}>
            <select
              id="grade"
              {...register('grade', {
                required: 'We need your grade',
              })}
              disabled={isWorking}
            >
              <option value="9">9th</option>
              <option value="10">10th</option>
              <option value="11">11th</option>
              <option value="12">12th</option>
            </select>
          </FormRow>
        )}
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
            {...register('people.email', {
              required: false,
            })}
            disabled={isWorking}
          />
        </FormRow>
      </Row>
      {!isEditSession && (
        <>
          <Row>
            <Heading as="h2">Parent Information</Heading>
          </Row>
          <FormRow
            label="First Name *"
            error={errors?.parentfirstName?.message}
          >
            <Input
              type="text"
              id="parentfirstName"
              {...register('parentfirstName', {
                required: 'We need the parent first name',
              })}
              disabled={isWorking}
            />
          </FormRow>
          <FormRow label="Last Name *" error={errors?.parentlastName?.message}>
            <Input
              type="text"
              id="parentlastName"
              {...register('parentlastName', {
                required: 'We need the parent last name',
              })}
              disabled={isWorking}
            />
          </FormRow>
          <FormRow label="Email *" error={errors?.parentemail?.message}>
            <Input
              type="email"
              id="parentemail"
              disabled={isWorking}
              {...register('parentemail', {
                required: 'We need a parent Email',
              })}
            />
          </FormRow>
        </>
      )}
      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? 'Edit Player' : 'Create New Player'}
        </Button>
      </FormRow>
    </Form>
  );

  //     <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
  //       <Input
  //         type="number"
  //         id="maxCapacity"
  //         disabled={isWorking}
  //         {...register('maxCapacity', {
  //           required: 'This field is required',
  //           min: { value: 1, message: 'Capacity should be at least 1' },
  //         })}
  //       />
  //     </FormRow>

  //     <FormRow label="Regular price" error={errors?.regularPrice?.message}>
  //       <Input
  //         type="number"
  //         id="regularPrice"
  //         disabled={isWorking}
  //         {...register('regularPrice', {
  //           required: 'This field is required',
  //           min: { value: 1, message: 'Capacity should be at least 1' },
  //         })}
  //       />
  //     </FormRow>

  //     <FormRow label="Discount" error={errors?.discount?.message}>
  //       <Input
  //         type="number"
  //         id="discount"
  //         defaultValue={0}
  //         disabled={isWorking}
  //         {...register('discount', {
  //           required: 'This field is required',
  //           validate: (value) =>
  //             +value <= +getValues().regularPrice ||
  //             'Discount should be less than price',
  //         })}
  //       />
  //     </FormRow>

  //     <FormRow
  //       label="Description for website"
  //       error={errors?.description?.message}
  //     >
  //       <Textarea
  //         type="number"
  //         id="description"
  //         disabled={isWorking}
  //         defaultValue=""
  //         {...register('description', { required: 'This field is required' })}
  //       />
  //     </FormRow>

  //     <FormRow label="Cabin photo" error={errors?.image?.message}>
  //       <FileInput
  //         id="image"
  //         accept="image/*"
  //         {...register('image', {
  //           required: isEditSession ? false : 'This field is required',
  //         })}
  //       />
  //     </FormRow>

  //     <FormRow>
  //       <Button
  //         variation="secondary"
  //         type="reset"
  //         onClick={() => onCloseModal?.()}
  //       >
  //         Cancel
  //       </Button>
  //       <Button disabled={isWorking}>
  //         {isEditSession ? 'Edit Cabin' : 'Create New Cabin'}
  //       </Button>
  //     </FormRow>
  //   </Form>
  // );
}

export default CreatePlayerForm;
