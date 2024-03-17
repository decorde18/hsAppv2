import styled from 'styled-components';

import { useForm } from 'react-hook-form';
import { useState } from 'react';

import { HiTrash } from 'react-icons/hi2';

import Form from '../../ui/Form';
import Heading from '../../ui/Heading';
import FormRow from '../../ui/FormRow';
import Row from '../../ui/Row';
import Input from '../../ui/Input';
import Select from '../../ui/Select';

import {
  useCreateData,
  useDeleteData,
  useUpdateData,
} from '../../services/useUniversal';

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
];

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 1rem 0;
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
const TrashBtn = styled.div`
  display: inline-block;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  padding: 0.5rem 1rem;
  line-height: 3rem;
  font-size: 1.4rem;
  width: 10rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  color: var(--color-grey-500);
  background-color: var(--color-red-100);
  border: 1px solid var(--color-red-100);
`;

function CreateParentModalForm({
  parents,
  playerId,
  playerParents,
  setShowParents,
  showParents,
}) {
  const { register, handleSubmit, reset, formState } = useForm({});
  const { errors } = formState;

  const { isUpdating, updateData } = useUpdateData();
  const { isCreating, createData } = useCreateData();
  const { isDeleting, deleteData } = useDeleteData();
  const [createParents, setCreateParents] = useState(false);
  const [newParentData, setNewParentData] = useState({ id: 'new' });
  const isWorking = isUpdating || isCreating || isDeleting;

  function removeParent(e) {
    deleteData({
      view: 'player_parents_view',
      table: 'playerParents',
      id: e.target.id,
    });
  }
  function handleReset() {
    setNewParentData({
      id: 'new',
      firstName: '',
      lastName: '',
      cellNumber: null,
      email: '',
    });
    reset();
  }
  function handleCloseNew() {
    handleReset();
    setCreateParents(false);
  }
  function handleSelectChange(e) {
    if (e.target.value === 'new') handleReset();
    else
      setNewParentData(
        parents.data.find((parent) => parent.id === +e.target.value)
      );
  }
  function onSubmit(data) {
    if (createParents) {
      setCreateParents(false);
      // create new parent and add to the playerParent
      const parentData = fields.reduce(
        (acc, field) => ({ ...acc, [field.field]: data[field.field] }),
        {}
      );
      if (newParentData.id === 'new')
        createData(
          {
            table: 'people',
            newData: { ...parentData },
          },
          {
            onSuccess: (data) =>
              createData(
                {
                  table: 'parents',
                  newData: { peopleId: data.data[0].id },
                  view: 'parents',
                },
                {
                  onSuccess: (data) =>
                    createData({
                      table: 'playerParents',
                      newData: { parent: data.data[0].id, player: playerId },
                      view: 'playerParents',
                    }),
                }
              ),
          }
        );
      else
        createData({
          table: 'playerParents',
          newData: { parent: newParentData.id, player: playerId },
          view: ['player_parents_view', 'parents_view'],
        });
    } else {
      //edit a parent
      const newData = playerParents.data.reduce(
        (acc, parent) => [
          ...acc,
          {
            table: 'people',
            id: parent.peopleId,
            newData: fields.reduce(
              (acc2, field) => ({
                ...acc2,
                [field.field]: data[`${field.field}-${parent.id}`],
              }),
              {}
            ),
          },
        ],
        []
      );
      setShowParents(false);
      newData.map((data) => updateData(data));
    }
  }
  function onError(errors) {
    console.log(errors);
  }

  return (
    <Form>
      <Row>
        <Heading as="h2">Parent Information</Heading>
      </Row>
      {playerParents.data.map((parent) => {
        return (
          <div key={`parent_name${parent.id}`}>
            <Row>
              <Heading as="h3">
                <Row type="horizontal" justify="center">
                  {parent.fullname}
                  <TrashBtn id={parent.playerparentid} onClick={removeParent}>
                    <HiTrash />
                    remove
                  </TrashBtn>
                </Row>
              </Heading>
            </Row>
            <div key={`empty${parent.id}`}></div>
            <Grid>
              {showParents &&
                !createParents &&
                fields.map((each) => {
                  if (each.label) {
                    return (
                      <FormRow
                        label={each.label}
                        key={`parent-${each.field}-${parent.id}`}
                        error={errors?.[each.field]?.message}
                      >
                        <Input
                          id={`parent-${each.field}-${parent.id}`}
                          name={`${each.field}-${parent.id}`}
                          defaultValue={parent[each.field]}
                          error={errors?.[each.field]?.message}
                          type={each.type}
                          disabled={isWorking}
                          register={{
                            ...register(`${each.field}-${parent.id}`, {
                              required: each.required ? each.message : false,
                            }),
                          }}
                          ref={null}
                        />
                      </FormRow>
                    );
                  } else
                    return (
                      <div key={`parent-${each.field}-${parent.id}`}></div>
                    );
                })}
            </Grid>
          </div>
        );
      })}
      {showParents && createParents && (
        <>
          <Select
            width={60}
            options={[
              {
                value: 'new',
                label: 'Select if parent already in the sytem',
              },
              ...parents.data.map((parent) => ({
                value: parent.id,
                label: parent.fullname,
              })),
            ]}
            onChange={handleSelectChange}
            name="addParent"
            disabled={isWorking}
            value={newParentData.id}
          />
          <Grid>
            {newParentData.id === 'new' &&
              fields.map((each) => {
                if (each.label) {
                  return (
                    <FormRow
                      label={each.label}
                      key={`parent-${each.field}`}
                      error={errors?.[each.field]?.message}
                    >
                      <Input
                        id={`parent-${each.field}`}
                        name={each.field}
                        error={errors?.[each.field]?.message}
                        type={each.type}
                        disabled={isWorking}
                        defaultValue={newParentData[each.field]}
                        register={{
                          ...register(each.field, {
                            required: each.required ? each.message : false,
                          }),
                        }}
                        ref={null}
                      />
                    </FormRow>
                  );
                } else return <div key={`parent-${each.field}`}></div>;
              })}
          </Grid>
        </>
      )}
      {/* </Grid> */}
      {showParents && (
        <Row type="horizontal">
          {!createParents && (
            <StyledBtn
              disabled={isWorking}
              onClick={() => setCreateParents(true)}
            >
              {'Add new parent'}
            </StyledBtn>
          )}
          <StyledBtn disabled={isWorking} onClick={handleReset}>
            reset
          </StyledBtn>
          {createParents && (
            <StyledBtn disabled={isWorking} onClick={handleCloseNew}>
              cancel add
            </StyledBtn>
          )}
          <StyledBtn
            disabled={isWorking}
            onClick={handleSubmit(onSubmit, onError)}
          >
            {!createParents ? 'Accept Edit(s)' : 'Create New Parent'}
          </StyledBtn>
        </Row>
      )}
    </Form>
  );
}

export default CreateParentModalForm;
