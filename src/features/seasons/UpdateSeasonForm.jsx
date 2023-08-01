import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import { useUpdateSeason } from './useSeasons';
function UpdateSeasonForm({ season }) {
  const { isUpdating, updateSeason } = useUpdateSeason();

  function handleBlur(e, field) {
    const { value } = e.target;

    if (!value) return;
    updateSeason({ id: season.id, [field]: value });
  }

  return (
    <Form>
      <FormRow label="Season">
        <Input
          type="number"
          defaultValue={season.season}
          onBlur={(e) => handleBlur(e, 'season')}
          disabled={isUpdating}
          id="season"
        />
      </FormRow>
      <FormRow label="School Year">
        <Input
          type="text"
          defaultValue={season.schoolYear}
          onBlur={(e) => handleBlur(e, 'schoolYear')}
          disabled={isUpdating}
          id="schoolYear"
        />
      </FormRow>
      <FormRow label="Class">
        <Input
          type="text"
          defaultValue={season.classification}
          onBlur={(e) => handleBlur(e, 'classification')}
          disabled={isUpdating}
          id="classification"
        />
      </FormRow>
      <FormRow label="Region">
        <Input
          type="number"
          defaultValue={season.region}
          onBlur={(e) => handleBlur(e, 'region')}
          disabled={isUpdating}
          id="region"
        />
      </FormRow>
      <FormRow label="District">
        <Input
          type="number"
          defaultValue={season.district}
          onBlur={(e) => handleBlur(e, 'district')}
          disabled={isUpdating}
          id="district"
        />
      </FormRow>

      <FormRow label="Team Levels">
        <Input
          type="text"
          defaultValue={season.teamLevels}
          onBlur={(e) => handleBlur(e, 'teamLevels')}
          disabled={isUpdating}
          id="teamLevels"
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSeasonForm;

//   // const { isLoading, settings } = useSettings();
//   const {
//     settings: {
//       minBookingLength,
//       maxBookingLength,
//       maxGuestsPerBooking,
//       breakfastPrice,
//     } = {},
//     isLoading,
//   } = useSettings();
//   const { updateSetting, isUpdating } = useUpdateSettings();

//   // return <Spinner />;
//   if (isLoading) return <Spinner />;

//   function handleBlur(e, field) {
//     const { value } = e.target;

//     if (!value) return;
//     updateSetting({ [field]: value });
//   }

//   // This time we are using UNCONTROLLED fields, so we will NOT store state
//   return (
//     <Form>
//       <FormRow label='Minimum nights/booking'>
//         <Input
//           type='number'
//           defaultValue={minBookingLength}
//           onBlur={(e) => handleBlur(e, "minBookingLength")}
//           disabled={isUpdating}
//           id='min-nights'
//         />
//       </FormRow>
//       <FormRow label='Maximum nights/booking'>
//         <Input
//           type='number'
//           defaultValue={maxBookingLength}
//           onBlur={(e) => handleBlur(e, "maxBookingLength")}
//           disabled={isUpdating}
//           id='max-nights'
//         />
//       </FormRow>
//       <FormRow label='Maximum guests/booking'>
//         <Input
//           type='number'
//           defaultValue={maxGuestsPerBooking}
//           onBlur={(e) => handleBlur(e, "maxGuestsPerBooking")}
//           disabled={isUpdating}
//           id='max-guests'
//         />
//       </FormRow>
//       <FormRow label='Breakfast price'>
//         <Input
//           type='number'
//           defaultValue={breakfastPrice}
//           onBlur={(e) => handleBlur(e, "breakfastPrice")}
//           disabled={isUpdating}
//           id='breakfast-price'
//         />
//       </FormRow>
//     </Form>
//   );
// }
