import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

import Form from '../ui/Form';
import Heading from '../ui/Heading';
import FormRow from '../ui/FormRow';
import Row from '../ui/Row';
import Button from '../ui/Button';
import Input from '../ui/Input';

import CreateParentModalForm from '../features/players/CreateParentModalForm';

import { useData, useUpdateData } from '../../services/useUniversal';

const fields = [
  {
    label: 'Location *',
    field: 'name',
    table: 'locations',
    type: 'text',
    required: true,
    message: 'We need the name',
  },
  {
    label: 'Address',
    field: 'address',
    table: 'addresses',
    type: 'text',
    required: false,
    message: 'We need the address',
  },
  {
    label: 'City',
    field: 'city',
    table: 'addresses',
    type: 'text',
    required: false,
    message: 'We need a gender',
  },
  {
    label: 'State',
    field: 'state',
    table: 'addresses',
    type: 'text',
    placeholder: 'TN',
    required: false,
  },
  {
    label: 'Zip',
    field: 'zip',
    table: 'addresses',
    type: 'number',
    required: false,
  },
  { field: 'empty' },
  {
    label: 'Travel Time',
    field: 'travelTime',
    table: 'addresses',
    type: 'number',
    required: false,
  },
];

const tableIds = [
  { table: 'addresses', id: 'addressid' },
  { table: 'locations', id: 'locationid' },
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

  const locations = useData({
    table: 'location',
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
  if (locations.isLoading) return;
  console.log(locations.data);
  return (
    <>
      <Form
        onSubmit={handleSubmit(onSubmit, onError)}
        type={onCloseModal ? 'Modal' : 'regular'}
      >
        {!showParents && (
          <>
            <Row>
              <Heading as="h2">Location Information</Heading>
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
        locationId={locations.locationid}
        locations={locations}
      />
    </>
  );
}

export default CreatePlayerForm;
