import{clientId, clientId} from  "../env/client.js" //tirem dos carpetes enrere

let tokenAccess = ""

// type submit ="..."
const btnBuscar = document.querySelector("button")//no ho fem per id, és fa per etiquetes


/////////////////////////////////// PUNT 2 //////////////////////////////////////
const getSpotifyAccessToken = function (clientId, clientSecret) {  
    //Es crear un header on se li passa les credencials
    const header = {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };
  
    //1r Fetch faig la consulta
    fetch(url, {
      method: "POST",                        // Li podem definir el metodh que vulguem
      headers: header,
      body: "grant_type=client_credentials", // Paràmetres del cos de la sol·licitud
    })
    //1n retorna la resposta (status)
      .then((response) => {
        // Controlar si la petició ha anat bé o hi ha alguna error.
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return response.json(); // Retorna la resposta com JSON
      })
      //2n rebo la informació (tracto la informacio que vui mostrar per pantalla) EX. habilitar els botons
      .then((data) => {
        // Al data retorna el token d'accés que necessitarem
        // Haurem d’habilitar els botons “Buscar” i “Borrar”
        console.log(data.token) //retorna el body = info del json
      })
      .catch((error) => {
        // SI durant el fetch hi ha hagut algun error arribarem aquí.
        console.error("Error a l'obtenir el token:", error);
      });
  };

console.log(clientId, clientSecret);





// 1r THEN
//Controlar estat resposta

// 2n THEN
//Obtenir i tractarla a la meva llogica