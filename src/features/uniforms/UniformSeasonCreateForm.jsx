import Button from '../../ui/Button';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Heading from '../../ui/Heading';
import Row from '../../ui/Row';

import { useForm } from 'react-hook-form';

import { useEffect, useState } from 'react';
import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';
import {
  useCreateData,
  useData,
  useUpdateData,
} from '../../services/useUniversal';
import Select from '../../ui/Select';

function UniformSeasonCreateForm({ uniformToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = uniformToEdit;
  const { currentSeason } = useCurrentSeason();

  const teamLevels = [
    ...currentSeason.teamLevels.map((level) => ({
      value: level,
      label: level,
    })),
    { value: 'GK', label: 'GK' },
  ];

  const isEditSession = Boolean(editId);

  const { isLoading: isLoadingUniforms, data: uniforms } = useData({
    table: 'uniforms',
    filter: [{ field: 'active', value: true }],
  });
  const { isUpdating, updateData: updateUniformSeason } = useUpdateData({
    table: 'uniformSeasons',
  });
  const {
    isCreating: isCreatingUniformSeason,
    createData: createUniformSeason,
  } = useCreateData({ table: 'uniformSeasons' });
  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;

  const [isWorking, setIsWorking] = useState(false);
  useEffect(
    function () {
      isUpdating || isCreatingUniformSeason || isLoadingUniforms
        ? setIsWorking(true)
        : setIsWorking(false);
    },
    [isCreatingUniformSeason, isLoadingUniforms, isUpdating]
  );
  if (isLoadingUniforms) return;
  const uniformTypes = [
    ...uniforms.map((uniform) => ({
      value: uniform.id,
      label: `${uniform.type} ${uniform.brand} ${uniform.style} ${uniform.color}`,
    })),
  ];

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
        {
          table: 'uniformSeasons',
          newData: {
            season: currentSeason,
            team: data.field,
            uniform: data.id,
          },
        },
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
          <Select
            options={teamLevels}
            register={{
              ...register('field', {
                // validate: errors?.uniform?.message,
              }),
            }}
          />
        </FormRow>
        <FormRow label="Uniform *" error={errors?.uniform?.message}>
          <Select
            options={uniformTypes}
            register={{
              ...register('id', {
                // validate: errors?.uniform?.message,
              }),
            }}
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
