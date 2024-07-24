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
    displaySheet: ['onField', 'offField'],
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
    displaySheet: ['onField', 'offField'],
  },
  {
    table: 'playerSeasons',
    label: 'G',
    field: 'gf',
    type: 'number',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.08fr',
    columnType: 'number',
    textAlign: 'center',
    displaySheet: ['onField', 'offField'],
  },
  {
    table: 'playerSeasons',
    label: 'A',
    field: 'assist',
    type: 'number',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.08fr',
    columnType: 'number',
    textAlign: 'center',
    displaySheet: ['onField', 'offField'],
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
    displaySheet: ['onField', 'offField'],
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
    displaySheet: ['onField', 'offField'],
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
    displaySheet: ['onField', 'offField'],
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
    displaySheet: ['onField'],
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
    displaySheet: ['offField'],
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
    displaySheet: ['DNP', 'played'],
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
    displaySheet: ['DNP', 'played'],
  },
  {
    table: 'playerSeasons',
    label: 'Start',
    field: 'gameStatus',
    type: 'string',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.5fr',
    columnType: 'string',
    textAlign: 'center',
    displaySheet: ['played'],
  },
  {
    table: 'playerSeasons',
    label: 'Goals',
    field: 'gf',
    type: 'number',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.5fr',
    columnType: 'number',
    textAlign: 'center',
    displaySheet: ['played'],
  },
  {
    table: 'playerSeasons',
    label: 'Assists',
    field: 'assist',
    type: 'number',
    sort: true,
    sortPriority: 2,
    defaultSortDirection: true,
    isSearchable: true,
    width: '.5fr',
    columnType: 'number',
    textAlign: 'center',
    displaySheet: ['played'],
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
    displaySheet: ['played'],
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
    displaySheet: ['played'],
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
    displaySheet: ['played'],
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
    displaySheet: ['played'],
  },
];