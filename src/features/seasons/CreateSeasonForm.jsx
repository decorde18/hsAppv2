import { useCurrentSeason } from '../../contexts/CurrentSeasonContext';

import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useCreateSeason, useRecentSeason } from './useSeasons';
import { usePlayers } from '../players/usePlayers';
import {
  usePlayerSeasons,
  useCreatePlayerSeason,
} from '../players/usePlayerSeasons';

import { useEffect, useState } from 'react';
import Spinner from '../../ui/Spinner';
import Button from '../../ui/Button';

function CreateSeasonForm() {
  const { isLoadingRecent, recentSeason } = useRecentSeason();
  const navigate = useNavigate();

  const { register, handleSubmit, reset, setValue, formState } = useForm();
  const { errors } = formState;
  const { createSeason, isCreating } = useCreateSeason();
  const isWorking = isCreating;
  const { updateCurrentSeason, updateRecentSeason } = useCurrentSeason();
  const { isLoadingPlayers, players } = usePlayers();
  const { isLoadingPlayerSeasons, playerSeasons } = usePlayerSeasons('recent');
  const { createPlayerSeason, isCreatingPlayerSeason } =
    useCreatePlayerSeason();

  const [newSeason, setNewSeason] = useState({});
  const [allPlayers, setAllPlayers] = useState([]);

  useEffect(
    function () {
      if (isLoadingRecent) return;
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
    [isLoadingRecent, recentSeason]
  );
  useEffect(
    function () {
      if (isLoadingPlayers) return;
      setAllPlayers(players);
    },
    [isLoadingPlayers, players]
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
    const filteredPlayers = allPlayers.filter(
      (player) => +player.entryYear >= +data.season - 3
    );
    createSeason(
      { ...data },
      {
        onSuccess: (dat) => {
          reset();
          // create new playerSeasons based on values from this year.
          const filteredPlayerSeasons = playerSeasons.filter(
            (playerS) =>
              players.map((player) => playerS.playerId === player.id) &&
              playerS.grade < 12
          );
          const newPlayerSeasonData = filteredPlayerSeasons.map((playerS) => {
            return {
              playerId: playerS.playerId,
              seasonId: dat.id,
              enrolledLastYear: true,
              grade: playerS.grade + 1,
              livesWithParents: playerS.livesWithParents || true,
              returningPlayer: playerS.status === 'Rostered',
              status:
                playerS.status === 'Rostered' ? 'Interested' : 'Not Playing',
            };
          });
          // create season and playerSeasons
          newPlayerSeasonData.map((playerS) => createPlayerSeason(playerS));
          //UPDATE THE RECENT AND CURRENT SEASON AND NAVIGATE TO IT
          updateCurrentSeason(dat.id);
          updateRecentSeason(dat.id);
          navigate('../seasonMain');
        },
      }
    );
  }

  function onError(errors) {
    console.log(errors);
  }
  if (isLoadingRecent) return <Spinner />;
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
