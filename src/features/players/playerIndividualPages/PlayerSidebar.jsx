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
      ></PlayerPic>
      <div></div>
    </>
  );
}

export default PlayerSidebar;

// altRoster: null;
// bio: null;
// captain: false;
// created_at: '2022-12-20T18:22:00+00:00';
// dateOfBirth: '2005-06-22';
// earnedCredits: 0;
// enrolledLastYear: true;
// entryYear: 2019;
// firstName: 'Lilly';
// fullname: 'Lilly Armentor';
// fullnamelast: 'Armentor, Lilly';
// gkRoster: null;
// grade: 12;
// id: 741;
// lastName: 'Armentor';
// livesWithParents: true;
// modified_at: '2023-07-18T13:15:09.581806+00:00';
// picture: null;
// playerId: 248;
// position: null;
// returningPlayer: true;
// rosterNumber: 19;
// seasonId: 20;
// starter: false;
// status: 'Rostered';
// teamLevel: ['Varsity'];
// updated_at: '2024-02-23T19:53:18.088987+00:00';
