let emailArray = [];
let currentEmailIndex = 0;

function appendNavigationButtons() {
  const navigationBar = document.querySelector('.PotCustomTabNavigationBar');
  if (!navigationBar) {
    logToResultDiv('can not find navigationBar');
    return;
  }

  const prevButton = document.createElement('button');
  prevButton.textContent = 'Prev';
  prevButton.style.marginRight = '10px';
  prevButton.addEventListener('click', () => navigateEmails('prev'));

  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.addEventListener('click', () => navigateEmails('next'));

  navigationBar.appendChild(prevButton);
  navigationBar.appendChild(nextButton);

  const email = emailArray[currentEmailIndex];
  filterTasks(email)
    .catch(error => console.error('filterTasks error:', error));
}

function navigateEmails(direction) {
  if (!emailArray.length) {
    logToResultDiv('emailArray is empty');
    return;
  }

  if (direction === 'next') {
    currentEmailIndex = (currentEmailIndex + 1) % emailArray.length;
  } else if (direction === 'prev') {
    currentEmailIndex = (currentEmailIndex - 1 + emailArray.length) % emailArray.length;
  }

  const email = emailArray[currentEmailIndex];
  filterTasks(email)
    .catch(error => console.error('filterTasks error:', error));
}

function logToResultDiv(message) {
  chrome.runtime.sendMessage({ action: "log", message: message }, response => {
    if (chrome.runtime.lastError) {
      console.log('AAS log:', message);
    }
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "setEmailArray") {
    sendResponse({ received: true });
    if (!emailArray.length) {
      emailArray = request.emails.filter(email => email);
      logToResultDiv('set new emailArray', emailArray);
      appendNavigationButtons(); // add navigation buttons
    } else {
      emailArray = request.emails.filter(email => email);

      const email = emailArray[currentEmailIndex];
      logToResultDiv(`currentEmail: ${email}`);
      filterTasks(email)
        .catch(error => console.error('filterTasks error:', error));
    }
    currentEmailIndex = 0;
  } else if (request.action === "filterTasks") {
    sendResponse({received: true});
    filterTasks(request.email)
      .catch(error => console.error('filterTasks error:', error));
  }
  return true;
});

async function filterTasks(email) {
  const oldFilterButton = Array.from(document.querySelectorAll('div.SubtleToggleButton')).find(el => el.textContent.trim().startsWith('Filters'));
  if (oldFilterButton) {
    const removeOldFilterButton = oldFilterButton.querySelector('div.SubtleIconButton');
    if (removeOldFilterButton) {
      removeOldFilterButton.click()
    }
  }
  await new Promise(resolve => setTimeout(resolve, 100));

  const filterButton = Array.from(document.querySelectorAll('div.SubtleToggleButton')).find(el => el.textContent.trim() === 'Filter');
  if (!filterButton) {
    logToResultDiv('can not find filter button');
    return;
  }

  filterButton.click();
  await new Promise(resolve => setTimeout(resolve, 100));

  const addItemButton = document.querySelector('.AddItemButton-button');
  if (!addItemButton) {
    logToResultDiv('can not find add item button');
    return;
  }

  addItemButton.click();
  await new Promise(resolve => setTimeout(resolve, 100));

  const assigneeLabel = Array.from(document.querySelectorAll('.AddFilterButtonContainer-label')).find(el => el.textContent.trim() === 'Assignee');
  if (!assigneeLabel) {
    logToResultDiv('can not find assignee label');
    return;
  }

  assigneeLabel.click();
  await new Promise(resolve => setTimeout(resolve, 100));

  const assigneeInput = document.querySelector('input[data-testid="tokenizer-input"]');
  if (!assigneeInput) {
    logToResultDiv('can not find assignee input');
    return;
  }

  assigneeInput.value = email;
  assigneeInput.dispatchEvent(new Event('input', { bubbles: true }));

  const startTime = Date.now();
  const timeout = 20000; // 20 seconds timeout
  let matchingElement = null;

  while (Date.now() - startTime < timeout) {
    matchingElement = Array.from(document.querySelectorAll('div')).find(el => el.textContent.trim() === email);
    if (matchingElement) {
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  if (!matchingElement) {
    logToResultDiv('can not find matching element');
    return;
  }

  matchingElement.click();
  logToResultDiv(`filter ${email} tasks successfully`);

  await new Promise(resolve => setTimeout(resolve, 500));

  const currentFilterButton = Array.from(document.querySelectorAll('div.SubtleToggleButton')).find(el => el.textContent.trim().startsWith('Filters'));
  if (currentFilterButton) {
    currentFilterButton.click()
  }
}
