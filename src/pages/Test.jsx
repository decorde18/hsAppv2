import UniversalForm from '../ui/universalForm';
const data = {
  fields: [
    {
      label: 'Field 1',
      name: 'field1',
      type: 'input',
      required: true,
      message: 'field 1 needs an answer',
      size: 11,
    },
    {
      label: 'Field 2',
      name: 'field2',
      type: 'input',
      required: true,
      message: 'field 2 needs an answer',
      size: 11,
    },
  ],
  buttons: ['submit', 'reset', 'cancel'],
};
// const data = {
//   pages: [
//     {
//       name: 'page 1',
//       default: true,
//       sections: [
//         {
//           name: 'section 1',
//           fields: [
//             {
//               label: 'Field 1',
//               name: 'field1',
//               type: 'input',
//               required: true,
//               message: 'field 1 needs an answer',
//             },
//             {
//               label: 'Field 2',
//               name: 'field2',
//               type: 'input',
//               required: true,
//               message: 'field 2 needs an answer',
//             },
//           ],
//         },
//       ],
//       buttons: ['submit', 'reset', 'cancel'],
//     },
//   ],
// };
function Test() {
  return <UniversalForm record={{ id: 12 }} data={data} />;
}

export default Test;
