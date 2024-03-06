import { formatDistance, parseISO } from 'date-fns';
import { differenceInDays } from 'date-fns/esm';
import moment from 'moment';

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace('about ', '')
    .replace('in', 'In');

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(
    value
  );
export function subtractTimes(startTime, endTime) {
  return timeToSeconds(endTime) - timeToSeconds(startTime);
  function timeToSeconds(time) {
    time = time.split(':');
    if (time.length === 3) time = +time[0] * 60 * 60 + +time[1] * 60 + +time[2];
    else time = +time[0] * 60 + +time[1];
    return time;
  }
}

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1, dateStr2) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));
export function addDays(date, numberOfDays) {
  const newDate = moment(date).add(numberOfDays, 'days');
  return newDate.format('YYYY-MM-DD');
}
export const getToday = function (options = {}) {
  const today = new Date();

  // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
  if (options?.end)
    // Set to the last second of the day
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};
export const formatTime = (time, noSeconds) => {
  time = time.split(' ').length > 1 ? convert12To24(time) : time;
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
  } else if (hours === 0) {
    timeValue = '12';
  }
  timeValue += minutes < 10 ? ':0' + minutes : ':' + minutes; // get minutes
  timeValue = noSeconds
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

  // Or use a template literal
  return `${padToTwo(month)}/${padToTwo(day)}/${year}`;

  function padToTwo(number) {
    return number > 9 ? number : '0' + number;
  }
}
function convert12To24(time12) {
  // Split the time into hours and minutes
  let [hours, minutes, seconds] = time12.split(':');
  // Check if the time is in PM
  if (time12.endsWith('PM')) {
    // If it is, add 12 to the hours
    hours = parseInt(hours) + 12;
  }
  // If the hours are now greater than 23, set them to 0
  if (hours > 23) {
    hours = 0;
  }
  // Return the time in 24-hour format
  return `${hours}:${minutes}:${seconds.slice(0, 2) || '00'}`;
}
export function convertSBtimeToLocalTime(time, noSeconds) {
  time = time.split('+');
  time = formatTime(time[0], noSeconds);
  return time;
}
export function convertToGoogleDateTime(date, time, timeAdded = 0) {
  // tell moment how to parse the input
  const dateTime = moment(date + time, 'YYYY-MM-DDLT').add(timeAdded, 'h');
  // conversion
  return dateTime.format('YYYY-MM-DDTHH:mm:s');
}
export function convertSecondsToMinutesSeconds(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  time = `${minutes}:${seconds}`;
  return time;
}
export function convertMinutesSecondsToSeconds(time) {
  const [minutes, seconds] = time.split(':');
  time = +minutes * 60 + +seconds;
  return time;
}
// TIME AND DATE HELPER
// new Date().toLocaleTimeString(); // 11:18:48 AM
// //---
// new Date().toLocaleDateString(); // 11/16/2015
// //---
// new Date().toLocaleString(); // 11/16/2015, 11:18:48 PM

// 4 hours later
// new Date(new Date().getTime() + 4*60*60*1000).toLocaleTimeString(); // 3:18:48 PM or 15:18:48

//2 days later
// new Date(new Date().getTime() - 2*24*60*60*1000).toLocaleDateString() // 11/14/2015

export function convertToPhoneNumber(number) {
  const numberValue = number?.replace(/\D[^.]/g, '');
  const phoneNumber =
    numberValue?.length === 10
      ? numberValue.slice(0, 0) +
        '(' +
        numberValue.slice(0, 3) +
        ') ' +
        numberValue.slice(3, 6) +
        '-' +
        numberValue.slice(6)
      : numberValue;
  return phoneNumber;
}

export function flattenObject(obj, prefix = '') {
  let flattened = {};
  for (let key in obj) {
    const value = obj[key];
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, prefix + key + '.'));
    } else {
      flattened[prefix + key] = value;
    }
  }
  return flattened;
}
