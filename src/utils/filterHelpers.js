export const statusFilterLabel = [
  { value: 0, label: 'No Filter' },
  { value: 1, label: 'Rostered' },
  { value: 2, label: 'Trying Out', seasonPhase: 'tryout' },
  { value: 3, label: 'Interested', seasonPhase: 'pre-Tryout' },
  { value: 4, label: 'Not Playing' },
];
/* THIS IS HOW YOU CAN GET THE QUERY PARAMS
  const params = new URLSearchParams(window.location.search);
  const filter = params.get('filterRosterStatus');THESE GET YOU SPECIFIC
  const filter = window.location.search.split('&');CREATES AN ARRAY
  */
export const defaultRosterStatus = (season) => {
  const filterStatus =
    statusFilterLabel.find(
      (status) => status.seasonPhase === season.seasonPhase
    ) || statusFilterLabel.find((status) => status.value === 1);
  return filterStatus;
};

export function filterRosterStatus(playerSeasons, rosterStatus, season) {
  const filterStatus =
    statusFilterLabel.find((status) => {
      //todo eliminate this part (used in playerTable see how I used the status in Communication table)
      if (rosterStatus) {
        return status.value === +rosterStatus;
      } else return status.seasonPhase === season.seasonPhase;
    }) || statusFilterLabel.find((status) => status.value === 1);

  const filteredPlayers =
    filterStatus.value === 0
      ? playerSeasons
      : playerSeasons.filter((player) => player.status === filterStatus.label);
  return { filterStatus, filteredPlayers };
}

export function defaultVisiblePlayers(players, parents, season) {
  return players.map((player) => {
    return {
      ...player,
      isPlayerVisible: player.status === defaultRosterStatus(season).label,
      isPlayerAdded: false,
      parents: parents
        .filter((parent) => parent.player === player.playerId)
        .map((parent) => {
          return {
            parentId: parent.parent,
            parentEmail: parent.parents.people.email,
            parentfirstName: parent.parents.people.firstName,
            parentLastName: parent.parents.people.lastName,
            isParentAdded: false,
          };
        }),
    };
  });
}
export function visibleRosterStatus(players, status) {
  if (status.value === 0)
    //if no filter
    return players.map((player) => {
      return { ...player, isPlayerVisible: true };
    });
  return players.map((player) => {
    //if filter
    if (player.status === status.label) {
      return { ...player, isPlayerVisible: true };
    } else return { ...player, isPlayerVisible: false };
  });
}
