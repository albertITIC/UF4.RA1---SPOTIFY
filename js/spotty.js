import { clientId, clientSecret } from "../env/client.js";

// ----------------------------------  CONSTANTS ---------------------------------- 
const inputBuscar = document.querySelector(".buscar-canco");
const btnBuscar = document.querySelector(".btnBuscar");   
const btnEliminar = document.querySelector(".btnEliminar");
const btnPlaylist = document.querySelector("#btnPlaylist");
const results = document.querySelector(".section1"); // Donde se mostrarán los resultados
const infoArtista = document.querySelector(".section2-de-dins"); // Info artista
const infocanç = document.querySelector(".info-canço"); // Info canciones

let tokenAccess = "";
let offset = 0;
let totalResults = 0;

// Noves variables globals
const URL = "https://accounts.spotify.com/authorize";
const redirectUri = "http://127.0.0.1:5501/playlist.html";
const scopes = "playlist-modify-private user-library-modify playlist-modify-public";

btnPlaylist.addEventListener("click", function () {
  const authUrl =
    URL +
    `?client_id=${clientId}` +
    `&response_type=token` +
    `&redirect_uri=${redirectUri}` +
    `&scope=${scopes}`;
  window.location.assign(authUrl);
});

// ----------------------------------  VALIDACIÓN INPUT ---------------------------------- 
const validarInput = () => {
  const query = inputBuscar.value.trim();
  if (query === "") {
    alert("No s'ha introduït cap element.");
    return false;
  } else if (query.length < 2) {
    alert("Introdueix un valor més gran o igual a 2 caràcters.");
    return false;
  }
  return true;
};

// ----------------------------------  FUNCIÓN PARA BUSCAR CANCIONES ---------------------------------- 
const buscarCanciones = () => {
  if (!validarInput()) return; // Si la validación falla, no se ejecuta la búsqueda

  const query = inputBuscar.value.trim();
  searchSpotifyTracks(query, tokenAccess);
};

// ----------------------------------  FUNCIÓN QUE CONSULTA SPOTIFY ---------------------------------- 
const searchSpotifyTracks = function (query, accessToken) {
  const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=12&offset=${offset}`;

  fetch(searchUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      results.innerHTML = ""; // Limpiar resultados previos
      totalResults += data.tracks.items.length;

      if (!data.tracks.items.length) {
        results.textContent = "No hi han resultats.";
        return;
      }

      renderizaTrack(data.tracks.items);
    })
    .catch((error) => console.error("Error al buscar cançons:", error));
};

// ----------------------------------  RENDERIZAR CANCIONES ---------------------------------- 
const renderizaTrack = function (infTrack) {
  infTrack.forEach((track) => {
    const Objdiv = document.createElement("div");
    Objdiv.className = "track";
    Objdiv.innerHTML = `
      <img src="${track.album.images[0]?.url}" class="imgs" />
      <p><b>${track.name}</b></p>
      <p>Artista: ${track.artists[0].name}</p>
      <p>Album: ${track.album.name}</p>
      <button class="add-song">+ Afegir cançó</button>
    `;

    // Mostrar información del artista al hacer clic en la canción
    Objdiv.addEventListener("click", function () {
      getInfoArtist(track.artists[0].id);
    });

    // Guardar la canción en el localStorage al hacer clic en el botón
    Objdiv.querySelector(".add-song").addEventListener("click", function (e) {
      e.stopPropagation(); // Evita que el clic active la función del artista
      guardarCancionEnLocalStorage(track);
    });

    results.appendChild(Objdiv);
  });
};

// ----------------------------------  GUARDAR CANCIÓN EN LOCALSTORAGE ---------------------------------- 
const guardarCancionEnLocalStorage = (track) => {
  const storedSongs = JSON.parse(localStorage.getItem("songs")) || [];
  
  // Evita duplicados
  if (!storedSongs.some((song) => song.id === track.id)) {
    storedSongs.push({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      image: track.album.images[0]?.url,
    });

    localStorage.setItem("songs", JSON.stringify(storedSongs));
    alert("Cançó afegida al localStorage!");
  } else {
    alert("Aquesta cançó ja està a la playlist.");
  }
};

// ----------------------------------  MOSTRAR INFO ARTISTA ---------------------------------- 
const getInfoArtist = function (idArtist) {
  const url = `https://api.spotify.com/v1/artists/${idArtist}`;
  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenAccess}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      infoArtista.innerHTML = `
        <div class="artist-info">
          <img src="${data.images[0]?.url}" alt="${data.name}" class="imgsInfo" />
          <h2>${data.name}</h2>
          <p>Popularitat: ${data.popularity}</p>
          <p>Gèneres: ${data.genres.join(", ")}</p>
          <p>Seguidors: ${data.followers.total}</p>
        </div>
      `;
    })
    .catch((error) => console.error("Error al obtenir informació de l'artista:", error));
};

// ----------------------------------  EVENTOS ---------------------------------- 
btnBuscar.addEventListener("click", buscarCanciones);
btnEliminar.addEventListener("click", () => {
  results.innerHTML = "Fes una nova búsqueda";
  infoArtista.innerHTML = "Informació artista";
  infocanç.innerHTML = "Informació cançons";
});

// ----------------------------------  OBTENER TOKEN SPOTIFY ---------------------------------- 
const getSpotifyAccessToken = function (clientId, clientSecret) {
  const url = "https://accounts.spotify.com/api/token";
  const credentials = btoa(`${clientId}:${clientSecret}`);
  
  fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })
    .then((response) => response.json())
    .then((data) => {
      tokenAccess = data.access_token;
      btnBuscar.disabled = false;
      btnEliminar.disabled = false;
    })
    .catch((error) => console.error("Error al obtenir el token:", error));
};

getSpotifyAccessToken(clientId, clientSecret);