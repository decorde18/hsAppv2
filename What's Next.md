## //TODO FIXME !!!

- validate that no new player is already in system, likewise with parent

- scheeduleTable - see the todos
- apiPlayers - sort order not working
- usePlayerSeasons -see todos
- apiGames - updateGames - not only cancelGame but updateGameStatus and takes which status - update calendar

## //TODO FIXME !!

- playerseason row - get JV, V from season settings
  -sidebar hihlighted when clicked

## //TODO FIXME !

- NEED TO UPDATE SEASON SELECTOR WHEN NEW SEASON IS ADDED. IT TAKES TO NEW SEASON< BUT NOT SEASON SELECTOR>
- fix defaults of new season -id: 23 (not all transfered) - see details below
- auto selecting classification??? can't seem to make it not work again

## TODO NEXT !!!

- schedule Helper - email functionality --include check all of each subHeading - add JV/V/both ? - on change to scheduled, go to create game - when scheduled, button to go to game
- Pagination
  -Filters

## TODO NEXT !!

- create add another on create events, players, games
- update schools with new classifications and districts
- all-time vs current season tabs

## TODO NEXT !

- calendar funtionality - set start and end date - advance months, etc
- delete parent, delete person too? - same with player, etc

## - TODO POSSIBLY

- create games, set JV time based on V time or vice versus
  -Google contacts ?
  -Create Events - on table, add seasonphase?

## TODO FUTURE

- combine usePeople functions into 1, same with players
- create helper functions for all Date events (send to google calendar, with time, without time, etc)
- in CreateGameForm/CreateEventForm, I use StyledSelect instead of my Select Component because I need to pass the arguments into the options but because I have default values, I created it differently. Can I recreate the StyledSelects with new options?
- create file upload page for team pics, player pics, etc - see https://www.youtube.com/watch?v=HvOvdD2nX1k
- useMutation in create playerForm does not run on create parents because of iterations. If you can understand the useMutation hook later on as a developer, fix it
  details ---
  season: 2024
  schoolYear: "2024-2025"
  classification: "I AAA"
  region: "5"
  district: "10"
  home_location: null \*\*\*
  coach: null
  assistant_coaches: null
  trainer: null
  principal: null
  manager: null
  teamName: null
  gender: null
  teamMascot: "Lady Eagles"
  assistantPrincipals: null
  athleticDirector: null
  created_at: "2023-11-25T16:09:04.356112+00:00"
  updated_at: "2023-11-26T23:28:44.159798+00:00"
  ▶ teamLevels 2 items
  seasonPhase: "pre-Tryout"
  people: null
