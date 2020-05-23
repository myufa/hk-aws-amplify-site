
/**
 * Changes the google form timestamp into an ISO format dateTime:
 * @param {String} google_time the google form timestamp as 'month/day/year hour:min:sec'.
 */
function googleToUnix(google_time) {
    const split_times = google_time.split("/");
    const month = parseInt(split_times[0]);
    const day = parseInt(split_times[1]);
    const year_time = split_times[2].split(' ');
    const year = parseInt(year_time[0]);
    const time = year_time[1].split(':');
    const answer = new Date(year, month - 1, day, parseInt(time[0]), parseInt(time[1]), parseInt(time[2]));
    return Date.parse(answer);
}


/**
 * Changes ISO format dateTime into the google form timestamp:
 * @param {Number} timestamp the ISO 8601 time number, miliseconds from origin.
 * 2011-10-05T14:48:00.000Z
 * 5/15/2020 12:44:55
 */
function unixToGoogle(timestamp) {
    const datestr = new Date(timestamp)
    var datetime = datestr.toLocaleString()
    const to24hr = datestr => {
        var time = datestr.substring(10)
        console.log("time check", datestr, time)
        var PM = time.match('PM') ? true : false
        time = time.split(':')
        var min = time[1]
        
        if (PM) {
            var hour = 12 + parseInt(time[0],10)
            var sec = time[2].replace('PM', '')
        } else {
            var hour = time[0]
            var sec = time[2].replace('AM', '')       
        }
        
        return datestr.substring(0, 9) + " " + hour + ':' + min + ':' + sec
    };
    datetime = to24hr(datetime);
    return datetime;
}

/**
 * Searches an Array of google sheet row Arrays by timestamp and returns the row index:
 * @param {String} timestamp the ISO 8601 time number, miliseconds from origin.
 */
function find_row_index(rows, timestamp) {
    const googleTime = unixToGoogle(timestamp).trim();
    // search for row index of timestamp
    for (i = 0; i < rows.length; ++i){
        if (rows[i][0].trim() === googleTime) {
            return i + 1;
        }
    }  
    return -1;  
  }


exports.googleToUnix = googleToUnix;
exports.unixToGoogle = unixToGoogle;
exports.find_row_index = find_row_index;
