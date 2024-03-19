import { supabaseUrl } from '../../../services/supabase';

import styled from 'styled-components';

const PlayerPic = styled.img`
  display: block;
  width: 22rem;
  height: 25rem;
  object-fit: cover;
  object-position: center;
  border-radius: 2rem;
  outline: 2px solid var(--color-grey-100);
  object-fit: center;
`;

function PlayerSidebar({ player, season }) {
  const playerName = player.fullname.replace(/ /g, '');
  const playerPicture = `${supabaseUrl}/storage/v1/object/public/playerpics/${season.season}Season/${playerName}.jpg`;
  const noImage = `${supabaseUrl}/storage/v1/object/public/playerpics/unavailableVertical.jpg`;

  return (
    <>
      <PlayerPic
        src={playerPicture}
        alt={`${playerName}`}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = noImage;
        }}
      />
      <div></div>
    </>
  );
}

export default PlayerSidebar;
