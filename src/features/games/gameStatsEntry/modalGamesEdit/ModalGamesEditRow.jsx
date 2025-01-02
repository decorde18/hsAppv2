import Checkbox from '../../../../ui/Checkbox';
import Input from '../../../../ui/Input';
import Select from '../../../../ui/Select';

function GameStatsEditRow({ field, onChange, onBlur }) {
  switch (field.inputType) {
    case 'checkbox':
      return (
        <Checkbox
          checked={field.value}
          onChange={onChange}
          size={field.size}
          name={field.name}
        />
      );

    case 'select':
      return (
        <Select
          options={field.options}
          onChange={onChange}
          value={field.value}
          disabled={false}
          width={field.size}
          name={field.name}
          placeholder={field.placeholder}
        />
      );
    default:
      return (
        <Input
          key={field.key}
          value={field.value}
          size={field.size}
          name={field.name}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={field.placeholder}
        />
      );
  }
}

export default GameStatsEditRow;
