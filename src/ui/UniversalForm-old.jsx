import { useForm } from 'react-hook-form';
import Form from './Form';
import FormRow from './FormRow';
import Input from './Input';
import Select from './Select';
import { useState } from 'react';
import Button from './Button';
import ButtonGroup from './ButtonGroup';

const fields = [];
const selectFields = [
  {
    field: 'T_shirt_size',
    values: [
      { value: null, label: 'SELECT A SIZE' },
      { value: 'YS', label: 'Youth Small' },
      { value: 'YM', label: 'Youth Medium' },
      { value: 'YL', label: 'Youth Large' },
      { value: 'AS', label: 'Adult Small' },
      { value: 'AM', label: 'Adult Medium' },
      { value: 'AL', label: 'Adult Large' },
    ],
  },
];
function UniversalFormOld() {
  const { register, handleSubmit, reset, setValue, getValues, formState } =
    useForm();
  const { errors } = formState;

  const [selectedCamp, setSelectedCamp] = useState('Eagles Camp');
  const [selectFieldValues, setSelectFieldValues] = useState(
    selectFields.map((field) => ({ field: field.field, value: null }))
  );
  const isWorking = false;

  function onSubmit(data) {}
  function onError(errors) {
    console.log(errors);
  }
  function handleButtonGroupChange(e) {
    setSelectedCamp(e.target.name);
  }
  function handleSelectChange(e) {
    if (!e.target.value) return;

    setSelectFieldValues(
      selectFieldValues.map((val) =>
        val.field === e.target.name
          ? { field: val.field, value: e.target.value }
          : { ...val }
      )
    );
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} type={'regular'}>
      <ButtonGroup
        btnArray={['Eagles Camp', 'Little Eagles Camp']}
        defaultBtn={selectedCamp}
        onChange={handleButtonGroupChange}
      />
      {fields.map((each) => (
        <FormRow
          label={each.label}
          error={errors?.[each.field]?.message}
          key={each.field}
        >
          {each?.fieldType !== 'select' ? (
            <Input
              type={each.type}
              disabled={isWorking}
              id={each.field}
              register={{
                ...register(each.field, {
                  required: each.required ? each.message : false,
                }),
              }}
              size={each.size}
              ref={null}
            />
          ) : (
            <Select
              width={each.size}
              options={selectFields
                .find((field) => field.field === each.field)
                .values.map((val) => ({ ...val }))}
              onChange={handleSelectChange}
              name={each.field}
              disabled={isWorking}
              value={
                selectFieldValues.find((field) => field.field === each.field)
                  .value
              }
              register={{
                ...register(each.field, {
                  validate: (value) =>
                    +value !== 0 || `${value} ${each.message}`,
                }),
              }}
            />
          )}
        </FormRow>
      ))}
      <FormRow>
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isWorking}>Register</Button>
      </FormRow>
    </Form>
  );
}

export default UniversalFormOld;
