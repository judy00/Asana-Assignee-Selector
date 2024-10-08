let emailList = [];
let currentIndex = 0;

function appendNavigationButtons() {
  logToResultDiv('append navigation buttons');
  const navigationBar = document.querySelector('.PotCustomTabNavigationBar');
  if (!navigationBar) {
    logToResultDiv('can not find navigationBar');
    return;
  }

  const buttonStyle = `
    color: #8b8b8b;
    font-size: 14px;
    padding: 4px 10px;
    border: 1px solid #4d4d4d;
    border-radius: 6px;
    transition: background-color 0.3s;
`;

  const prevButton = document.createElement('button');
  prevButton.textContent = 'Prev';
  prevButton.style.cssText = buttonStyle;
  prevButton.style.marginRight = '10px';
  prevButton.id = 'aas-prev-button';
  prevButton.addEventListener('click', () => navigateEmails('prev'));

  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.style.cssText = buttonStyle;
  nextButton.id = 'aas-next-button';
  nextButton.addEventListener('click', () => navigateEmails('next'));

  navigationBar.appendChild(prevButton);
  navigationBar.appendChild(nextButton);

  filterTasks(emailList[currentIndex])
    .catch(error => console.error('filterTasks error:', error));
}

function navigateEmails(direction) {
  if (!emailList.length) {
    logToResultDiv('emailList is empty');
    return;
  }

  if (direction === 'next') {
    currentIndex = (currentIndex + 1) % emailList.length;
  } else if (direction === 'prev') {
    currentIndex = (currentIndex - 1 + emailList.length) % emailList.length;
  }

  filterTasks(emailList[currentIndex])
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
  if (request.action === "setEmailList") {
    sendResponse({ received: true });

    if (!emailList.length) {
      emailList = request.emails;
      logToResultDiv('set new emailList', emailList);
      appendNavigationButtons(); // add navigation buttons
    } else {
      emailList = request.emails;
      currentIndex = 0;
      logToResultDiv(`currentEmail: ${emailList[currentIndex]}`);
      filterTasks(emailList[currentIndex])
        .catch(error => console.error('filterTasks error:', error));
    }
  } else if (request.action === "filterTasks") {
    sendResponse({ received: true });
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
  await new Promise(resolve => setTimeout(resolve, 200));

  const filterButton = Array.from(document.querySelectorAll('div.SubtleToggleButton')).find(el => el.textContent.trim() === 'Filter');
  if (!filterButton) {
    logToResultDiv('can not find filter button');
    return;
  }

  filterButton.click();
  await new Promise(resolve => setTimeout(resolve, 200));

  const addItemButton = document.querySelector('.AddItemButton-button');
  if (!addItemButton) {
    logToResultDiv('can not find add item button');
    return;
  }

  addItemButton.click();
  await new Promise(resolve => setTimeout(resolve, 200));

  const assigneeLabel = Array.from(document.querySelectorAll('.AddFilterButtonContainer-label')).find(el => el.textContent.trim() === 'Assignee');
  if (!assigneeLabel) {
    logToResultDiv('can not find assignee label');
    return;
  }

  assigneeLabel.click();
  await new Promise(resolve => setTimeout(resolve, 200));

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
