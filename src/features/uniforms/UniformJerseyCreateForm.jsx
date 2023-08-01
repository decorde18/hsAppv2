import Button from '../../ui/Button';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Heading from '../../ui/Heading';
import Input from '../../ui/Input';
import Row from '../../ui/Row';

import { useForm } from 'react-hook-form';
import {
  useUniformJerseys,
  useUpdateUniformJersey,
  useCreateUniformJersey,
} from './useUniforms';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../App';

function UniformJerseyCreateForm({ uniformToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = uniformToEdit;

  const isEditSession = Boolean(editId);
  const { isLoadingUniformJerseys, uniforms } = useUniformJerseys();
  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;
  const { isCreatingUniformJersey, createUniformJersey } =
    useCreateUniformJersey();
  const { isUpdating, updateUniformJersey } = useUpdateUniformJersey();

  const [isWorking, setIsWorking] = useState(false);
  useEffect(
    function () {
      isUpdating || isCreatingUniformJersey || isLoadingUniformJerseys
        ? setIsWorking(true)
        : setIsWorking(false);
    },
    [isCreatingUniformJersey, isUpdating]
  );

  function onSubmit(data) {
    if (isEditSession) {
      updateUniformJersey(
        { newUniformJerseyData: data, id: editId },
        {
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          },
          onError: (err) => console.log(err),
        }
      );
      return;
    } else
      createUniformJersey(
        { ...data },
        {
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          },
        }
      );
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
        <Heading as="h2">UniformJersey Information</Heading>
        <FormRow label="Type *" error={errors?.type?.message}>
          <Input
            type="text"
            id="type"
            {...register('type', {
              required: 'We need the type of uniform',
            })}
            disabled={isWorking}
          />
        </FormRow>
        <FormRow label="Brand *" error={errors?.brand?.message}>
          <Input
            type="text"
            id="brand"
            {...register('brand', {
              required: 'We need the brand of uniform',
            })}
            disabled={isWorking}
          />
        </FormRow>
        <FormRow label="Color *" error={errors?.color?.message}>
          <Input
            type="text"
            id="color"
            {...register('color', {
              required: 'We need the color of uniform',
            })}
            disabled={isWorking}
          />
        </FormRow>
        <FormRow label="Style *" error={errors?.style?.message}>
          <Input
            type="text"
            id="style"
            {...register('style', {
              required: 'We need the style of uniform',
            })}
            disabled={isWorking}
          />
        </FormRow>
        <FormRow label="Year *" error={errors?.year?.message}>
          <Input
            type="text"
            id="year"
            {...register('year', {
              required: 'We need the year of uniform',
            })}
            disabled={isWorking}
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
          {isEditSession ? 'Edit UniformJersey' : 'Create New UniformJersey'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default UniformJerseyCreateForm;
