document.addEventListener('DOMContentLoaded', function() {
  const emailInput = document.getElementById('email-input');
  const filterButton = document.getElementById('filter-button');
  const resultDiv = document.getElementById('result');
  let logs = [];

  filterButton.addEventListener('click', function() {
    const inputValue = emailInput.value;
    resultDiv.textContent = 'Processing...';

    if (inputValue.includes(',')) {
      const emails = inputValue.split(',')
        .map(email => email.trim())
        .filter(email => email);

      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "setEmailList", emails: emails}, function(response) {
          if (chrome.runtime.lastError) {
            console.error('script error:', chrome.runtime.lastError.message);
            resultDiv.textContent = 'Cannot connect to Asana';
            return;
          }
        });
      });
    } else {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "filterTasks", email: inputValue }, function(response) {
          if (chrome.runtime.lastError) {
            console.error('script error:', chrome.runtime.lastError.message);
            resultDiv.textContent = 'Cannot connect to Asana';
          } else if (response && response.received) {
            console.log('Message received by content script');
            resultDiv.textContent = `Filtering tasks for ${inputValue}...`;
          } else {
            esultDiv.textContent = 'Unknown error';
          }
        });
      });
    }
  });

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "log") {
      addLog(request.message);
    }
  });

  function addLog(message) {
    logs.push(message);
    if (logs.length > 50) {
      logs.shift();
    }
    const logMessage = document.createElement('p');
    logMessage.textContent = message;
    resultDiv.appendChild(logMessage);
    resultDiv.scrollTop = resultDiv.scrollHeight;
  }
});

