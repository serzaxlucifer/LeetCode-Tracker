const { google } = require('googleapis');
const {topics} = require("../data/data");
const User = require('../models/User'); // Adjust the path as necessary

async function authenticate(userId) 
{
    console.log("Inside authenticate");
    const token = await User.findById(userId);
    console.log(token);
  
    if (!token) {
        throw new Error('No tokens found for this user');
    }
  
    const oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );
  
    oAuth2Client.setCredentials({
        access_token: token.accessToken,
        refresh_token: token.refreshToken,
        expiry_date: token.expiryDate
    });
  
    if (oAuth2Client.isTokenExpiring()) 
    {
        const refreshedTokens = await oAuth2Client.refreshAccessToken();
        const { credentials } = refreshedTokens;
        oAuth2Client.setCredentials(credentials);
    
        // Save updated tokens to the database

        await User.updateOne({ userId }, {
            accessToken: credentials.access_token,
            refreshToken: credentials.refresh_token,
            expiryDate: credentials.expiry_date
        });
    }
  
    return oAuth2Client;
}
  

async function createSpreadsheet(title, uid) 
{
    console.log("Inside createSpreadsheet, with uid ", uid);
    const auth = await authenticate(uid);
    const sheets = google.sheets({ version: 'v4', auth });
  
    const resource = {
      properties: {
        title,
      },
    };
  
    const response = await sheets.spreadsheets.create({
      resource,
      fields: 'spreadsheetId',
    });

    const spreadsheetId = response.data.spreadsheetId;
    const updatedTopics = ["Home", ...topics];
    
    // Add sheets for each topic
    const batchUpdateRequest = {
        requests: updatedTopics.map(topic => ({
            addSheet: {
                properties: {
                    title: topic,
                },
            },
        })),
    };
    
    await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: batchUpdateRequest,
    });
    
    const newresponse = await sheets.spreadsheets.get({
        spreadsheetId: spreadsheetId,
      });
  
    const shee = newresponse.data.sheets;
    console.log(shee);
    console.log(topics);
  
    // Update each sheet with initial values and formatting
    const requests = topics.map(topic => {
        console.log(topic);
        const she = shee.find(s => s.properties.title === topic).properties.sheetId;
        console.log(she);

        return [
            // Set initial value in A1
            {
                updateCells: {
                  range: {
                    sheetId: she,  // Provide the sheetId
                    startRowIndex: 0,
                    startColumnIndex: 0,
                    endRowIndex: 1,
                    endColumnIndex: 1,
                  },
                  rows: [{
                    values: [{
                      userEnteredValue: { stringValue: '4' },
                    }],
                  }],
                  fields: 'userEnteredValue',
                },
              },
              // Set headers in row 2
              {
                updateCells: {
                  range: {
                    sheetId: she,  // Provide the sheetId
                    startRowIndex: 2,
                    startColumnIndex: 0,
                    endRowIndex: 3,
                    endColumnIndex: 4,
                  },
                  rows: [{
                    values: [
                      { userEnteredValue: { stringValue: 'Review?' } },
                      { userEnteredValue: { stringValue: 'Problem' } },
                      { userEnteredValue: { stringValue: 'Learning' } },
                      { userEnteredValue: { stringValue: 'Code' } },
                    ],
                  }],
                  fields: 'userEnteredValue',
                },
              },
            // Format headers
            {
            repeatCell: {
                range: {
                sheetId: she,
                startRowIndex: 2,
                endRowIndex: 3,
                startColumnIndex: 0,
                endColumnIndex: 4,
                },
                cell: {
                userEnteredFormat: {
                    backgroundColor: { red: 0, green: 0, blue: 0 }, // Black
                    textFormat: {
                    foregroundColor: { red: 1, green: 1, blue: 1 }, // White
                    fontSize: 12,
                    bold: true,
                    },
                },
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat)',
            },},
            {
              mergeCells: {
                  range: {
                      sheetId: she,
                      startRowIndex: 1,
                      endRowIndex: 2,
                      startColumnIndex: 0,
                      endColumnIndex: 4,
                  },
                  mergeType: 'MERGE_ALL',
              },
          },
          {
              repeatCell: {
                  range: {
                      sheetId: she,
                      startRowIndex: 1,
                      endRowIndex: 2,
                      startColumnIndex: 0,
                      endColumnIndex: 4,
                  },
                  cell: {
                      userEnteredValue: {
                          stringValue: topic,
                      },
                      userEnteredFormat: {
                          horizontalAlignment: 'CENTER',
                          textFormat: {
                              fontSize: 22,
                              bold: true,
                          },
                      },
                  },
                  fields: 'userEnteredValue,userEnteredFormat(horizontalAlignment,textFormat)',
              },
          },
          // Set row height for row 3
          {
              updateDimensionProperties: {
                  range: {
                      sheetId: she,
                      dimension: 'ROWS',
                      startIndex: 1,
                      endIndex: 2,
                  },
                  properties: {
                      pixelSize: 70, // Adjust this value to fit the text size
                  },
                  fields: 'pixelSize',
              },
          },
          {
            updateDimensionProperties: {
                range: {
                    sheetId: she,
                    dimension: 'COLUMNS',
                    startIndex: 0,
                    endIndex: 1,
                },
                properties: {
                    pixelSize: 120, // Column A width
                },
                fields: 'pixelSize',
            },
        },
        {
            updateDimensionProperties: {
                range: {
                    sheetId: she,
                    dimension: 'COLUMNS',
                    startIndex: 1,
                    endIndex: 2,
                },
                properties: {
                    pixelSize: 390, // Column B width
                },
                fields: 'pixelSize',
            },
        },
        {
            updateDimensionProperties: {
                range: {
                    sheetId: she,
                    dimension: 'COLUMNS',
                    startIndex: 2,
                    endIndex: 3,
                },
                properties: {
                    pixelSize: 550, // Column C width
                },
                fields: 'pixelSize',
            },
        },
        {
            updateDimensionProperties: {
                range: {
                    sheetId: she,
                    dimension: 'COLUMNS',
                    startIndex: 3,
                    endIndex: 4,
                },
                properties: {
                    pixelSize: 360, // Column D width
                },
                fields: 'pixelSize',
            },
        },
        ];
    }).flat();

    console.log("Invoking Final Change Handler");
  
    await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
            requests,
        },
    });
  
    return spreadsheetId;
  }
  

async function addToSpreadsheet(spreadsheetId, sheetName, data, uid, rID=-1)   // Help in doing stuff with Google Sheets.
{
    const auth = await authenticate(uid);
    const sheets = google.sheets({ version: 'v4', auth });
  

    let writePointer = 0;
    
    if(rID === -1)
    {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A1`,
          });
        writePointer = parseInt(response.data.values[0][0], 10) || 4;   // Write in Row 4.
    }
    else
    {
        writePointer = rID;
    }

    const colorMap = {
        YES: {backgroundColor: {red: 1, green: 0, blue: 0}, textFormat: {foregroundColor: {red: 1, green: 1, blue: 1}, bold: true}},  // RED
        NO: {backgroundColor: {green: 1, red: 0, blue: 0}, textFormat: {foregroundColor: {red: 1, green: 1, blue: 1}, bold: true}},  // GREEN
        SPECIAL: {backgroundColor: {yellow: 1, red: 0, blue: 0}, textFormat: {foregroundColor: {red: 1, green: 1, blue: 1}, bold: true}}  // YELLOW
      };
    
    
  
    // Update data
    const rowData = [data.markForRevisit == 0 ? "NO" : data.markForRevisit == 1 ? "YES" : "SPECIAL", data.problemName, data.learning, data.code];
    const range = `${sheetName}!A${writePointer}`;
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      resource: {
        values: [rowData],
      },
    });

    const newresponse = await sheets.spreadsheets.get({
        spreadsheetId: spreadsheetId,
    });
  
    const shee = newresponse.data.sheets;
    const link = data.problemLink;

    const markForRevisitValue = rowData[0];
    const format = colorMap[markForRevisitValue] || {};
    const sheetId = shee.find(s => s.properties.title === sheetName).properties.sheetId;

    await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: sheetId,  // You need to get sheetId from the spreadsheet metadata
                  startRowIndex: writePointer - 1,  // Adjust for zero-based index
                  endRowIndex: writePointer,
                  startColumnIndex: 0,
                  endColumnIndex: 1,
                },
                cell: {
                  userEnteredFormat: format,
                },
                fields: 'userEnteredFormat',
              },
            },
            {
                updateDimensionProperties: {
                    range: {
                        sheetId: sheetId,
                        dimension: 'ROWS',
                        startIndex: writePointer - 1,
                        endIndex: writePointer,
                    },
                    properties: {
                        pixelSize: 50, // Adjust this value to fit the text size
                    },
                    fields: 'pixelSize',
                },
            },
            {
                repeatCell: {
                  range: {
                    sheetId: sheetId,
                    startRowIndex: writePointer - 1, // Adjust for zero-based index
                    endRowIndex: writePointer,
                    startColumnIndex: 1,
                    endColumnIndex: 2,
                  },
                  cell: {
                    userEnteredValue: {
                      formulaValue: `=HYPERLINK("${link}", "${data.problemName}")`
                    },
                  },
                  fields: 'userEnteredValue',
                }
            }
          ],
        },
      });
      
    if(rID !== -1)
    {
        // Update the write pointer
        writePointer += 1;
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!A1`,
            valueInputOption: 'RAW',
            resource: {
                values: [[writePointer]],
            },
        });
    }

    return writePointer;
}


  
module.exports = { createSpreadsheet, addToSpreadsheet };