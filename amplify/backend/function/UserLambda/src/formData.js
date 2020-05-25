const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const find_row_index = require('./utils').find_row_index
const googleToUnix = require('./utils').googleToUnix
const unixToGoogle = require('./utils').unixToGoogle
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
// fs.readFile('credentials.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   // Authorize a client with credentials, then call the Google Sheets API.
//   authorize(JSON.parse(content), fechtData);
// });

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  //const {client_secret, client_id, redirect_uris} = credentials.web.client_id;
  const client_secret = credentials.web.client_secret;
  const client_id =  credentials.web.client_id;
  const redirect_uri = "https://google.com"; // to receive code in url

  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uri);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}


class collector {
  async constructor(credentials, token){
    this.spreadsheetId = '1OZZIZpuRxGbTKfBVGWh1iYK4cCB-6J42a4-4v8D_Mnw'
    this.sheetId = '1063414610'
    const creds = fs.readFileSync('credentials.json');
    // const credentials = JSON.parse(creds);
    const client_secret = credentials.web.client_secret;
    const client_id =  credentials.web.client_id;
    const redirect_uri = "https://google.com"; // to receive code in url

    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uri);
    // Check if we have previously stored a token.
    //var auth_token = fs.readFileSync(TOKEN_PATH);
    var auth_token = token;
    if (!auth_token){
        auth_token = getNewToken(oAuth2Client, callback);
    }
    oAuth2Client.setCredentials(JSON.parse(auth_token));
    const auth = oAuth2Client;
    this.auth = auth;
    this.sheets = google.sheets({version: 'v4', auth});
  }

  async get_records(){
    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: 'Form Responses 1!A2:G',
    })
    .then((res)=> {
      const rows = res.data.values;
      if (rows.length) {
        console.log('serving formData');
        console.log(rows)
        return res
      } else {
        console.log('No data found.');
        throw(Error('No data found.')) 
      }
    })
    .catch((err)=>{
      console.log('The API returned an error: ', err);
    });
    return res.data.values;
  }
  // comment

  async delete_records(timestamp){
    const rows = await this.get_records();
    const index = find_row_index(rows, timestamp);
    if(index === -1){
      console.log("No such row found")
      return;
    }
    const del_request = {
      "requests": [{
        deleteDimension: {
          "range": {
            "sheetId": this.sheetId,
            "dimension": "ROWS",
            "startIndex": index,
            "endIndex": index+1
          }
        }
      }]
    };
    console.log("spreadsheetId and gID check", this.spreadsheetId, this.sheetId);
    await this.sheets.spreadsheets.batchUpdate({
      spreadsheetId: this.spreadsheetId,
      auth: this.auth,
      resource: del_request
    })
    .then(resp=>{
      console.log("batchupdate success!", resp)
    })
    .catch(err => {
      console.log("batch update error", err)
      return err;
    });
  }
};

module.exports = collector;
