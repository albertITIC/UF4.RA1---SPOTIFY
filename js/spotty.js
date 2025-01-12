import { clientId, clientSecret } from "../env/client.js";

let tokenAccess = "";

// Seleccionar els botons i l'input per etiquetes
const buttons = document.querySelectorAll("button");
const btnBuscar = buttons[0];                                 // Primer botó (Buscar)
const btnEliminar = buttons[1];                               // Segon botó (Borrar)
const inputBuscar = document.querySelector(".buscar-canco");  // Camp de text

// Inicialment deshabilitem els botons
btnBuscar.disabled = true;
btnEliminar.disabled = true;

// Funció per obtenir el token de Spotify
const getSpotifyAccessToken = function (clientId, clientSecret) {
  const url = "https://accounts.spotify.com/api/token"; // Endpoint de Spotify
  const credentials = btoa(`${clientId}:${clientSecret}`); // Codificar credencials

  const header = {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  // Realitzar la sol·licitud POST per obtenir el token
  fetch(url, {
    method: "POST",
    headers: header,
    body: "grant_type=client_credentials", // Paràmetre requerit per l'API
  })
    .then((response) => {
      // Comprovar si la resposta és vàlida
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      return response.json(); // Convertir la resposta a JSON
    })
    .then((data) => {
      // Desar el token d'accés
      tokenAccess = data.access_token;
      console.log("Token de Spotify obtingut:", tokenAccess);

      // Habilitar els botons
      btnBuscar.disabled = false;
      btnEliminar.disabled = false;
    })
    .catch((error) => {
      // Gestió d'errors en la sol·licitud
      console.error("Error al obtenir el token:", error);
    });
};

// Cridar a la funció per obtenir el token en carregar la pàgina
getSpotifyAccessToken(clientId, clientSecret);

// Funció per habilitar o deshabilitar els botons segons el text a l'input
const toggleButtons = () => {
  const hasText = inputBuscar.value.trim().length > 0;
  btnBuscar.disabled = !hasText; // Habilitar "Buscar" si hi ha text
  btnEliminar.disabled = !hasText; // Habilitar "Borrar" si hi ha text
};

// Escoltar canvis al camp de text
inputBuscar.addEventListener("input", toggleButtons);

// Afegir funcionalitat al botó "Borrar"
btnEliminar.addEventListener("click", () => {
  inputBuscar.value = "";       // Buidar el camp de text
  toggleButtons();              // Deshabilitar els botons novament
});

// Informem que ha d'introduir un nom com a paràmetre.
const btnBuscarCanco = document.getElementById("btnBuscar");
btnBuscarCanco.addEventListener("click", validarInput);

function validarInput() {
  const valorInput = inputBuscar.value.trim(); // Eliminem espais al principi i al final

  if (valorInput === "") {
    // Comprovem si l'input està buit
    alert("No s'ha introduït cap element");
  } else if (valorInput.length < 2) {
    // Comprovem si el valor té menys de 2 caràcters
    alert("Introdueix un valor més gran o igual a 2 caràcters.");
  } else {
    // Cas vàlid
    alert("Input vàlid, buscant cançons...");
  }
}

//Funció search
const searchSpotifyTracks = function (query, accessToken) {
  // Definim l'endpoint, la query és el valor de cerca.
  // Limitem la cerca a cançons i retornarà 12 resultats.
  const searchUrl =
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=track&limit=12`;

  // Al headers sempre s'ha de posar la mateixa informació.
  fetch(searchUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      // Comprovar si la resposta és correcta
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      // Netejar els resultats previs
      const section1 = document.querySelector(".section1");
      section1.innerHTML = ''; // Netejar els resultats previs

      const tracks = data.tracks.items;
      
      // Si no hi ha resultats
      if (tracks.length === 0) {
        section1.innerHTML = "<p>No s'han trobat resultats.</p>";
        return;
      }

      // Mostrar els resultats
      tracks.forEach((track) => {
        const trackElement = document.createElement("div");
        trackElement.classList.add("track");

        const trackImage = document.createElement("img");
        trackImage.src = track.album.images[0].url; // Imatge de la cançó
        trackImage.alt = track.name;

        const trackName = document.createElement("p");
        trackName.textContent = `Cançó: ${track.name}`;

        const artistName = document.createElement("p");
        artistName.textContent = `Artista: ${track.artists.map(artist => artist.name).join(", ")}`;

        const trackLink = document.createElement("a");
        trackLink.href = track.external_urls.spotify;
        trackLink.target = "_blank";
        trackLink.textContent = "Escoltar a Spotify";

        // Afegir els elements a la secció
        trackElement.appendChild(trackImage);
        trackElement.appendChild(trackName);
        trackElement.appendChild(artistName);
        trackElement.appendChild(trackLink);

        section1.appendChild(trackElement);
      });
    })
    .catch((error) => {
      console.error("Error al buscar cançons:", error);
    });
};

// Cridar a la funció de cerca quan es fa clic al botó "Buscar"
btnBuscar.addEventListener("click", () => {
  const query = inputBuscar.value.trim();
  if (query !== "") {
    searchSpotifyTracks(query, tokenAccess);
  }
});
