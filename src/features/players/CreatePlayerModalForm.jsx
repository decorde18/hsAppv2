import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

import Form from '../../ui/Form';
import Heading from '../../ui/Heading';
import FormRow from '../../ui/FormRow';
import Row from '../../ui/Row';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

import CreateParentModalForm from './CreateParentModalForm';

import { useData, useUpdateData } from '../../services/useUniversal';

const fields = [
  {
    label: 'First Name *',
    field: 'firstName',
    table: 'people',
    type: 'text',
    required: true,
    message: 'We need the first name',
  },
  {
    label: 'Last Name *',
    field: 'lastName',
    table: 'people',
    type: 'text',
    required: true,
    message: 'We need the last name',
  },
  {
    label: 'Gender *',
    field: 'gender',
    table: 'people',
    type: 'text',
    required: true,
    placeholder: 'F',
    message: 'We need a gender',
  },
  {
    label: 'Nickname',
    field: 'nickName',
    table: 'people',
    type: 'text',
    required: false,
  },
  {
    label: 'Date of Birth',
    field: 'dateOfBirth',
    table: 'people',
    type: 'date',
    required: false,
  },
  { field: 'empty' },
  {
    label: 'Email',
    field: 'email',
    table: 'people',
    type: 'email',
    required: false,
  },
  {
    label: 'Cell',
    field: 'cellNumber',
    table: 'people',
    type: 'number',
    required: false,
  },
  {
    label: 'Entry Year *',
    field: 'entryYear',
    table: 'players',
    type: 'number',
    required: true,
    message: 'We need the year entered 9th',
  },
  {
    label: 'Grade *',
    field: 'grade',
    table: 'playerSeasons',
    type: 'number',
    required: true,
    message: 'We need the grade',
  },
  { field: 'empty2' },
];

const tableIds = [
  { table: 'playerSeasons', id: 'id' },
  { table: 'people', id: 'peopleId' },
  { table: 'players', id: 'playerId' },
];

const Grid = styled.div`
  display: grid;

  grid-template-columns: 1fr 1fr;
`;
const StyledBtn = styled.div`
  display: inline-block;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  padding: 0.5rem 1rem;
  line-height: 3rem;
  font-size: 1.4rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  text-align: center;

  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  color: var(--color-brand-50);
  background-color: var(--color-brand-500);
  border: 1px solid var(--color-brand-500);
`;

function CreatePlayerForm({ playerToEdit = {}, onCloseModal }) {
  const isEditSession = Boolean(playerToEdit.id);

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isEditSession ? playerToEdit : {},
  });
  const { errors } = formState;

  const { isUpdating, updateData } = useUpdateData();
  const [showParents, setShowParents] = useState(false);

  const parents = useData({
    table: 'parents',
    sort: [{ field: 'fullnamelast', direction: true }],
  });
  const playerParents = useData({
    table: 'playerParents',
    filter: [{ field: 'player', value: playerToEdit.playerId }],
    sort: [{ field: 'fullnamelast', direction: true }],
  });
  const isWorking = isUpdating;

  function onSubmit(data) {
    if (isEditSession) {
      tableIds.map((table) =>
        updateData({
          table: table.table,
          newData: Object.assign(
            {},
            ...fields
              .filter((field) => field.table === table.table)
              .map((field) => ({ [field.field]: data[field.field] }))
          ),
          id: data[table.id],
        })
      );
    }
    close();
  }
  function close() {
    reset();
    onCloseModal?.();
  }
  function onError(errors) {
    console.log(errors);
  }
  if (parents.isLoading || playerParents.isLoading) return;

  return (
    <>
      <Form
        onSubmit={handleSubmit(onSubmit, onError)}
        type={onCloseModal ? 'Modal' : 'regular'}
      >
        {!showParents && (
          <>
            <Row>
              <Heading as="h2">Player Information</Heading>
            </Row>
            <Grid>
              {fields.map((each) => {
                if (each.label) {
                  return (
                    <FormRow
                      label={each.label}
                      key={`player-${each.field}`}
                      error={errors?.[each.field]?.message}
                    >
                      <Input
                        id={`player-${each.field}`}
                        name={each.field}
                        error={errors?.[each.field]?.message}
                        type={each.type}
                        disabled={isWorking}
                        register={{
                          ...register(each.field, {
                            required: each.required ? each.message : false,
                          }),
                        }}
                        ref={null}
                      />
                    </FormRow>
                  );
                } else return <div key={`player-${each.field}`}></div>;
              })}
            </Grid>

            <FormRow>
              <StyledBtn onClick={() => setShowParents(!showParents)}>
                Show Parents
              </StyledBtn>
              <Button
                variation="secondary"
                type="reset"
                onClick={() => onCloseModal?.()}
              >
                Cancel
              </Button>
              <Button disabled={isWorking}>
                {isEditSession ? 'Save Changes' : 'Create New Player'}
              </Button>
            </FormRow>
          </>
        )}
      </Form>
      <CreateParentModalForm
        setShowParents={setShowParents}
        showParents={showParents}
        playerId={playerToEdit.playerId}
        parents={parents}
        playerParents={playerParents}
      />
    </>
  );
}

export default CreatePlayerForm;
