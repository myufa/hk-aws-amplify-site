
/**
 * Changes the google form timestamp into an ISO format dateTime:
 * @param {String} google_time the google form timestamp as 'month/day/year hour:min:sec'.
 */
function changeTime(google_time) {
    const split_times = google_time.split("/");
    const month = split_times[0];
    const day = split_times[1];
    const year_time = split_times[2].split(' ')
    const year = year_time[0]
    const time = year_time[1]
  
    const answer = year + '-' + month + '-' + day + " " + time;
    return answer;
  }


exports.changeTime = changeTime;