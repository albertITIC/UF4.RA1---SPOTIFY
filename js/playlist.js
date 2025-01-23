const accessToken = window.local.href.split("access_token=")[1];

console.log(accessToken)

// funciçó per obtenir ¿?
const getPlayList = function(){

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
