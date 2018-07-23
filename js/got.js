function getData(url, callbackFunc) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      callbackFunc(this);
    }
  };
  xhttp.open('GET', url, true);
  xhttp.send();
}

function successAjax(xhttp) {
  // itt a json content, benne a data változóban
  var userDatas = JSON.parse(xhttp.responseText);

  const index = findDataTable(userDatas);
  const characters = userDatas[index].data;
  getLivingCharacters(characters);

  /*
      Pár sorral lejebb majd ezt olvashatod:
      IDE ÍRD A FÜGGVÉNYEKET!!!!!! NE EBBE AZ EGY SORBA HANEM INNEN LEFELÉ!

      Na azokat a függvényeket ITT HÍVD MEG!

      A userDatas NEM GLOBÁLIS változó, ne is tegyétek ki globálisra. Azaz TILOS!
      Ha valemelyik függvényeteknek kell, akkor paraméterként adjátok át.
    */
}

// Írd be a json fileod nevét/útvonalát úgy, ahogy nálad van
getData('/json/characters.json', successAjax);

// Live servert használd mindig!!!!!
/* IDE ÍRD A FÜGGVÉNYEKET!!!!!! NE EBBE AZ EGY SORBA HANEM INNEN LEFELÉ! */

function findDataTable(array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].type === 'table') {
      return i;
    }
  }
  return null;
}

function getLivingCharacters(array) {
  let living = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i].dead !== 'true') {
      living.push(array[i]);
    }
  }
  showLivingCharacters(living);
  search(living);
}

function showLivingCharacters(array) {
  sortByName(array);
  let contentDiv = document.querySelector('.content');
  for (let i = 0; i < array.length; i++) {
    let characterDiv = document.createElement('div');
    characterDiv.className = 'character';
    let img = document.createElement('img');
    img.src = `${array[i].portrait}`;
    let pTagForName = document.createElement('p');
    pTagForName.innerHTML = `${array[i].name}`;
    pTagForName.onclick = () => {showOneCharacter(array[i]);};
    characterDiv.appendChild(img);
    characterDiv.appendChild(pTagForName);
    contentDiv.appendChild(characterDiv);
  }
}

function sortByName(array) {
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i].name.localeCompare(array[j].name) > 0) {
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
  }
}

function showOneCharacter(character) {
  let sidebarContent = document.querySelector('.sidebar-content');
  let selectedCharacter = document.querySelector('.selected-character');
  if (!selectedCharacter) {
    selectedCharacter = document.createElement('div');
    selectedCharacter.className = 'selected-character';
  }
  let selectedCharacterDescription = `<img src="${character.picture}" alt="${character.name}" class="picture">`;
  selectedCharacterDescription += `<h3>${character.name}</h3>`;
  if (character.house !== '') {
    selectedCharacterDescription += `<img src="/assets/houses/${character.house}.png" class="house">`;
  }
  selectedCharacterDescription += `<p class="bio">${character.bio}</p>`;
  selectedCharacter.innerHTML = selectedCharacterDescription;
  sidebarContent.appendChild(selectedCharacter);
}

function searchACharacterByName(array, searchTerm) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].name.toLowerCase() === searchTerm.toLowerCase()) {
      return i;
    }
  }
  return -1;
}

function search(array) {
  document.querySelector('.submit-button').onclick = () => {
    const searchTerm = document.querySelector('.search-text').value;
    const characterIndex = searchACharacterByName(array, searchTerm);
    if (characterIndex === -1) {
      let selectedCharacter = document.querySelector('.selected-character');
      selectedCharacter.innerHTML = 'Character not found.';
    } else {
      showOneCharacter(array[characterIndex]);
    }
  };
}
