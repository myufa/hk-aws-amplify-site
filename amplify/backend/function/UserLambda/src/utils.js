
/**
 * Changes the google form timestamp into an ISO format dateTime:
 * @param {String} google_time the google form timestamp as 'month/day/year hour:min:sec'.
 */
function changeTime(google_time) {
    const split_times = google_time.split("/");
    const month = parseInt(split_times[0]);
    const day = parseInt(split_times[1]);
    const year_time = split_times[2].split(' ');
    const year = parseInt(year_time[0]);
    const time = year_time[1].split(':');

    const answer = new Date(year, month, day, parseInt(time[0]), parseInt(time[1]), parseInt(time[2]))
    return Date.parse(answer);
}


/**
 * Changes ISO format dateTime into the google form timestamp:
 * @param {Number} timestamp the ISO 8601 time number, miliseconds from origin.
 */
function ISOtoGoogle(timestamp) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour12: false };
    console.log("timestamp test 2", timestamp)
    return timestamp.toLocaleString('en-US', options);
}

/**
 * Searches an Array of google sheet row Arrays by timestamp and returns the row index:
 * @param {String} timestamp the ISO 8601 time number, miliseconds from origin.
 */
function find_row_index(rows, timestamp) {
  const googleTime = ISOtoGoogle(timestamp);
  // search for row index of timestamp
  console.log("~~form row date compare~~")
  for (i = 0; i < timestamp.length; ++i){
      console.log(i, ") ", "search timestamp: ", rows[i][0], "  row timestamp: ")
      if (rows[i][0] == googleTime) {
          return i;
      }
  }  
  console.log("~~~~")
  return -1;  
}


exports.changeTime = changeTime;
exports.find_row_index = find_row_index;