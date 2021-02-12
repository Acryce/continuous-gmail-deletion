// ==UserScript==
// @name         Gmail Continuous Deletion
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enable entire page deletion and continuous deletion functionality. IMPORTANT: Only works with the HTML version of Gmail
// @author       Christian Farmer
// @match        https://mail.google.com/mail/u/0/h/*
// @grant        none
// ==/UserScript==

/* eslint-disable wrap-iife */
(() => {
  function main() {
    const CONTINUOUS_DELETION_KEY = 'continuous-deletion';

    if (sessionStorage.getItem(CONTINUOUS_DELETION_KEY) == null) {
      sessionStorage.setItem(CONTINUOUS_DELETION_KEY, 'false');
    }

    injectUiElements();

    document.querySelector('#delete-page').addEventListener('click', () => { deletePage(); });

    const continuousTrue = document.querySelector('#continuous-deletion-true');
    const continuousFalse = document.querySelector('#continuous-deletion-false');
    initializeRadioButtons(continuousTrue, continuousFalse, CONTINUOUS_DELETION_KEY);

    setTimeout(() => {
      if (continuousFalse.checked) return;

      if (document.querySelectorAll('input[type=\'checkbox\']').length > 0) {
        deletePage();
      } else {
        sessionStorage.setItem(CONTINUOUS_DELETION_KEY, 'false');
      }
    }, 2000);
  }

  function initializeRadioButtons(continuousTrue, continuousFalse, continuousDeletionKey) {
    if (sessionStorage.getItem(continuousDeletionKey) === 'true') {
      continuousTrue.checked = true;
    } else {
      continuousFalse.checked = true;
    }

    continuousTrue.addEventListener('click', () => {
      sessionStorage.setItem(continuousDeletionKey, 'true');
    });

    continuousFalse.addEventListener('click', () => {
      sessionStorage.setItem(continuousDeletionKey, 'false');
    });
  }

  function injectUiElements() {
    document.querySelector('table').insertAdjacentHTML('beforebegin', '<button id="delete-page">Delete Page</button>');

    document.querySelector('table').insertAdjacentHTML('beforebegin', '<span style="margin-left: 10px;">Continuously delete:</span>');
    document.querySelector('table').insertAdjacentHTML('beforebegin',
      '<input id="continuous-deletion-true" name="continuous-deletion-options" type="radio">True</input>');
    document.querySelector('table').insertAdjacentHTML('beforebegin',
      '<input id="continuous-deletion-false" name="continuous-deletion-options" type="radio">False</input>');
  }

  function deletePage() {
    document.querySelectorAll('input[type=\'checkbox\']').forEach((e) => { e.click(); });
    const deleteForever = document.querySelector('input[value=\'Delete Forever\']');
    if (deleteForever) {
      deleteForever.click();
    } else {
      // document.querySelector('input[value=\'Delete\']').click();
    }
  }

  main();
})();
