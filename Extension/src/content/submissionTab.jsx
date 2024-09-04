import React from 'react';
import ReactDOM from 'react-dom';
import Submission from './submissionTabber';
import axios from 'axios';


const axiosInstance = axios.create();

const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};

async function getSubmission(token, u, id) {
  const RANDOM = "http://localhost:5000/submissions/get-entry";
  let result = [];


  try {
    const response = await apiConnector('GET', RANDOM + `?leetcode_username=${u}&problem_id=${id}`, null, {
      Authorization: `Bearer ${token}`,
    });

    if (response.data.message !== 'FOUND') {
      throw new Error(response.data.error);
    }

    result = response.data.submission;
  } catch (err) {
    return 3;
  }

  return result;
}

function attachListner(obj) {
    obj.addEventListener('click', () => {
        console.log('Element clicked!');
        const parent = document.querySelector('nav > div.flex > div.flex > div.relative');
        const child = document.querySelector('nav > div.flex > div.flex > div.relative > div.TRACKER');

        if (parent && child) 
        {
          parent.removeChild(child);
        }
        // else
        // {
        // }

        setTimeout(insertSubmissionButton, 2000);
      });
}


async function insertSubmissionButton() {

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmM5MzY4ODkxMjkxOWE2ZGY2NGQ4NjgiLCJpYXQiOjE3MjQ4NDAwNzB9.UWsXPDwCkPBMiQLbtcHZJBLidaABTDumMbfsibeDtXk";//localStorage.getItem('token');
  const extension = true//localStorage.getItem('extension');   // only inject script if extension is enabled and user is logged in.
  const b = JSON.parse(window.localStorage.getItem("GLOBAL_DATA:value"));
  const userName = b?.userStatus?.username;

  if(token && extension && userName)
  {
    const t = document.querySelector('a.no-underline.cursor-text');
    let b = document.querySelectorAll('a.group.cursor-pointer');
    const c = b[0];
    const d = b[1];
    const e = document.querySelector('a.cursor-pointer.justify-center');

    if(t) 
    {

    // Add Event Listener

    if (!c.dataset.listenerAddedd) 
    {
        console.log("Adding Event Listener!");

        attachListner(c);
        attachListner(d);
        attachListner(e);
        
        c.dataset.listenerAddedd = true;
    }

    const r = t.innerHTML.split(". ");
    const ID = +r[0];
    const name = r[1];
    const link = t.href;


    const result = await getSubmission(token, userName, ID);

    if(result !== 3)
    {
        const targetDivSelector = 'nav > div.flex > div.flex > div.relative';
        const targetDiv = document.querySelector(targetDivSelector);

        if (targetDiv) {
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('TRACKER');
            targetDiv.prepend(buttonContainer);

            ReactDOM.render(
                <Submission data={result} token={token} PROBLEM={{ID: ID, name: name, link: link, userName: userName}}/>,
                buttonContainer
            );
            } else {
            console.error('Target div not found in the navbar.');
            }
        }
        else
        {
            console.log("No Submission Found");
        }
    }

}
}
setTimeout(insertSubmissionButton, 6000);
