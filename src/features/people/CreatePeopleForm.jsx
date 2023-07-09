import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Textarea from '../../ui/Textarea';
import FormRow from '../../ui/FormRow';

import { useForm } from 'react-hook-form';
import { useCreatePeople } from './useCreatePeople';
// import { useEditPeople } from './useEditPeople';

function CreatePeopleForm({ personToEdit = {} }) {
  // const { id: editId, ...editValues } = personToEdit;
  // const isEditSession = Boolean(editId);
  const isEditSession = null;
  // const { register, handleSubmit, reset, getValues, formState } = useForm({
  //   defaultValues: isEditSession ? editValues : {},
  // });
  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: {},
  });
  const { errors } = formState;
  const { isCreating, createPeople } = useCreatePeople();
  // const queryClient = useQueryClient();
  // const { isEditing, editPeople } = useEditPeople();
  // const isWorking = isCreating || isEditing;
  const isWorking = isCreating;
  function onSubmit(data) {
    // mutate(data); //no image needed
    // const image = typeof data.image === 'string' ? data.image : data.image[0];
    // if (isEditSession)
    //   editPeople(
    //     { newPeopleData: { ...data, image }, id: editId },
    //     { onSuccess: (data) => reset() }
    //   );
    // else
    createPeople(
      // { ...data, image: data.image[0] },
      data,
      { onSuccess: (data) => reset() }
    );
  }
  function onError(errors) {
    console.log(errors);
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="Title" error={errors?.title?.message}>
        <Input
          type="text"
          id="title"
          disabled={isWorking}
          {...register('title')}
        />
      </FormRow>
      <FormRow label="First Name" error={errors?.firstName?.message}>
        <Input
          type="text"
          id="firstName"
          disabled={isWorking}
          {...register('firstName', { required: 'This field is required' })}
        />
      </FormRow>
      <FormRow label="Last Name" error={errors?.lastName?.message}>
        <Input
          type="text"
          id="lastName"
          disabled={isWorking}
          {...register('lastName', { required: 'This field is required' })}
        />
      </FormRow>
      <FormRow label="Nickname" error={errors?.nickName?.message}>
        <Input
          type="text"
          id="nickName"
          disabled={isWorking}
          {...register('nickName')}
        />
      </FormRow>
      <FormRow label="Email" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isWorking}
          {...register('email')}
        />
      </FormRow>
      <FormRow label="Cell" error={errors?.cellNumber?.message}>
        <Input
          type="number"
          id="cellNumber"
          disabled={isWorking}
          {...register('cellNumber')}
        />
      </FormRow>

      <FormRow>
        <Button variation="secondary" type="reset">
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
