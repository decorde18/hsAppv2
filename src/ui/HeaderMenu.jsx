import { styled } from 'styled-components';
import Logout from '../features/authentication/Logout';
import ButtonIcon from './ButtonIcon';
import { HiOutlineUser } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../features/authentication/useUser';
import UserAvatar from '../features/authentication/UserAvatar';

const StyledHeaderMenu = styled.ul`
  display: flex;
  gap: 2.4rem;
  align-items: center;
  justify-content: flex-end;
`;
function HeaderMenu() {
  const { user } = useUser();
  const navigate = useNavigate();
  return (
    <StyledHeaderMenu>
      <li>
        <ButtonIcon onClick={() => navigate('../protected/account')}>
          {/* <HiOutlineUser /> */}
          {user && <UserAvatar />}
        </ButtonIcon>
      </li>
      <li>
        <Logout />
      </li>
    </StyledHeaderMenu>
  );
}

export default HeaderMenu;
