import { formatDistance, parseISO } from 'date-fns';
import { differenceInDays } from 'date-fns/esm';

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1, dateStr2) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace('about ', '')
    .replace('in', 'In');

// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have changed, which isn't good. So we use this trick to remove any time
export const getToday = function (options = {}) {
  const today = new Date();

  // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
  if (options?.end)
    // Set to the last second of the day
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(
    value
  );

export const formatTime = (time, noSeconds) => {
  const timeArr = time.split('+');

  time = timeArr[0].split(':'); // convert to array

  // fetch
  var hours = Number(time[0]);
  var minutes = Number(time[1]);
  var seconds = Number(time[2]);

  // calculate
  var timeValue;

  if (hours > 0 && hours <= 12) {
    timeValue = '' + hours;
  } else if (hours > 12) {
    timeValue = '' + (hours - 12);
  } else if (hours == 0) {
    timeValue = '12';
  }

  timeValue += minutes < 10 ? ':0' + minutes : ':' + minutes; // get minutes
  noSeconds
    ? timeValue
    : (timeValue += seconds < 10 ? ':0' + seconds : ':' + seconds); // get seconds
  timeValue += hours >= 12 ? ' PM' : ' AM'; // get AM/PM
  return timeValue;
};
export function formatDate(dt) {
  // David Added function because format converts dates to time zone so they are off by half a day
  const year = dt.getUTCFullYear();
  const month = dt.getUTCMonth() + 1; // Date provides month index; not month number
  const day = dt.getUTCDate();

  // Print always "2017-12-12", regardless the time zone it executed in
  console.log(year + '/' + padToTwo(month) + '/', padToTwo(day));
  // Or use a template literal
  return `${padToTwo(month)}/${padToTwo(day)}/${year}`;

  function padToTwo(number) {
    return number > 9 ? number : '0' + number;
  }
}
