import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useEffect, useState } from 'react';
import Button from '../../ui/Button';
import { useCreateData, useData } from '../../services/useUniversal';

function CreateSeasonForm() {
  const { recentSeason, updateCurrentSeason, updateRecentSeason } =
    useCurrentSeason();
  const navigate = useNavigate();

  const { register, handleSubmit, reset, setValue, formState } = useForm();
  const { errors } = formState;

  const { createData, isCreating } = useCreateData();

  const { isLoading: isLoadingPlayers, data: players } = useData({
    table: 'players',
    filter: [
      { field: 'entryYear', value: recentSeason.season - 2, equality: 'gte' },
    ],
  });
  const { isLoading: isLoadingPlayerSeasons, data: playerSeasons } = useData({
    table: 'playerSeasons',
    filter: [
      { field: 'seasonId', value: recentSeason.id },
      { field: 'grade', value: 12, equality: 'lt' },
    ],
  });

  const [newSeason, setNewSeason] = useState({});

  const isWorking = isCreating || isLoadingPlayerSeasons || isLoadingPlayers;

  useEffect(
    function () {
      const newSeasonFields = {
        ...recentSeason,
        season: recentSeason.season + 1,
        schoolYear: `${recentSeason.season + 1}-${recentSeason.season + 2}`,
      };
      delete newSeasonFields.id;
      delete newSeasonFields.created_at;
      delete newSeasonFields.updated_at;
      delete newSeasonFields.seasonPhase;
      setNewSeason(newSeasonFields);
    },
    [recentSeason]
  );

  // UPDATE DEFAULT VALUES AFTER LOAD
  useEffect(() => {
    setValue('teamMascot', newSeason.teamMascot);
    setValue('season', newSeason.season);
    setValue('schoolYear', newSeason.schoolYear);
    setValue('classification', newSeason.classification);
    setValue('region', newSeason.region);
    setValue('district', newSeason.district);
    setValue('teamLevels', newSeason.teamLevels);
  }, [newSeason, setValue]);

  function onSubmit(data) {
    data = { ...newSeason, ...data };

    createData(
      {
        table: 'seasons',
        newData: { ...data },
        toast: false,
      },
      {
        onSuccess: (data) => {
          const newPlayerSeasonData = playerSeasons.map((playerS) => {
            return {
              playerId: playerS.playerId,
              seasonId: data.data[0].id,
              enrolledLastYear: true,
              grade: playerS.grade + 1,
              livesWithParents: playerS.livesWithParents || true,
              returningPlayer: playerS.status === 'Rostered',
              status:
                playerS.status === 'Rostered' ? 'Interested' : 'Not Playing',
            };
          });
          console.log(data, newPlayerSeasonData);
          reset();
          // create new playerSeasons based on values from this year.

          // create season and playerSeasons
          createData(
            {
              table: 'playerSeasons',
              newData: newPlayerSeasonData,
              toast: false,
            },
            {
              onSuccess: (data) => {
                console.log(data);
              },
            }
          );

          //UPDATE THE RECENT AND CURRENT SEASON AND NAVIGATE TO IT
          updateCurrentSeason(data.id);
          updateRecentSeason(data.id);
          navigate('../seasonMain');
        },
      }
    );
  }

  function onError(errors) {
    console.log(errors);
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} type={'regular'}>
      Form
      <FormRow label="Mascot">
        <Input
          type="text"
          disabled={isWorking}
          register={{ ...register('teamMascot', { required: false }) }}
          ref={null}
          id="teamMascot"
        />
      </FormRow>
      <FormRow label="Season" error={errors?.season?.message}>
        <Input
          type="number"
          disabled={isWorking}
          register={{
            ...register('season', {
              required: 'This field is required as a four digit year',
              pattern: /^[0-9]{4}$/,
            }),
          }}
          ref={null}
          id="season"
        />
      </FormRow>
      <FormRow label="School Year">
        <Input
          type="text"
          disabled={isWorking}
          register={{
            ...register('schoolYear', { required: 'This field is required' }),
          }}
          ref={null}
          id="schoolYear"
        />
      </FormRow>
      <FormRow label="Class">
        <Input
          type="text"
          disabled={isWorking}
          register={{ ...register('classification', { required: false }) }}
          ref={null}
          id="classification"
        />
      </FormRow>
      <FormRow label="Region">
        <Input
          type="number"
          disabled={isWorking}
          register={{ ...register('region', { required: false }) }}
          ref={null}
          id="region"
        />
      </FormRow>
      <FormRow label="District">
        <Input
          type="number"
          disabled={isWorking}
          register={{ ...register('district', { required: false }) }}
          ref={null}
          id="district"
        />
      </FormRow>
      <FormRow label="Team Levels">
        <Input
          type="text"
          disabled={isWorking}
          register={{ ...register('teamLevels', { required: false }) }}
          ref={null}
          id="teamLevels"
        />
      </FormRow>
      <FormRow>
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isWorking}>Create New Season</Button>
      </FormRow>
    </Form>
  );
}

export default CreateSeasonForm;
