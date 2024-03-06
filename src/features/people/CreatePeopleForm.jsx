import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FormRow from '../../ui/FormRow';

import { useForm } from 'react-hook-form';
import { useCreatePeople } from './useCreatePeople';
import { useEditPeople } from './useEditPeople';
import { useCreateCoach } from '../coaches/useCoaches';

function CreatePeopleForm({ personToEdit = {}, onCloseModal, schoolToAddTo }) {
  const { id: editId, ...editValues } = personToEdit;
  const isEditSession = Boolean(editId);
  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;
  const { isCreating, createPeople } = useCreatePeople();
  const { isEditing, editPeople } = useEditPeople();
  const { createCoach, isCreating: isCreatingCoach } = useCreateCoach();
  const isWorking = isCreating || isEditing || isCreatingCoach;

  function onSubmit(data) {
    if (isEditSession)
      editPeople(
        { newPeopleData: { ...data }, id: editId },
        { onSuccess: (data) => reset() }
      );
    else
      createPeople(
        { ...data },
        {
          onSuccess: (data) => {
            if (schoolToAddTo)
              createCoach({ coach: data.id, team: schoolToAddTo, girls: true });
            closeModal();
          },
        }
      );
  }
  function onError(errors) {
    console.log(errors);
  }
  function closeModal() {
    reset();
    onCloseModal?.();
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="Title" error={errors?.title?.message}>
        <Input
          type="text"
          id="title"
          disabled={isWorking}
          register={{ ...register('title') }}
        />
      </FormRow>
      <FormRow label="First Name" error={errors?.firstName?.message}>
        <Input
          type="text"
          id="firstName"
          disabled={isWorking}
          register={{
            ...register('firstName', { required: 'This field is required' }),
          }}
        />
      </FormRow>
      <FormRow label="Last Name" error={errors?.lastName?.message}>
        <Input
          type="text"
          id="lastName"
          disabled={isWorking}
          register={{
            ...register('lastName', { required: 'This field is required' }),
          }}
        />
      </FormRow>
      <FormRow label="Nickname" error={errors?.nickName?.message}>
        <Input
          type="text"
          id="nickName"
          disabled={isWorking}
          register={{ ...register('nickName') }}
        />
      </FormRow>
      <FormRow label="Email" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isWorking}
          register={{ ...register('email') }}
        />
      </FormRow>
      <FormRow label="Cell" error={errors?.cellNumber?.message}>
        <Input
          type="number"
          id="cellNumber"
          disabled={isWorking}
          register={{ ...register('cellNumber') }}
        />
      </FormRow>

      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          onClick={() => closeModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? 'Edit People' : 'Create New Person'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreatePeopleForm;
