import styled from 'styled-components';

import { useState } from 'react';

import { useGameContext } from '../../../contexts/GameContext';

import Heading from '../../../ui/Heading';
import Row from '../../../ui/Row';
import Button from '../../../ui/Button';
import Collapsible from '../../../ui/Collapsible';
import Checkbox from '../../../ui/Checkbox';
import Input from '../../../ui/Input';

import { useUpdateData } from '../../../services/useUniversal';

import { HiChevronDown } from 'react-icons/hi2';

const Container = styled.div`
  max-width: 128rem;
  margin: 1rem auto;
  padding: 0 2rem;
`;
const MainButton = styled.div`
  width: 30rem;
  height: 2rem;
`;
const MainSection = styled.div`
  margin-top: 1rem;
  border: 1px solid var(--color-grey-200);
  border-radius: 1rem;
  padding: 1rem;
  font-size: 1.65rem;
  display: grid;
  grid-template-columns: 5fr 2fr 2fr;
  grid-gap: 4rem;
`;
const FirstRow = styled.div`
  grid-column: 1/ -1;
`;
const FirstColumn = styled.div`
  display: grid;
  grid-template-columns: 9fr 1fr;
  grid-column-gap: 2rem;
`;
const SecondColumn = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-column-gap: 2rem;
`;
const ThirdColumn = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-column-gap: 2rem;
`;
const Gap = styled.div`
  width: 1rem;
  height: 6.5rem;
`;
const StyledDiv = styled.div`
  font-size: 2.4rem;
`;
const StyledDivSmaller = styled.div`
  font-size: 1.5rem;
`;
// GAME HEADER - use on (Game Break?, game stoppage? are these modals?),
// before game , after game

function GameSettings({ expand }) {
  const { gameDetails } = useGameContext();
  const { game } = gameDetails;
  const { isUpdating, updateData } = useUpdateData();

  const [openSettings, setOpenSettings] = useState(expand);
  const [gameSettings, setGameSettings] = useState(game);

  const [ot2, setOt2] = useState(game.max_ot_periods > game.min_ot_periods);

  function handleClick() {
    setOpenSettings(!openSettings);
  }
  function handleChange(e) {
    const { checked, name } = e.target;
    const updatedSettings = { [name]: checked };
    handleUpdate(updatedSettings);
  }
  function handleBlur(e) {
    const { value, name } = e.target;
    let updatedValue = name.includes('minute') ? value * 60 : value;
    if (!value) return;
    if (name === 'max_ot_periods') {
      //verify the max is not more than the min, if so set to min
      if (value < game.min_ot_periods) {
        updatedValue = game.min_ot_periods;
        e.target.value = game.min_ot_periods;
      }
      if (value > game.min_ot_periods)
        //if max is > min, show OT2, else hide it
        setOt2(true);
      else setOt2(false);
    }
    if (name === 'min_ot_periods')
      if (value > game.max_ot_periods) {
        //verify the min is not more than the max, if so set to max
        e.target.value = game.max_ot_periods;
        updatedValue = game.max_ot_periods;
      }
    const updatedSettings = { [name]: updatedValue };
    handleUpdate(updatedSettings);
  }
  function handleUpdate(newValue) {
    updateData({
      table: 'games',
      newData: { ...newValue },
      id: game.id,
    });

    setGameSettings({ ...gameSettings, ...newValue });
  }
  return (
    <Container>
      <Heading as="h5" case="upper" location="center">
        <Button name="openSettings" variation="tertiary" onClick={handleClick}>
          <Row type="horizontal" justify="space-between">
            <div />
            <MainButton>Game Settings</MainButton>
            <div>
              <HiChevronDown />
            </div>
          </Row>
        </Button>
      </Heading>

      <Collapsible open={openSettings}>
        <MainSection>
          <FirstRow>
            <Row type="horizontal" justify="center">
              <StyledDiv>Regulation Periods</StyledDiv>
              <Gap />
              <StyledDiv>
                <Input
                  type="number"
                  key="reg_periods"
                  defaultValue={game.reg_periods}
                  onBlur={handleBlur}
                  disabled={isUpdating}
                  name="reg_periods"
                  id="reg_periods"
                  size="10"
                />
              </StyledDiv>
            </Row>
            <Row type="horizontal" justify="center">
              <StyledDiv>Regulation Period Length</StyledDiv>
              <Gap />
              <StyledDiv>
                <Input
                  type="number"
                  key="reg_periods_minutes"
                  defaultValue={game.reg_periods_minutes / 60}
                  onBlur={handleBlur}
                  disabled={isUpdating}
                  name="reg_periods_minutes"
                  id="reg_periods_minutes"
                  size="10"
                />
              </StyledDiv>
              <StyledDiv>min</StyledDiv>
            </Row>
          </FirstRow>
          <FirstColumn>
            <div>
              If the game ends in a tie, will there be Overtime Periods?
            </div>
            <Checkbox
              size="large"
              name="ot_if_tied"
              checked={gameSettings.ot_if_tied}
              onChange={handleChange}
              disabled={isUpdating}
            />
            <div>
              If the game (or Overtime) ends in a tie, will there be a shootout?
            </div>
            <Checkbox
              size="large"
              name="so_if_tied"
              checked={gameSettings.so_if_tied}
              onChange={handleChange}
              disabled={isUpdating}
            />
          </FirstColumn>
          {gameSettings.ot_if_tied && (
            <>
              <SecondColumn>
                <StyledDivSmaller>Min OT Periods</StyledDivSmaller>
                <Input
                  type="number"
                  key="min_ot_periods"
                  defaultValue={game.min_ot_periods}
                  onBlur={handleBlur}
                  disabled={isUpdating}
                  name="min_ot_periods"
                  id="min_ot_periods"
                  size="6.5"
                />
                <StyledDivSmaller>Max OT Periods</StyledDivSmaller>
                <Input
                  type="number"
                  key="max_ot_periods"
                  defaultValue={game.max_ot_periods}
                  onBlur={handleBlur}
                  disabled={isUpdating}
                  name="max_ot_periods"
                  id="max_ot_periods"
                  size="6.5"
                />
              </SecondColumn>
              <ThirdColumn>
                <StyledDivSmaller>OT 1 Length</StyledDivSmaller>
                <Input
                  type="number"
                  key="ot_1_minutes"
                  defaultValue={game.ot_1_minutes / 60}
                  onBlur={handleBlur}
                  disabled={isUpdating}
                  name="ot_1_minutes"
                  id="ot_1_minutes"
                  size="6.5"
                />
                <StyledDivSmaller>min</StyledDivSmaller>
                {ot2 && (
                  <>
                    <StyledDivSmaller>OT 2 Length</StyledDivSmaller>
                    <Input
                      type="number"
                      key="ot_2_minutes"
                      defaultValue={game.ot_2_minutes / 60}
                      onBlur={handleBlur}
                      disabled={isUpdating}
                      name="ot_2_minutes"
                      id="ot_2_minutes"
                      size="6.5"
                    />
                    <StyledDivSmaller>min</StyledDivSmaller>
                  </>
                )}
              </ThirdColumn>
            </>
          )}
        </MainSection>
      </Collapsible>
    </Container>
  );
}

export default GameSettings;
