document.addEventListener('DOMContentLoaded', function() {
  const emailInput = document.getElementById('email-input');
  const filterButton = document.getElementById('filter-button');
  const resultDiv = document.getElementById('result');
  let logs = [];

  displayLogs();

  filterButton.addEventListener('click', function() {
    const inputValue = emailInput.value;
    resultDiv.textContent = 'Processing...';

    if (inputValue.includes(',')) {
      const emails = inputValue.split(',').map(email => email.trim());
      console.log('emails', emails);
      console.log('type of emails', typeof emails);

      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "setEmailArray", emails: emails}, function(response) {
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
    console.log('addLog', message);
    logs.push(message);
    if (logs.length > 100) { // 限制日誌數量為最新的 100 條
      logs.shift();
    }
    const logMessage = document.createElement('p');
    logMessage.textContent = message;
    resultDiv.appendChild(logMessage);
    resultDiv.scrollTop = resultDiv.scrollHeight; // 自動滾動到底部
  }

  function displayLogs() {
    console.log('displayLogs', logs);
    resultDiv.innerHTML = ''; // 清空現有內容
    logs.forEach(function(log) {
      const logMessage = document.createElement('p');
      logMessage.textContent = log;
      resultDiv.appendChild(logMessage);
    });
    resultDiv.scrollTop = resultDiv.scrollHeight; // 自動滾動到底部
  }
});

