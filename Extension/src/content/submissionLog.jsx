import React from "react";
import ReactDOM from "react-dom";
import Submissionn from "./submissionLogger";
import { useRef, useEffect } from "react";
import axios from 'axios';



let un = "";
let tok = "";

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
    console.log(u);
  
    console.log('Inside Fetch Function');
  
    try {
      console.log('RANDOM API INITIATING!');
      const response = await apiConnector('GET', RANDOM + `?leetcode_username=${u}&problem_id=${id}`, null, {
        Authorization: `Bearer ${token}`,
      });
  
      console.log("RESPONSE", response.data.submission);
  
      console.log('Call is ended');
  
      if (response.data.message !== 'FOUND') {
        throw new Error(response.data.error);
      }

      console.log("result, ", result);
  
      result = response.data.submission;
    } catch (err) {
      console.log("CATCHING ERROR!");
      return 3;
    }
  
    return result;
  }

  function update()
  {
      let t = document.querySelector("a.no-underline.cursor-text");
      let r = t.innerHTML.split(". ");
      let ID = +r[0];
      let name = r[1];
      let link = t.href;
      let problem = {ID: ID, name: name, link: link, problemTopic: "", learning: "", code: "", markForRevisit: 0};
      console.log("problem, ", problem);
  
      return problem;
  }

var mountLock = false;      // prevent multiple mounts on a button.

function attachListner(obj, ref, user_name, token) {
    obj.addEventListener("click", () => {
    setTimeout(() => {
        const t = document.querySelector("button[data-e2e-locator=\"console-submit-button\"]");
        console.log(t);
        if(t && !t.dataset.listenerAddeddd)
        {
            if(mountLock)
            {
                console.log("Mounting is locked");
                return;
            }
            mountLock = true;
            t.addEventListener('click', () => {invokeSubmitHandler(ref, user_name, token)});
            console.log("SUBMIT MOUNTED");
            t.dataset.listenerAddeddd = true;
            mountLock = false;
        }
        else
        {
            console.log("Mounting Failed");
        }
    }, 2000);
  });

  console.log("mounted at >, < , shuffle");
}

function checkForResults() {
  const resultElement = document.querySelector(
    'span[data-e2e-locator="submission-result"]'
  );

  if (resultElement === null) {
    return 0;
  } else if (resultElement.innerHTML !== "Accepted") {
    return 1;
  } else {
    const data = Array.from(document.querySelectorAll("pre > code > span"));
    console.log(data);
    let result = data.map((span) => span.outerText).join(""); // parse HTML
    console.log(result);
    return result;
  }
}

function invokeSubmitHandler(ref, user_name, token) {
  const checkInterval = 1000;
  const maxCheckTime = 15000;

  console.log("Submit Handler Called!");


  const intervalId = setInterval(async() => {
    const i = checkForResults();
    if (i === 0) {
      console.log("No Results Found");
    } else {
      if (i === 1) 
      {
        console.log("Not Accepted!");
        clearInterval(intervalId);
      } else 
      {
        // i has code to be deposited.
        console.log("i", i);
        clearInterval(intervalId);
        const page = update();
        const details = await getSubmission(tok, un, page.ID);
        
        // Invoke Submit Handler

        if(details !== 3){

            console.log("Passing Over to the Modal");
            const c = details.code + "\n\n" + i;
            ref.current.setProperties({...ref.current.properties, problemID: page.ID, problemName: page.name, problemLink: page.link, problemTopic: details.problemTopic, learning: details.learning, code: c, markForRevisit: details.markForRevisit});
            ref.current.setRevisit(details.markForRevisit);
            console.log(ref.current.properties);
            ref.current.setModal();
            console.log("Passing Over to the Modal");
        }

        else
        {

            console.log("Passing Over to the Modall");
            ref.current.setProperties({...ref.current.properties, problemID: page.ID, problemName: page.name, problemLink: page.link, problemTopic: "", learning: "", code: i, markForRevisit: 0});
            ref.current.setRevisit(0);
            console.log(ref.current.properties);
            ref.current.setModal();
            console.log("Passing Over to the Modall");
        }

      }
    }
  }, checkInterval);

  setTimeout(() => {
    clearInterval(intervalId);
    console.log("Stopped checking after 10 seconds.");
  }, maxCheckTime);
}

function insertSubmissionButton() 
{
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmM5MzY4ODkxMjkxOWE2ZGY2NGQ4NjgiLCJpYXQiOjE3MjQ4NDAwNzB9.UWsXPDwCkPBMiQLbtcHZJBLidaABTDumMbfsibeDtXk"; //localStorage.getItem('token');
  const extension = true; //localStorage.getItem('extension');   // only inject script if extension is enabled and user is logged in.
  const logging = true; //localStorage.getItem('logging');
  const b = JSON.parse(window.localStorage.getItem("GLOBAL_DATA:value"));
  const userName = b?.userStatus?.username;

  if (token && extension && userName && logging) {
    un = userName;
    tok = token;
    const targetDivSelector = "nav > div.flex > div.flex > div.relative";
    const targetDiv = document.querySelector(targetDivSelector);

    if (targetDiv) {

      console.log("STEP 3");
      console.log("STEP 4");
      const buttonContainer = document.createElement("div");
      console.log("STEP 5");
      buttonContainer.classList.add("LT_SUBMIT");
      console.log("STEP 6");
      console.log("Making Final Render Call");
      targetDiv.prepend(buttonContainer);
      ReactDOM.render(<DIV token={token} userName={userName} />, buttonContainer);

      console.log("STEP 5 - DIV ADDED");
  }
}
}

function mountScripts(ref, user_name, token) 
{
        console.log("Beginning to Mount");
        console.log("refs", ref);

      const t = document.querySelector("a.no-underline.cursor-text");

      if (t) {
        console.log("Problem Detected");
        // Add Event Listener

        
        console.log("Adding Event Listener!");
        
        console.log("Mounting on Submit");
        
        const t = document.querySelector("button[data-e2e-locator=\"console-submit-button\"]");
        console.log(t);
        if(t && !t.dataset.listenerAddeddd)
            {
                console.log("Mounting ");
                t.addEventListener('click', () => {invokeSubmitHandler(ref, user_name, token)});
                console.log("Mounted");
                t.dataset.listenerAddeddd = true;
            }
            else
            {
                console.log("Mounting Failed");
            }
            attachListner(document, ref);
      }
     else {
      console.error("Failed to mount Logging HTML.");
    }
}

const DIV = ({token, userName}) => {
    const componentRef = useRef();
    console.log("Adding DIV");
    console.log("Adding DIV", userName);
    useEffect(() => {
        console.log("never run!")
        mountScripts(componentRef, userName, token);
    }, []);
    return (<Submissionn token={token} uName={userName} ref={componentRef} />);
}

console.log("Invoking Submission Injection Script");
setTimeout(insertSubmissionButton, 5000);
