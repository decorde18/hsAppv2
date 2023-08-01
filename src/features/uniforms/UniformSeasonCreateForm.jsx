import Button from '../../ui/Button';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Heading from '../../ui/Heading';
import Input from '../../ui/Input';
import Row from '../../ui/Row';

import { useForm } from 'react-hook-form';
import {
  useUniformSeasons,
  useUpdateUniformSeason,
  useCreateUniformSeason,
} from './useUniforms';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../App';

function UniformSeasonCreateForm({ uniformToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = uniformToEdit;
  const currentSeason = +localStorage.getItem('currentSeason');
  const isEditSession = Boolean(editId);
  const { isLoadingUniformSeasons, uniforms } = useUniformSeasons();
  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;
  const { isCreatingUniformSeason, createUniformSeason } =
    useCreateUniformSeason();
  const { isUpdating, updateUniformSeason } = useUpdateUniformSeason();

  const [isWorking, setIsWorking] = useState(false);
  useEffect(
    function () {
      isUpdating || isCreatingUniformSeason || isLoadingUniformSeasons
        ? setIsWorking(true)
        : setIsWorking(false);
    },
    [isCreatingUniformSeason, isUpdating]
  );

  function onSubmit(data) {
    if (isEditSession) {
      delete data.uniforms;
      updateUniformSeason(
        { newUniformSeasonData: data, id: editId },
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
      createUniformSeason(
        { ...data, season: currentSeason },
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
        <Heading as="h2">UniformSeason Information</Heading>
        <FormRow label="Team *" error={errors?.team?.message}>
          <Input
            type="text"
            id="team"
            {...register('team', {
              required: 'We need the type of uniform',
            })}
            disabled={isWorking}
          />
        </FormRow>
        <FormRow label="Uniform *" error={errors?.uniform?.message}>
          <Input
            type="number"
            id="uniform"
            {...register('uniform', {
              required: 'We need the type of uniform',
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
          {isEditSession ? 'Edit UniformSeason' : 'Create New UniformSeason'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default UniformSeasonCreateForm;
