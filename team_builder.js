/*  Variabili globali   */ 
let dragged;
let drag_start_container;
let drag_end_container;
let counter=0;
let x=0;
/*
Ciclo che implementa la creazione della board per la costruzione del team,
assegnazione delle classi agli elementi hex e composizione degli esagoni e indicizzazione
*/
for(let i=0; i<28; i++){
    const new_hex = document.createElement('div');

    new_hex.textContent='';
    new_hex.classList.add('hex');

    if(i===7 || i===21){
        new_hex.classList.add('shifted_hex');
    }
    new_hex.dataset.index = i+1;

    const container = document.querySelector('#four-row');
    container.appendChild(new_hex);

    new_hex.addEventListener("dragover", (event) => {event.preventDefault();}, false,);
    new_hex.addEventListener("dragenter", (event) => {event.target.classList.add("dragover"); drag_end_container=new_hex;});
    new_hex.addEventListener("dragleave", (event) => {event.target.classList.remove("dragover");});
    new_hex.addEventListener("drop", (event) => {event.preventDefault(); event.target.classList.remove("dragover"); swapBoard(dragged, drag_start_container, drag_end_container)});

    const new_top_hex = document.createElement('div');
    const new_bot_hex = document.createElement('div');
    new_top_hex.classList.add('top_hex');
    new_bot_hex.classList.add('bot_hex');

    new_hex.appendChild(new_top_hex);
    new_hex.appendChild(new_bot_hex);

    const new_div = document.createElement('div');
    new_div.classList.add('champ-item-container');

    const new_champ_wrapper = document.createElement('div');
    new_champ_wrapper.classList.add('character-wrapper');

    new_div.appendChild(new_champ_wrapper);
    new_hex.appendChild(new_div);

}

function removeChamp(x){
        x.style.backgroundImage = "none";
        x.classList.remove('filled-hex');
        x.classList.add('hex');
        const cont = x.querySelector('.champ-item-container .character-wrapper');
        cont.removeChild(cont.querySelector('img'));
        x.removeEventListener('click', removeChampBoard);
}

function onClickClear(){
    let hexes = document.querySelectorAll('.filled-hex');
    for(let i=0; i<hexes.length; i++)       removeChamp(hexes[i]);
    counter=0;
}

/*
Funzione di aggiunta alla board dei campioni
*/ 
function addChampBoard(event){
    if(counter===28) return;
    const champ = event.target;
    const champ_board = document.createElement('img');

    const hex= document.querySelector('#four-row .hex');
    hex.classList.remove('hex');
    hex.classList.add('filled-hex');
    hex.style.backgroundImage = "url("+champ.src+")";
    hex.addEventListener('dblclick', removeChampBoard);


    const cont = hex.querySelector('.champ-item-container .character-wrapper');
    champ_board.src = champ.src;
    champ_board.classList.add('character-icon');

    champ_board.addEventListener("dragstart", (event) => {dragged = event.target;   drag_start_container=hex;   event.target.classList.add("dragging");});
    champ_board.addEventListener("dragend", (event) => {event.target.classList.remove("dragging");});
    cont.appendChild(champ_board);
    counter++;
}

/*  funzione che gestisce il passaggio da un esagono ad un altro  */
function swapBoard(ch, start, end){
    removeChamp(start);
    drag_end_container.classList.remove('hex');
    drag_end_container.classList.add('filled-hex');
    const champ_board = document.createElement('img');
    champ_board.classList.add('character-icon');

    champ_board.src = ch.src;
    drag_end_container.style.backgroundImage = "url("+ch.src+")";
    drag_end_container.addEventListener('dblclick', removeChampBoard);

    const cont = drag_end_container.querySelector('.champ-item-container .character-wrapper');
    cont.appendChild(champ_board);

    champ_board.addEventListener("dragstart", (event) => {dragged = event.target;   drag_start_container=champ_board.parentNode.parentNode.parentNode;   event.target.classList.add("dragging");});
    champ_board.addEventListener("dragend", (event) => {event.target.classList.remove("dragging");});
}

/*
Funzione di rimozione dalla board dei campioni singola
*/ 
function removeChampBoard(event){
    const champ = event.currentTarget;
    removeChamp(champ);
}

/*
Funzione di aggiunta alla lista degli item
*/ 
function addItemBoard(event){
    const item = event.target;
    const item_board = document.createElement('img');
    item_board.src= item.src;

}

function createContainer(path, root, f){
        const new_img = document.createElement('img');
        new_img.src = path;
        new_img.classList.add('character-icon');

        const new_div = document.createElement('div');
        new_div.classList.add('champ-item-container');
        
        if(f===0)             new_img.addEventListener('click', addChampBoard);
        else if(f===1)        new_img.addEventListener('click', addItemBoard);

        const new_champ_wrapper = document.createElement('div');
        new_champ_wrapper.classList.add('character-wrapper');
        
        new_champ_wrapper.appendChild(new_img);
        new_div.appendChild(new_champ_wrapper);
        root.appendChild(new_div);
}
/*
Creazione degli elementi img che contengono i campioni e loro indicizzazione,
assegnazione delle classi e assegnazione al container

Creazione di onSuccess e onFail
*/
function loadChamp(item){
    const root= document.querySelector('#champions-container .characters-list-wrapper');
    createContainer(item, root, 0); 
}

function loadItem(item){
    const root= document.querySelector('#item-container .characters-list-wrapper');
    createContainer(item, root, 1);
}

function onJson(json){
    if(!json)   {   console.log("Nessun testo");    return;}
    const parsed = JSON.parse(json);
    const dataset = parsed.data;
    const entries = Object.entries(dataset);
    const batchSize = 100;
    let startIndex = 0;
    if(x===0)
    {
        while (startIndex < entries.length) 
        {
            const endIndex = Math.min(startIndex + batchSize, entries.length);
            const batch = entries.slice(startIndex, endIndex);
            for (const [key, value] of batch) {
                const path = "/14.7.1/img/tft-champion/" + value.image.full;
                loadChamp(path);
            }
            startIndex += batchSize;     
        }
        x++;
    }
    else
    {
        while (startIndex < entries.length) 
        {
            const endIndex = Math.min(startIndex + batchSize, entries.length);
            const batch = entries.slice(startIndex, endIndex);
            for (const [key, value] of batch) {
                const path = "/14.7.1/img/tft-item/" + value.image.full;
                loadItem(path);
            }        
            startIndex += batchSize;     
        }
    }
}

function onSuccess(response){
    console.log(response.status);
    if(!response.ok)
    {
        console.log('Risposta non valida');
        return null;
    }
    else    {return response.text();}
}

function onFail(error){
    console.log("Error: " + error);
}

const champions_images_promise = fetch('/js/tft-champion.json');
champions_images_promise.then(onSuccess, onFail).then(onJson);

const clear_btn = document.querySelector('#clear');
clear_btn.addEventListener('click', onClickClear);

const items_images_promise = fetch('/js/tft-item.json');
items_images_promise.then(onSuccess, onFail).then(onJson);


/*
Il codice seguente gestisce la parte delle REST API del sito che dovrà espletare la parte di ricerca delle informazioni dei giocatori
*/

function onPuuid(json){
    console.log("puuid");
    puuid = json.puuid;
    console.log(JSON.parse(json));
}

function search(event){
    event.preventDefault(); //per evitare che il submit del form ricarichi la pagina
    const cors_proxy = "https://corsproxy.io/?";
    const options = {
        method: "POST",
        headers: {
            accept: "application/json",
        }
    }

    
    const player = document.querySelector('#player-search-bar');
    const riot_id = player.value.split('#');    //separo il gamename dal gametag
    const riot_name = encodeURIComponent(riot_id[0]);
    const riot_tag = encodeURIComponent(riot_id[1]);
    //chiave che successivamente dovrà essere rimossa per motivi di sicurezza e gestita lato server
    const key = "RGAPI-025bb69d-1c68-40b4-b63e-ec8398e3414f";
    const rest_url = "https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/"+riot_name+"/"+riot_tag+"?api_key="+key;
    console.log(rest_url);
    // la fetch ritorna un errore non gestibile con javascript poichè richiede l'utilizzo di un proxy server, probabilmente è un cosa voluta dal web server di cui 
    //sto cercando di usare l'api
    fetch(cors_proxy + rest_url, options).then(onSuccess, onFail).then(onPuuid);
    //quindi pongo una costante che contiene il puuid del giocatore
}

const puuid;

const form1 = document.querySelector('#player');
form1.addEventListener('submit', search);


function onSpotifyJson(json) {
    const libreria = document.querySelector('#album-view');
    libreria.innerHTML = '';
    const risultati = json.albums.items;
    let num_res = risultati.length;
    if(num_res > 10)
      num_res = 10;
    for(let i=0; i<num_res; i++)
    {
        const album = document.createElement('div');
        album.classList.add('album');
        
        const img = document.createElement('img');
        const album_data = risultati[i]
        const titolo = album_data.name;
        const selected_image = album_data.images[0].url;
      
        img.src = selected_image;
        const caption = document.createElement('span');
        caption.textContent = titolo;
        
        album.appendChild(img);
        album.appendChild(caption);
        libreria.appendChild(album);
    }
  }
  
  function onResponse(response) {
    return response.json();
  }
  
  function searchSpotify(event)
  {
    // Impedisci il submit del form
    event.preventDefault();
    const album_input = document.querySelector('#album-bar');
    const album_value = encodeURIComponent(album_input.value);
    console.log('Eseguo ricerca: ' + album_value);
    fetch("https://api.spotify.com/v1/search?type=album&q=" + album_value,
      {
        headers:
        {
          'Authorization': 'Bearer ' + token
        }
      }
    ).then(onResponse).then(onSpotifyJson);
  }
  
  function onTokenJson(json)
  {
    // Imposta il token global
    token = json.access_token;
  }
  
  function onTokenResponse(response)
  {
    return response.json();
  }
  
  // OAuth credentials
  const client_id = 'e65e6ad422be43f1a709ad4710ffcca5';
  const client_secret = 'ef487a4698394ab18af2e66419a47603';
  // Variabile token
  let token;
  // Richiedo il token
  fetch("https://accounts.spotify.com/api/token",
      {
     method: "post",
     body: 'grant_type=client_credentials',
     headers:
     {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
     }
    }
  ).then(onTokenResponse).then(onTokenJson);
const form2 = document.querySelector('#id-album');
form2.addEventListener('submit', searchSpotify);
