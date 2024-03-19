import { supabaseUrl } from '../../services/supabase';

import styled from 'styled-components';

function SeasonSideBar({ season }) {
  const picture = `${supabaseUrl}/storage/v1/object/public/teampics/independence${season.season}.jpg`;
  const noImage = `${supabaseUrl}/storage/v1/object/public/teampics/unavailableSquare.jpg`;

  const Picture = styled.img`
    display: block;
    max-width: 54rem;
    max-height: 40rem;
    object-fit: cover;
    object-position: center;
    border-radius: 2rem;
    outline: 2px solid var(--color-grey-100);
    object-fit: center;
  `;

  return (
    <>
      <Picture
        src={picture}
        alt={`${season.season} Team`}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = noImage;
        }}
      />
    </>
  );
}

export default SeasonSideBar;
