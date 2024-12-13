

async function fetchAndDisplayData() {
    const buttonContainer = document.querySelector('.button-container');
  
    if (!buttonContainer) {
      console.error("No button container found in the DOM.");
      return;
    }
  
    const linkElement = buttonContainer.querySelector('a');
    if (!linkElement) {
      buttonContainer.textContent = "No JSON link found.";
      console.error("No JSON link found in the button container.");
      return;
    }
  
    const jsonURL = linkElement.href;
    const contentDiv = document.querySelector('.table-wrapper');
  
    try {
      const response = await fetch(jsonURL);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
  
      const json = await response.json();
  
      buttonContainer.remove();
      contentDiv.innerHTML = '';
  
      if (!json.data || !Array.isArray(json.data)) {
        throw new Error('Invalid data format');
      }
  
      const allItemsContainer = document.createElement('div');
      allItemsContainer.className = 'all-items-container';
  
      json.data.forEach((item, index) => {
        const itemRow = document.createElement('div');
        itemRow.className = 'item-row';
  
        const number = document.createElement('div');
        number.className = 'item-number';
        number.textContent = `${index + 1}.`;
  
        const itemTitleAndDescription = document.createElement('div');
        itemTitleAndDescription.className = 'item-title-and-description';
  
        const title = document.createElement('span');
        title.className = 'item-title';
        title.textContent = item.Title || 'No Title';
  
        const description = document.createElement('span');
        description.className = 'item-description';
        description.textContent = item.Description || 'No Description';
  
        itemTitleAndDescription.appendChild(title);
        itemTitleAndDescription.appendChild(description);
  
        itemRow.appendChild(number);
        itemRow.appendChild(itemTitleAndDescription);
  
        allItemsContainer.appendChild(itemRow);
      });
  
      contentDiv.appendChild(allItemsContainer);
    } catch (error) {
      contentDiv.textContent = `Failed to load data: ${error.message}`;
    }
  }
  
  fetchAndDisplayData();
  