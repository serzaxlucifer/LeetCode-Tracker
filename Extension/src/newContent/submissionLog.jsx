import React from "react";
import ReactDOM from "react-dom";
import Submission from "./submissionTabber";
import { useRef, useEffect } from "react";
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

async function getValue(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], function(result) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[key]);
      }
    });
  });
}

var un = "";
var IDD = 0;
var removeInvoker = "";

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


async function getSubmission(u, id) {
  const ROUTE = await getValue('getRoute');
  let result = [];
  const token = await getValue('token');

  if(token === null)
  {
    alert("Failed to fetch submissions from server. Make sure you are logged in first!");
    return 3;
  }

  try {
    const response = await apiConnector('GET', ROUTE + `?leetcode_username=${u}&problem_id=${id}`, null, {
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

function getLeetCodeUser()
{
  let userN = "";
  try {
    const b = JSON.parse(window.localStorage.getItem("GLOBAL_DATA:value"));
    userN = b?.userStatus?.username;
  }
  catch(err)
  {
    alert("Failed to fetch LeetCode Username. Contact the developers if reloading page doesn't work! Please disable the extension in case of unstability.");
    return "";
  }
  return userN;
}

function attachQuestionChangeListeners()
{
  try {
    let b = document.querySelectorAll('a.group.cursor-pointer');
    const c = b[0];
    const d = b[1];
    const e = document.querySelector('a.cursor-pointer.justify-center');

    if (c.dataset.listenerAddedd) 
    {
        c.removeEventListener('click', changeQuestion);
        d.removeEventListener('click', changeQuestion);
        e.removeEventListener('click', changeQuestion);
          
        c.dataset.listenerAddedd = false;
    }
  
        attachListner(c);
        attachListner(d);
        attachListner(e);
          
        c.dataset.listenerAddedd = true;
  }

  catch(err)
  {
    alert("Failed to attach listners for QC. Please contact the developers. Please disable the extension in case of unstability. ");
  }
}

function getProblemDetails()
{
  try {
    const t = document.querySelector('a.no-underline.cursor-text');
    const r = t.innerHTML.split(". ");
    const IID = +r[0];
    IDD = IID;
    const name = r[1];
    const link = t.href;
    return {ID: IID, name: name, link: link};
  }

  catch(err)
  {
    alert("Failed to fetch problem details. Try reloading the page and contact developers if it doesn't work. Please disable the extension in case of unstability.");
  }

}

function changeQuestion()
{
  try {
  const parent = document.querySelector('nav > div.flex > div.flex > div.relative');
  const child = document.querySelector('nav > div.flex > div.flex > div.relative > div.TRACKER');

      if (parent && child) 
      {
          parent.removeChild(child);

          let b = document.querySelectorAll('a.group.cursor-pointer');
          const c = b[0];
          const d = b[1];
          const e = document.querySelector('a.cursor-pointer.justify-center');
          const m = document.querySelector("div.flex.w-full.flex-grow.overflow-y-hidden");
          m.removeEventListener('click', documentToggle);

          c.style.pointerEvents = 'none';
          d.style.pointerEvents = 'none';
          e.style.pointerEvents = 'none';
          c.style.cursor = 'not-allowed';
          d.style.cursor = 'not-allowed';
          e.style.cursor = 'not-allowed';

          c.removeEventListener('click', changeQuestion);
          d.removeEventListener('click', changeQuestion);
          e.removeEventListener('click', changeQuestion);
          c.dataset.listenerAddedd = false;

          const t = document.querySelector("button[data-e2e-locator=\"console-submit-button\"]");

          if(t && t.dataset.listenerAddeddd)
          {
              t.removeEventListener('click', removeInvoker);
              t.dataset.listenerAddeddd = false;
          }

          setTimeout(insertSubmissionButton, 3000);
          setTimeout(() => {
            c.style.pointerEvents = 'auto';
            d.style.pointerEvents = 'auto';
            e.style.pointerEvents = 'auto';
            c.style.cursor = 'pointer';
            d.style.cursor = 'pointer';
            e.style.cursor = 'pointer';
          }, 4000);

        }
      }

  catch(err)
  {
    alert("Failed to re-mount script. Try reloading the page and contact developers if it doesn't work. Please disable the extension in case of unstability.");
  }
}


function attachListner(obj) {
  obj.addEventListener('click', changeQuestion);
}


async function insertSubmissionButton() {
  const token = await getValue('token');
  const userName = getLeetCodeUser();
  un = userName;
  const text = getProblemDetails();

  if(token && userName && await getValue('extension'))
  {
    if(text) 
    {
      attachQuestionChangeListeners();
      const ID = text.ID;
      IDD = ID;
      const name = text.name;
      const link = text.link;
      const result = await getSubmission(userName, ID);    // pre-existing submissions?

        const targetDivSelector = 'nav > div.flex > div.flex > div.relative';
        const targetDiv = document.querySelector(targetDivSelector);

        if (targetDiv) 
        {
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('TRACKER');
            targetDiv.prepend(buttonContainer);

            if(result !== 3) {
            ReactDOM.render(
              <> <Toaster />
                <DIV key={IDD} userName={userName} ID={IDD} name={name} link={link} topic={result.problemTopic} learning={result.learning} revisit={result.markForRevisit} code={result.code} token={token}/> </>,
                buttonContainer
            ); }

            else
            {
              ReactDOM.render(
                <DIV key={IDD} userName={userName} ID={IDD} name={name} link={link} topic={"Arrays"} learning={""} revisit={0} code={""} token={token}/>,
                buttonContainer
            );
            }
        } else 
        {
          alert("Failed to kickstart leetcode tracker extension. Please contact the developers!");
        }
    }

  }
}

function documentToggle() 
{
  setTimeout(() => {
    try {
    const t = document.querySelector("button[data-e2e-locator=\"console-submit-button\"]");

    if(t && !t.dataset.listenerAddeddd)
    {
        t.addEventListener('click', removeInvoker);
        t.dataset.listenerAddeddd = true;
    }
}
catch(err)
  {
    alert("Failed to find submit button. Try reloading the page and contact developers if it doesn't work. Please disable the extension in case of unstability.");
  }}
, 2000);
}

function attachMegaListner(obj) {
  obj.addEventListener("click", documentToggle);
}

// -----------------

function checkForResults() {

  const resultElement = document.querySelector(
    'span[data-e2e-locator="submission-result"]'
  );

  if (resultElement === null || resultElement.innerHTML === "Accepted!") {
    return 0;
  }

  else
  {
      if (resultElement.innerHTML === "Accepted") 
      {
        resultElement.innerHTML = "Accepted!"; 
        const data = Array.from(document.querySelectorAll("pre > code > span"));
        let result = data.map((span) => span.outerText).join(""); // parse HTML
        return result;
      }
      else
      {
        return 1;
      }
    }
}

async function invokeSubmitHandler(ref) {

  if(await getValue('logging') === false || await getValue('extension') === false)
  {
    return;
  }

  const checkInterval = 1000;
  const maxCheckTime = 15000;


  const intervalId = setInterval(async() => {
    const i = checkForResults();

      if (i === 1) 
      {
        clearInterval(intervalId);
      } else if(i !== 0)
      {
        // i has code to be deposited. 

        clearInterval(intervalId);
        const page = IDD;
        const details = await getSubmission(un, page);
        
        // Invoke Submit Handler

        if(details !== 3){
            const c = details.code + "\n\n" + i;
            ref.current.setType(1);
            ref.current.setFormData((prevData) => { return {
              ...prevData,
              problemTopic: details.problemTopic, learning: details.learning, code: c, markForRevisit: details.markForRevisit
            };});
            ref.current.setModal();
        }

        else
        {
            ref.current.setType(1);
            ref.current.setFormData((prevData) => ({
              ...prevData,
              problemTopic: "Arrays", learning: "", code: i, markForRevisit: 0
            }));
            ref.current.setModal();
        }

      }
  }, checkInterval);

  setTimeout(() => {
    clearInterval(intervalId);
  }, maxCheckTime);
}

// -----------------

function invokeWrapper(ref)
{
  return function() {
    invokeSubmitHandler(ref);
  }
}

function mountScripts(ref) 
{

        try {
        
        const t = document.querySelector("button[data-e2e-locator=\"console-submit-button\"]");

        const reference = invokeWrapper(ref);
        
          if(t)
          {
            if(t.dataset.listenerAddeddd)
              {
                t.removeEventListener('click', removeInvoker);
                t.dataset.listenerAddeddd = false;
              }
              t.addEventListener('click', reference);
              t.dataset.listenerAddeddd = true;
          }
            
        removeInvoker = reference;
        const m = document.querySelector("div.flex.w-full.flex-grow.overflow-y-hidden");
        attachMegaListner(m, ref);
          }

          catch(err)
          {
            alert("Failed to mount script. Try reloading the page and contact developers if it doesn't work. Please disable the extension in case of unstability.");
          }
      
}

const DIV = ({token, userName, ID, name, link, topic, learning, revisit, code}) => {

  const componentRef = useRef();

  useEffect(() => {
      mountScripts(componentRef);
  }, []);

  return (<Submission key={ID} userName={userName} ID={ID} name={name} link={link} topic={topic} learning={learning} revisit={revisit} code={code} token={token} ref={componentRef} />);
}


setTimeout(insertSubmissionButton, 6000);
