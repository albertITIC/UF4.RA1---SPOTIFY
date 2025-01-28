//Botó tornar
const btnTornar  = document.querySelector("#btnTornar");

// (Punt 5)
let token = "";
let user_id = "";

function getToken() {
    token = window.location.href.split("access_token=")[1];
}

btnTornar.addEventListener("click", () => tornar());

//Funcio per tornar a la pàgina inicial
const tornar = function () {
    window.location.assign('index.html');
};

btnPlaylist.addEventListener("click", () => autoritzar());

// const accessToken = window.local.href.split("access_token=")[1];
// console.log(accessToken)

// funciçó per obtenir una plylist (per més endavant)
const getPlayList = async function(){
    const url = `https://api.spotify.com/v1/users/${user_id}/playlists`;
    //La variable user_id l'obtenim de l'endpoint Get Current User's Profile

    const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
}

//retorno les cançons enmagatzemades al meu localstorage
const getIdTracksLocalStorage = function(){
    return localStorage.getItem("trackList");
}

// funcio per seleccionar les cançons del local storage
const getTrackSelected = function (){
    const llistaTracks = getIdTracksLocalStorage();
    getTrack();
}

// Consultar les perfil usuari
const getUser = async function () {
    const url = "https://api.spotify.com/v1/me";
  
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
  
  
      const data = await response.json();
  
  
      if (data) {
        user_id = data.id;
      } else {
        console.log("No hi ha usuari");
      }
    } catch (error) {
      console.error("Error en obtenir l'usuari:", error);
    }
};
  

getToken(); 
getUser().then(function(){
  getPlayList();
});

getTrackSelected();