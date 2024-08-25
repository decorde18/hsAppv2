import styled from 'styled-components';
import Select from '../../../../ui/Select';
import Button from '../../../../ui/Button';
import ButtonIcon from '../../../../ui/ButtonIcon';
import { HiTrash } from 'react-icons/hi2';
import { CgEnter } from 'react-icons/cg';

const Container2 = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;
const Container = styled.div``;
const Div = styled.div`
  display: flex;
  margin: 0.5rem auto;
`;
const Div2 = styled.div`
  display: flex;
  justify-content: space-around;
`;
const Div3 = styled.div`
  width: 75%;
  display: flex;
  justify-content: space-around;
  margin-top: 2rem;
`;
function Substitutions({
  players,
  subsInWaiting,
  handleSubChange,
  handleBtnClick,
  enterAllSubs,
  isWorking,
}) {
  return (
    <Container2>
      <Container>
        {subsInWaiting.map((subs, index) => (
          <Div key={`${index}-sub`}>
            <Select
              width={25}
              options={[
                //then the value of the player that is selected if there is one
                !subs.subOut //the options first add blank label
                  ? { value: 'out', label: 'SUBBING OUT' }
                  : {
                      value: players.onField.find(
                        (player) => +subs.subOut === player.playerId
                      )?.playerId,
                      label: players.onField.find(
                        (player) => +subs.subOut === player.playerId
                      )?.fullname,
                    }, //then only the players who are not already being subbed out
                ...players.onField
                  .filter(
                    (player) =>
                      !subsInWaiting.some(
                        (sub) => sub.subOut === player.playerId
                      )
                  )
                  .map((player) => ({
                    value: player.playerId,
                    label: player.fullname,
                  })),
              ]}
              onChange={handleSubChange}
              name={`subOut-${index}`}
              value={
                subs.subOut
                  ? players.onField.find(
                      (player) => +subs.subOut === player.playerId
                    )?.playerId
                  : 'out'
              }
            />
            <Select
              width={25}
              options={[
                //then the value of the player that is selected if there is one
                !subs.subIn //the options first add blank label
                  ? { value: 'in', label: 'SUBBING IN' }
                  : {
                      value: players.offField.find(
                        (player) => +subs.subIn === player.playerId
                      )?.playerId,
                      label: players.offField.find(
                        (player) => +subs.subIn === player.playerId
                      )?.fullname,
                    }, //then only the players who are not already being subbed in
                ...players.offField
                  .filter(
                    (player) =>
                      !subsInWaiting.some(
                        (sub) => sub.subIn === player.playerId
                      )
                  )
                  .map((player) => ({
                    value: player.playerId,
                    label: player.fullname,
                  })),
              ]}
              onChange={handleSubChange}
              name={`subIn-${index}`}
              value={
                subs.subIn
                  ? players.offField.find(
                      (player) => +subs.subIn === player.playerId
                    )?.playerId
                  : 'in'
              }
            />
            {(subs.subIn || subs.subOut) && (
              <Div2>
                <ButtonIcon
                  name={`delete-${index}`}
                  disabled={isWorking}
                  onClick={handleBtnClick}
                >
                  <HiTrash style={{ color: 'red' }} />
                </ButtonIcon>
                <ButtonIcon
                  name={`enter-${index}`}
                  disabled={isWorking}
                  onClick={handleBtnClick}
                >
                  <CgEnter style={{ color: 'green' }} />
                </ButtonIcon>
              </Div2>
            )}
          </Div>
        ))}
      </Container>
      <Div3>
        {subsInWaiting.length > 1 && (
          <Button onClick={enterAllSubs} disabled={isWorking}>
            Enter all Subs
          </Button>
        )}
      </Div3>
    </Container2>
  );
}

export default Substitutions;

// onField: Array(11) [
//   {
//     gameStatus: 'gkStarter',
//     id: 847,
//     firstName: 'Presley',
//     lastName: 'Covey',
//     fullname: 'Presley Covey',
//     fullnamelast: 'Covey, Presley',
//     game: 7,
//     start: false,
//     dressed: true,
//     injured: false,
//     unavailable: false,
//     gkStarter: false,
//     season: 22,
//     status: 'Rostered',
//     playergameid: 14021,
//     gf: 0,
//     assist: 0,
//     peopleId: 551,
//     ins: 0,
//     subStatus: 1

//     field: 'authorization',
//     values: [
//       { value: '', label: 'PLEASE AUTHORIZE' },
//       { value: true, label: 'I AUTHORIZE' },
//     ],
//   },
// ];
// <Select
//   width={each.size}
//   options={selectFields
//     .find((field) => field.field === each.field)
//     .values.map((val) => ({ ...val }))
//     .filter((field) =>
//       each.field === 'grade' ? field.filter === selectedCamp : field
//     )}
//   onChange={handleSelectChange}
//   name={each.field}
//   disabled={isWorking}
//   defaultValue={
//     selectFieldValues.find((field) => field.field === each.field).value
//   }
//   register={{
//     ...register(each.field, {
//       validate: (value) => value !== '' || `${each.message}`,
//     }),
//   }}
// />;
