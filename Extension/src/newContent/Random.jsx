import React from 'react';
import ReactDOM from 'react-dom';
import Random from './RandomJSX';

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

async function insertReactButton() {

  const token = await getValue('token');
  const extension = await getValue('extension');   // only inject script if extension is enabled and user is logged in.

  if(token && extension)
  {
    const targetDivSelector = 'nav .display-none > div.flex > div.relative';
    const targetDiv = document.querySelector(targetDivSelector);

    if (targetDiv) {
      if(targetDiv.dataset.listenerAddedd == true)
      {
        console.log("Failed to Create!");
        return;
      }
      const buttonContainer = document.createElement('div');
      buttonContainer.id = 'RANDOM-CONTAINER';
      targetDiv.prepend(buttonContainer);

      ReactDOM.render(
        <Random/>,
        buttonContainer
      );
      targetDiv.dataset.listenerAddedd = true;
    } else {
      console.error('Target div not found in the navbar.');
    }
  }
  else
  {
    console.log("Hey!!!!");
  }
}

function removeReactButton() {
  const buttonContainer = document.getElementById('RANDOM-CONTAINER');
  if (buttonContainer) {
    buttonContainer.remove();
  }
}

async function handleChange() {
  const token = await getValue('token');
  const extension = await getValue('extension');

  if (token && extension) {
    insertReactButton();
  } else {
    removeReactButton();
  }
}

console.log("Invoking Random Injection Script");
setTimeout(() => {console.log("INTIATING!!!"); insertReactButton();}, 5000);

chrome.storage.onChanged.addListener(function(changes, areaName) {
  if (areaName === 'local' || areaName === 'sync') {
    if (changes.token) {
      handleChange();
    }
    if (changes.extension) {
      handleChange();
    }
  }
});

