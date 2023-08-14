import Button from '../../ui/Button';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Heading from '../../ui/Heading';
import Input from '../../ui/Input';
import Row from '../../ui/Row';

import { useForm } from 'react-hook-form';
import { useUniforms, useUpdateUniform, useCreateUniform } from './useUniforms';
import { useContext, useEffect, useState } from 'react';
// import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
function UniformEditForm({ uniformToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = uniformToEdit;

  const isEditSession = Boolean(editId);
  const { isLoadingUniforms, uniforms } = useUniforms();
  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;
  const { isCreatingUniform, createUniform } = useCreateUniform();
  const { isUpdating, updateUniform } = useUpdateUniform();

  const [isWorking, setIsWorking] = useState(false);
  useEffect(
    function () {
      isUpdating || isCreatingUniform || isLoadingUniforms
        ? setIsWorking(true)
        : setIsWorking(false);
    },
    [isCreatingUniform, isUpdating]
  );

  function onSubmit(data) {
    if (isEditSession) {
      updateUniform(
        { newUniformData: data, id: editId },
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
      createUniform(
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
        <Heading as="h2">Uniform Information</Heading>
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
          {isEditSession ? 'Edit Uniform' : 'Create New Uniform'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default UniformEditForm;
