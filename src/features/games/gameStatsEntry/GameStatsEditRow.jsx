import Input from '../../../ui/Input';
import Checkbox from '../../../ui/Checkbox';
import Select from '../../../ui/Select';

function GameStatsEditRow({ field, onChange }) {
  return (
    <td>
      {field.type === 'input' ? (
        <Input
          defaultValue={field.value}
          size={field.size}
          name={field.name}
          onBlur={onChange}
        />
      ) : field.type === 'checkbox' ? (
        <Checkbox
          checked={field.value}
          onChange={onChange}
          size={field.size}
          name={field.name}
        />
      ) : (
        field.type === 'select' && (
          <Select
            options={field.options}
            onChange={onChange}
            value={field.value}
            disabled={false}
            width={field.size}
            name={field.name}
          />
        )
      )}
    </td>
  );
}

export default GameStatsEditRow;
