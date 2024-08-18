## //TODO FIXME !!!

- ihssoccergirls.net does not take you to public or app
- uniforms - take the number away from the size when it is being used. when primary uniform is selected, update secondary as well.
- all things uniforms, add uniform fixed, add jerseys fixed, ability to add gk fixed, roster with GK jersey not just player listed as GK fixed, GK needs gk in roster positions even though they have a gk jersey, roster needs to be based on jersey types
- ability to update schools - update coach for school

- fix games and events with Google log in - allow Development to acces game form

- People Table - convert to overall table add view edit
- SeasonSideBar.jsx:9 The component styled.img with the id of "sc-jdEkgJ" has been created dynamically.You may see this warning because you've called styled inside another component.To resolve this only create new StyledComponents outside of any render method and function component. at SeasonSideBar (http://localhost:5173/src/features/seasons/SeasonSideBar.jsx:19:26)

- useContext for current season - always access it that way versus theuseUniverasl I have started to implement
- createPlayerModal for new players

- redo communication table ---
- on gameEntry and eventEntry - create a function for need Google Sign in. That allows me to work on the forms without being logged
- validate that no new player is already in system, likewise with parent

- scheduleTable - see the todos
- apiGames - updateGames - not only cancelGame but updateGameStatus and takes which status - update calendar
- redo useSeason, if single season, if no season (use current , if no current, use Recent) - if no season (new program or new school using progam)- or All for all seasons (may still need to separate bevause we may need to have access to all seasons as well as the current season in Mutations) - add the auto season select on public pages, homepage, seasonSelector

- ON stats, be sure to include only games that status is not completed or in progress- can't do in sql view because then the playergame will be added even though it is already included

## //TODO FIXME !!

-sidebar hihlighted when clicked

## //TODO FIXME !

- NEED TO UPDATE SEASON SELECTOR WHEN NEW SEASON IS ADDED. IT TAKES TO NEW SEASON< BUT NOT SEASON SELECTOR>
- fix defaults of new season -id: 23 (not all transfered) - see details below
- auto selecting classification??? can't seem to make it not work again
- usePlayerSeasons -see todos --- redo all see useEditPlayer for proper way
- on modals (createPlayerModalForm is the first) close only if no API error
- Redo Create Player Form

## TODO NEXT !!!

- Season Overview All-Time
- Pagination
- schedule Helper - email functionality --include check all of each subHeading - add JV/V/both ? - on change to scheduled, go to create game - when scheduled, button to go to game
  - continue game stats manual entry - add new entries
  - create end of game stats page
  - create in game stats interactive page

## TODO NEXT !!

- create add another on create events, players, games
- update schools with new classifications and districts
- add new locations to create game, new school
- Stats- add to playerIniv Pages
- PlayerRow, create universal file based on columns

## TODO NEXT !

- switch all Select to new React-Select?
- in CreateGameForm/CreateEventForm, I use StyledSelect instead of my Select Component because I need to pass the arguments into the options but because I have default values, I created it differently. Can I recreate the StyledSelects with new options?
- calendar funtionality - set start and end date - advance months, etc
- delete parent, delete person too? - same with player, etc
- go through gk subs and inlude true value on DB

## - TODO POSSIBLY

- create games, set JV time based on V time or vice versus
  -Google contacts ?
  -Create Events - on table, add seasonphase?

## TODO FUTURE

- is using a state the best way to do addAnother on a form submit using the current Modal component. Loog at SummerCampRegistrations and see if this is truly the best way.
- remove gkRoster and altRoster from playerSeasons table in SB
- combine usePeople functions into 1, same with players
- create helper functions for all Date events (send to google calendar, with time, without time, etc)
- create file upload page for team pics, player pics, etc - see https://www.youtube.com/watch?v=HvOvdD2nX1k
- useMutation in create playerForm does not run on create parents because of iterations. If you can understand the useMutation hook later on as a developer, fix it

# 7/24/2024

- A lot of updates, game stats page in progress, new views being updaed on roster, universal api adding to more components

- DONE remove bootstrap - ButtonGroup in CreateGame

# 5/22/2024

- DONE remove bootstrap - ButtonGroup in CreateGame

## 3/5/2024

- DONE playerTable clean it up (filter, sort)
- DONE when click on Players, url changes to season =recent, but season selector does not
- DONE seasonselector -
- DONE add coach on schedule helper not working (says firstname and last name required)
- DONE Player INFORMATION pop up modal

## 3/16/2024

- DONE add gender, nickname to playersviwe2
- DONE add to createPlayerModalForm
- DONE modified at or updated at from playersview2 needs to be changed (not sure which table)
- DONE Universal fetch api
- DONE finish parentModal
- DONE editPlayerModal for new players
- DONE delete picture altRoster gkRoster rosterNumber
- DONE redo games tables

## 4/11/2024

- DONE People Table
- DONE fix seasoncontext / season selector to update currentSeason New
- DONE policies for new table gf, ga...
- DONE playerRow playerSeasonRow
- DONE refactor public/private pages with layout - lets make sure all is the way it should be
- DONE playerseason row - get JV, V from season settings
- DONE filter searchParams when season # dos not exist (ie seasonId=24)
- DONE all-time Players clean it up (filter, sort)
- DONE all-time Games Create
- DONE Filters ---see filter from PlayerTable and convert to global

##
