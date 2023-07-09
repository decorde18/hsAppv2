import { styled } from 'styled-components';
import Button from './Button';

const Aside = styled.aside`
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 1.5rem;
  margin-left: 0.75rem;
  color: var(--color-light--1);
`;
const Div = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;
function SideBar() {
  return (
    <Aside>
      <Div>
        <Button type="sideNav">Print Roster</Button>
        <Button type="sideNav">Print Schedule</Button>
        <Button type="sideNav">Something</Button>
        <Button type="sideNav">Season Settings</Button>
      </Div>
    </Aside>
  );
}

export default SideBar;
