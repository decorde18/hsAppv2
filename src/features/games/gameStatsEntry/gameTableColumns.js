//todo change this so each column is shown once and there is an arra that says which part of the game to enter it, it may take away from the sortdirection in each part of the game but that can be achieved through other arrays as well. i shouldn't have to change each column in each part of the game for a change that would be universal (ie variable name change)
export const duringGameColumns = [
  {
    table: 'playerSeasons',
    label: '#',
    field: 'number',
    type: 'number',
    defaultSortDirection: true,
    width: '.075fr',
    columnType: 'string',
    textAlign: 'right',
    displayTable: ['onField', 'offField'],
  },
  {
    table: 'playerSeasons',
    label: 'Player',
    field: 'fullname',
    type: 'string',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.9fr',
    columnType: 'string',
    textAlign: 'left',
    displayTable: ['onField', 'offField'],
  },
  {
    table: 'playerSeasons',
    label: 'G',
    field: 'goals',
    type: 'number',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.08fr',
    columnType: 'number',
    textAlign: 'center',
    displayTable: ['onField', 'offField'],
  },
  {
    table: 'playerSeasons',
    label: 'A',
    field: 'assists',
    type: 'number',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.08fr',
    columnType: 'number',
    textAlign: 'center',
    displayTable: ['onField', 'offField'],
  },
  {
    table: 'playerSeasons',
    label: 'Sh',
    field: 'shots',
    type: 'number',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.08fr',
    columnType: 'number',
    textAlign: 'center',
    displayTable: ['onField', 'offField'],
  },

  {
    table: 'playerSeasons',
    label: '+/-',
    field: 'plusMinus',
    type: 'number',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.25fr',
    columnType: 'number',
    textAlign: 'center',
    displayTable: ['onField', 'offField'],
  },
  {
    table: 'playerSeasons',
    label: 'Min Played',
    field: 'minPlayed',
    type: 'time',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.2fr',
    columnType: 'number',
    textAlign: 'right',
    displayTable: ['onField', 'offField'],
  },
  {
    table: 'playerSeasons',
    label: 'Time In',
    field: 'lastIn',
    type: 'time',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.2fr',
    columnType: 'number',
    textAlign: 'right',
    displayTable: ['onField'],
  },
  {
    table: 'playerSeasons',
    label: 'Time Out',
    field: 'lastOut',
    type: 'time',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.2fr',
    columnType: 'number',
    textAlign: 'right',
    displayTable: ['offField'],
  },
];
export const periodBreakColumns = [
  {
    table: 'playerSeasons',
    label: '#',
    field: 'number',
    type: 'number',
    defaultSortDirection: true,
    width: '.25fr',
    columnType: 'string',
    textAlign: 'right',
    displayTable: ['all'],
  },
  {
    table: 'playerSeasons',
    label: 'Player',
    field: 'fullname',
    type: 'string',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '1.5fr',
    columnType: 'string',
    textAlign: 'left',
    displayTable: ['all'],
  },
  {
    table: 'playerSeasons',
    label: 'On Field',
    field: 'subStatus',
    type: 'ex',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.5fr',
    columnType: 'string',
    textAlign: 'center',
    displayTable: ['all'],
  },
  {
    table: 'playerSeasons',
    label: 'Goals',
    field: 'goals',
    type: 'number',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.5fr',
    columnType: 'number',
    textAlign: 'center',
    displayTable: ['all'],
  },
  {
    table: 'playerSeasons',
    label: 'Assists',
    field: 'assists',
    type: 'number',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.5fr',
    columnType: 'number',
    textAlign: 'center',
    displayTable: ['all'],
  },
  {
    table: 'playerSeasons',
    label: 'Shots',
    field: 'shots',
    type: 'number',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.5fr',
    columnType: 'number',
    textAlign: 'center',
    displayTable: ['all'],
  },
  {
    table: 'playerSeasons',
    label: 'Saves',
    field: 'saves',
    type: 'number',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.5fr',
    columnType: 'number',
    textAlign: 'center',
    displayTable: ['all'],
  },
  {
    table: 'playerSeasons',
    label: 'Minutes',
    field: 'minPlayed',
    type: 'time',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.5fr',
    columnType: 'number',
    textAlign: 'right',
    displayTable: ['all'],
  },
  {
    table: 'playerSeasons',
    label: '+/-',
    field: 'plusMinus',
    type: 'number',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.5fr',
    columnType: 'number',
    textAlign: 'center',
    displayTable: ['all'],
  },
];
export const afterGameColumns = [
  {
    table: 'playerSeasons',
    label: '#',
    field: 'number',
    type: 'number',
    defaultSortDirection: true,
    width: '.25fr',
    columnType: 'string',
    textAlign: 'right',
    displayTable: ['DNP', 'played'],
  },
  {
    table: 'playerSeasons',
    label: 'Player',
    field: 'fullname',
    type: 'string',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '1.5fr',
    columnType: 'string',
    textAlign: 'left',
    displayTable: ['DNP', 'played'],
  },
  {
    table: 'playerSeasons',
    label: 'Start',
    field: 'playergamestatus',
    type: 'string',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.5fr',
    columnType: 'string',
    textAlign: 'center',
    displayTable: ['played'],
  },
  {
    table: 'playerSeasons',
    label: 'Goals',
    field: 'goals',
    type: 'number',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.5fr',
    columnType: 'number',
    textAlign: 'center',
    displayTable: ['played'],
  },
  {
    table: 'playerSeasons',
    label: 'Assists',
    field: 'assists',
    type: 'number',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.5fr',
    columnType: 'number',
    textAlign: 'center',
    displayTable: ['played'],
  },
  {
    table: 'playerSeasons',
    label: 'Shots',
    field: 'shots',
    type: 'number',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.5fr',
    columnType: 'number',
    textAlign: 'center',
    displayTable: ['played'],
  },
  {
    table: 'playerSeasons',
    label: 'Goals Ag',
    field: 'goals_against',
    type: 'number',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.5fr',
    columnType: 'number',
    textAlign: 'center',
    displayTable: ['played'],
  },
  {
    table: 'playerSeasons',
    label: 'Saves',
    field: 'saves',
    type: 'number',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.5fr',
    columnType: 'number',
    textAlign: 'center',
    displayTable: ['played'],
  },
  {
    table: 'playerSeasons',
    label: 'Minutes',
    field: 'minPlayed',
    type: 'time',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.5fr',
    columnType: 'number',
    textAlign: 'right',
    displayTable: ['played'],
  },
  {
    table: 'playerSeasons',
    label: '+/-',
    field: 'plusMinus',
    type: 'number',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.5fr',
    columnType: 'number',
    textAlign: 'center',
    displayTable: ['played'],
  },
];
