## //TODO FIXME !!!

- DONE PublicPlayerTable - center for media screen
- DONE PublicPlayer Table - doesn't update when season is changed, mst refresh
- DONE not showing all players- do we need JVNavy/JVGold?- not all seasons showing up
- DONE PublicPlayerTable - add option for altNumber
- DONE on roster for previous seasons, can't becaue uniform gives null

- take searchparams out of routes and put in context?
- searchParams not needed for season except for layouts
- add coach on schedule helper not working (says firstname and last name required)
- on gameEntry and eventEntry - create a function for need Google Sing in. That allows me to work on the forms without being logged

- seasonselector -

- validate that no new player is already in system, likewise with parent

- scheeduleTable - see the todos
- apiPlayers - sort order not working
- usePlayerSeasons -see todos
- apiGames - updateGames - not only cancelGame but updateGameStatus and takes which status - update calendar
- redo useSeason, if single season, if no season (use current , if no current, use Recent) - if no season (new program or new school using progam)- or All for all seasons (may still need to separate bevause we may need to have access to all seasons as well as the current season in Mutations) - add the auto season select on public pages, homepage, seasonSelector

## //TODO FIXME !!

- refactor public/private pages with layout - lets make sure all is the way it should be
- playerseason row - get JV, V from season settings
  -sidebar hihlighted when clicked

## //TODO FIXME !

- NEED TO UPDATE SEASON SELECTOR WHEN NEW SEASON IS ADDED. IT TAKES TO NEW SEASON< BUT NOT SEASON SELECTOR>
- fix defaults of new season -id: 23 (not all transfered) - see details below
- auto selecting classification??? can't seem to make it not work again
- filter searchParams when season # dos not exist (ie seasonId=24)

## TODO NEXT !!!

- Pagination
  -Filters
- schedule Helper - email functionality --include check all of each subHeading - add JV/V/both ? - on change to scheduled, go to create game - when scheduled, button to go to game
  - continue game stats manual entry - add new entries
  - create end of game stats page
  - create in game stats interactive page

## TODO NEXT !!

- create add another on create events, players, games
- update schools with new classifications and districts
- all-time vs current season tabs
- add new locations to create game, new school

## TODO NEXT !

- calendar funtionality - set start and end date - advance months, etc
- delete parent, delete person too? - same with player, etc
- go through gk subs and inlude true value on DB

## - TODO POSSIBLY

- create games, set JV time based on V time or vice versus
  -Google contacts ?
  -Create Events - on table, add seasonphase?

## TODO FUTURE

- remove gkRoster and altRoster from playerSeasons table in SB
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
