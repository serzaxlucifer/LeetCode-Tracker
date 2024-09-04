const { google } = require('googleapis');
const {topics} = require("../data/data");
const User = require('../models/User'); // Adjust the path as necessary
const CryptoJS = require('crypto-js');
require('dotenv').config();


function encryptToken(token) {
    const ciphertext = CryptoJS.AES.encrypt(token, process.env.AES_SECRET, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString();
    return ciphertext;
}

function decryptToken(encryptedToken) {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, process.env.AES_SECRET, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    const originalToken = bytes.toString(CryptoJS.enc.Utf8);
    return originalToken;
}

async function authenticate(req) 
{
    const token = req.user;
    const id = token._id;
  
    if (!token) {
        throw new Error('No tokens found for this user');
    }
  
    const oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    const at = decryptToken(token.accessToken);
    const rt = decryptToken(token.refreshToken);
  
    oAuth2Client.setCredentials({
        access_token: at,
        refresh_token: rt,
        expiry_date: token.expiryDate
    });
  
    if (oAuth2Client.isTokenExpiring()) 
    {
        const refreshedTokens = await oAuth2Client.refreshAccessToken();
        const { credentials } = refreshedTokens;
        oAuth2Client.setCredentials(credentials);
        const att = encryptToken(credentials.access_token);
        const rtt = encryptToken(credentials.refresh_token);
    
        // Save updated tokens to the database

        await User.updateOne({ id }, {
            accessToken: att,
            refreshToken: rtt,
            expiryDate: credentials.expiry_date
        });
    }
  
    return oAuth2Client;
}
  

async function createSpreadsheet(title, req) 
{
    const auth = await authenticate(req);
    const sheets = google.sheets({ version: 'v4', auth });
  
    const resource = {
      properties: {
        title: title,
      },
    };
  
    const response = await sheets.spreadsheets.create({
      resource: resource,
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
  
    // Update each sheet with initial values and formatting
    const requests = topics.map(topic => {
        const she = shee.find(s => s.properties.title === topic).properties.sheetId;

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
  
    await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
            requests,
        },
    });
  
    return spreadsheetId;
}
  

async function addToSpreadsheet(spreadsheetId, sheetName, data, req, rID, mode, oldProb="")   // Help in doing stuff with Google Sheets.
{
    const auth = await authenticate(req);
    const sheets = google.sheets({ version: 'v4', auth });

    let writePointer = 0;
    
      const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `${sheetName}!A1`,
        });

        const output = response.data.values[0][0] || "4";   // Write in Row 4.
        const integerArray = output.split(',').map(item => item.trim()); 

    if(mode !== 1)
    {
      writePointer = +integerArray[0];
    }
    else
    {
      if(rID !== -1) {
        writePointer = rID;
      }

      else {
        writePointer = +integerArray[0];
      }
    }

    const newresponse = await sheets.spreadsheets.get({
      spreadsheetId: spreadsheetId,
    });
    const shee = newresponse.data.sheets;


    if(mode === 2)      // remove row with rID.
    {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${oldProb}!A1`,
      });
      const sheetId = shee.find(s => s.properties.title === oldProb).properties.sheetId;
      const newRes = rID + ", " + response.data.values[0][0];   // mark row as free.

      const requests = [
        // Clear cell values
        {
          updateCells: {
            range: {
              sheetId: sheetId,
              startRowIndex: rID - 1, // Zero-based index
              endRowIndex: rID,
            },
            fields: 'userEnteredValue' // Clear contents only
          }
        },
        // Clear formatting
        {
          updateCells: {
            range: {
              sheetId: sheetId,
              startRowIndex: rID - 1, // Zero-based index
              endRowIndex: rID,
            },
            fields: 'userEnteredFormat' // Clear formatting
          }
        },
        {
          updateCells: {
            range: {
              sheetId: sheetId,
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: 0, 
              endColumnIndex: 1 
            },
            rows: [{
              values: [{
                userEnteredValue: { stringValue: newRes }
              }]
            }],
            fields: 'userEnteredValue' // Update cell value
          }
        }
      ];

      const batchUpdateRequest = { requests };

      try {
          sheets.spreadsheets.batchUpdate({
          spreadsheetId: spreadsheetId,
          resource: batchUpdateRequest
        });
      } catch (err) {
        console.error('Error clearing the row:', err);
      }
    }

    const colorMap = {
        YES: {backgroundColor: {red: 1, green: 0, blue: 0}, textFormat: {foregroundColor: {red: 1, green: 1, blue: 1}, bold: true}},  // RED
        NO: {backgroundColor: {green: 0.69, red: 0, blue: 0.3137}, textFormat: {foregroundColor: {red: 1, green: 1, blue: 1}, bold: true}},  // GREEN
        SPECIAL: {backgroundColor: {green: 0.6, red: 1, blue: 0}, textFormat: {foregroundColor: {red: 1, green: 1, blue: 1}, bold: true}}  // YELLOW
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

    const sheetId = shee.find(s => s.properties.title === sheetName).properties.sheetId;
  
    const link = data.problemLink;

    const markForRevisitValue = rowData[0];
    const format = colorMap[markForRevisitValue] || {};

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
            },
            {
              repeatCell: {
                range: {
                  sheetId: sheetId,
                  startRowIndex: writePointer - 1,  // Adjust for zero-based index
                  endRowIndex: writePointer,
                  startColumnIndex: 3,  // 4th column is index 3 (0-based index)
                  endColumnIndex: 4,
                },
                cell: {
                  userEnteredFormat: {
                    wrapStrategy: 'WRAP',  // Enable word wrap
                  },
                },
                fields: 'userEnteredFormat.wrapStrategy',
              },
            },
          ],
        },
      });

      
    if(mode !== 1 || rID === -1)
    {
        let newPointer = 0;
        if(integerArray.length === 1)
        {
          newPointer = (parseInt(integerArray[0], 10) + 1).toString();
        }
        else
        {
          newPointer = integerArray.slice(1).join(', ');;
        }
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!A1`,
            valueInputOption: 'RAW',
            resource: {
                values: [[newPointer]],
            },
        });
    }

    return writePointer;
}
  
module.exports = { createSpreadsheet, addToSpreadsheet };