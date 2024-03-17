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
export function defaultVisiblePlayers({ players, parents, season }) {
  //TODO FIX ME, this if is for communication table and really needs to be moved there. it really should only take in players and season (or data and season)
  if (parents)
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
  return players.map((player) => {
    return {
      ...player,
      isPlayerVisible: player.status === defaultRosterStatus(season).label,
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
export function filterBySeasonPhase(season) {
  const defaultFilter = defaultRosterStatus(season);
  return {
    id: 'status',
    value: defaultFilter.value,
    label: defaultFilter.label,
  };
}

export function filterChange({ selected, name, currentFilters, columns }) {
  const selectedField = columns.find((column) => column.field === name);
  const prevFilter = currentFilters.filter((option) => option.field !== name);
  const newFilter = selected.length
    ? [
        ...prevFilter,
        {
          field: name,
          value: selected.map((option) => option.value),
          textSearch: selectedField.textSearch,
          table: selectedField.table,
        },
      ]
    : [...prevFilter];
  return newFilter;
}
export function sortUpdate({ selectedSort, sort }) {
  const table = Object.keys(selectedSort)[0];
  const prevSort = sort[table].filter(
    (prev) => prev.field !== selectedSort[table][0].field
  );
  const [newSort] = selectedSort[table].map((next) => ({
    [table]: [next, ...prevSort],
  }));
  return { ...sort, ...newSort };
}
