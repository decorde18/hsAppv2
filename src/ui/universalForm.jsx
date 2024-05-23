import { useForm } from 'react-hook-form';
import ButtonGroup from './ButtonGroup';
import Form from './Form';
import Input from './Input';
import FormRow from './FormRow';
import Grid from './Grid';
import Button from './Button';

// THIS FORM IS USED TO EDIT OR CREATE DATA
function UniversalForm({ record, data, recordToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = recordToEdit;
  const isEditSession = Boolean(editId);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState,
    setValue,
    watch,
  } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;
  // const pages = data.pages.map((page) => page);

  function onSubmit(data) {
    console.log(data);
  }
  function onError(errors) {
    console.log(errors);
  }
  console.log(data);
  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} type={'regular'}>
      <ButtonGroup
        btnArray={['Eagles Camp', 'Little Eagles Camp']}
        // defaultBtn={selectedCamp}
        // onChange={handleButtonGroupChange}
      />
      {data.fields.map((each) => (
        <FormRow
          label={each.label}
          error={errors?.[each.field]?.message}
          key={each.name}
        >
          {each?.fieldType !== 'select' ? (
            <Input
              type={each.type}
              // disabled={isWorking}
              id={each.name}
              register={{
                ...register(each.name, {
                  required: each.required ? each.message : false,
                }),
              }}
              size={each.size}
              ref={null}
            />
          ) : (
            <div></div>
            // <Select
            //   width={each.size}
            //   options={selectFields
            //     .find((field) => field.field === each.field)
            //     .values.map((val) => ({ ...val }))}
            //   onChange={handleSelectChange}
            //   name={each.field}
            //   disabled={isWorking}
            //   value={
            //     selectFieldValues.find((field) => field.field === each.field)
            //       .value
            //   }
            //   register={{
            //     ...register(each.field, {
            //       validate: (value) =>
            //         +value !== 0 || `${value} ${each.message}`,
            //     }),
            //   }}
            // />
          )}
        </FormRow>
      ))}
      <FormRow>
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button>Register</Button>
      </FormRow>
    </Form>
  );
}

export default UniversalForm;

// {
//   /* Page Selection (ButtonGroup)*/
//   pages.length > 1 && (
//     <ButtonGroup
//       btnArray={pages.map((page) => page.name)}
//       defaultBtn={pages.find((page) => page.default)?.name}
//       // onChange={handleButtonGroupChange}
//     />
//   );
// }
// {
//   /* Pages*/
//   pages.map((page) => (
//     <div key={page.name}>
//       {page.sections.map((section) => (
//         <Grid key={section.name} columns={2}>
//           {section.fields.map((field) => (
//             /* Fields*/
//             <FormRow key={field.name} label={field.label} error={''}>
//               {field.type === 'input' && input(field)}
//             </FormRow>
//           ))}
//         </Grid>
//       ))}
//       <ButtonGroup
//         key={`buttons-${page.name}`}
//         btnArray={page.buttons}
//         // defaultBtn={pages.find((page) => page.default)?.name}
//         // onChange={handleButtonGroupChange}
//       />
//     </div>
//   ));
// }
// {
//   /* Submit Area - Page Advance*/
// }
