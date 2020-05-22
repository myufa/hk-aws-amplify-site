
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
 * 2011-10-05T14:48:00.000Z
 * 5/15/2020 12:44:55
 */
function ISOtoGoogle(timestamp) {
    const datestr = new Date(timestamp)
    console.log('timestamp: ', timestamp, " datestr: ", datestr)
    const timestr = datestr.toLocaleString()
    console.log('after toLocaleString ', timestr)
    const split_timestr = timestr.split('-')
    const year = split_timestr[0]
    const month = split_timestr[1]
    const split_two = split_timestr[2].split('T')
    const day = split_two[0]
    const time_long = split_two[1]
    const time = time_long.split('.')[0]

    const new_time = month + '/' + day + '/' + year + ' ' + time
    console.log('converted time: ', new_time, 'original timestamp: ', timestamp)
    return new_time
}

/**
 * Searches an Array of google sheet row Arrays by timestamp and returns the row index:
 * @param {String} timestamp the ISO 8601 time number, miliseconds from origin.
 */
function find_row_index(rows, timestamp) {
    const googleTime = ISOtoGoogle(timestamp);
    console.log("Google time: ", googleTime)
    // search for row index of timestamp
    console.log("rows 2 ", rows)
    console.log("~~form row date compare~~")
    for (i = 0; i < rows.length; ++i){
        console.log(i, ") ", "search timestamp: ", googleTime, "  row timestamp: ", rows[i][0])
        if (rows[i][0] == googleTime) {
            return i;
        }
    }  
    console.log("~~~~")
    return -1;  
  }


exports.changeTime = changeTime;
exports.find_row_index = find_row_index;