import React from 'react';
import ReactDOM from 'react-dom';
import Random from './RandomJSX';


function insertReactButton() {

  const token = "sfgsfgsg"//localStorage.getItem('token');
  const extension = true//localStorage.getItem('extension');   // only inject script if extension is enabled and user is logged in.

  if(token && extension)
  {
    const targetDivSelector = 'nav .display-none > div.flex > div.relative';
    const targetDiv = document.querySelector(targetDivSelector);

    if (targetDiv) {
      const buttonContainer = document.createElement('div');
      targetDiv.prepend(buttonContainer);

      ReactDOM.render(
        <Random/>,
        buttonContainer
      );
    } else {
      console.error('Target div not found in the navbar.');
    }
  }

}

console.log("Invoking Random Injection Script");
setTimeout(insertReactButton, 5000);
