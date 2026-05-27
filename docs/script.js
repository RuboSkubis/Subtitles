//Expresiones regulares para extraer timeStamp de inicio y final del string resultado de leer un fichero SRT
const regExpInicio = /\d{2}:\d{2}:\d{2},\d{3}./;
const regExpFinal = /.\d{2}:\d{2}:\d{2},\d{3}/;
//Elementos html <pre> donde se imprimira el resultado de leer, respectivamente, el fichero A, el fichero B, y el fichero C
//(en el caso de firstOutPut, y secondOutPut, el resultado que imprime es simplificadno todos los subtítulos a 1 sola línea)
let firstOutPut = document.getElementById('output');
let secondOutPut = document.getElementById("secOutPut");
let thirdOutPut = document.getElementById('thirdOutPut');


//subtitlesA será el idioma superior y subtitlesB el inferior
//subtitlesC es el array objetivo donde estará la fusión
let subtitlesA = [];
let subtitlesB = [];
let subtitlesC = [];



/*//Objeto que modela el subtítulo SRT: la marca es su timeStamp en milisegundos, y el contenido es un string separando cada 
// idioma con un salto de línea*/
function Subtitle(inicio, final, contenido) {
  this.inicio = inicio;
  this.final = final;
  this.contenido = contenido;
}
//Objeto que modela un evento: la marca es su timeStamp (que sera de inicio o final segun el evento sea de inicio o final)
//el idioma será un String con la letra "A"o "B", segun sea el idioma de arriba o abajo; el tipo sera un string con valor "inicio" o "final"
//para distinguir los dos tipos de eventos; el texto será el contenido asociado a un evento de inicio y en caso de ser un evento final valdrá undefined
function Evento(marca, idioma, tipo, texto = undefined) {
  this.marca = marca;
  this.idioma = idioma;
  this.tipo = tipo;
  this.texto = texto;

}
//Parámetro: <input type="file">
//Funcionamiento: Devuelve una promesa cuyo resultado es el contenido del fichero srt en una variable string
async function read(entrada) {
  let promesaDefichero = new Promise(function (resolve) {
    let fr = new FileReader();

    fr.onload = function () {
      resolve(fr.result);
    }

    fr.readAsBinaryString(entrada.files[0]);
  });

  return await promesaDefichero;
}
//Parámetro: cadena en formato XX:XX:XX,XXX (timestamp)
//Funcionamiento: devuelve la cantidad de milisegundos correspondiente al timestamp
function toMiliSeconds(timeStamp) {
  let ms = Number(timeStamp.match(/\d{3}/)[0]);
  let hours = Number(timeStamp.match(/\d{2}/g)[0]);
  let minutes = Number(timeStamp.match(/\d{2}/g)[1]);
  let seconds = Number(timeStamp.match(/\d{2}/g)[2]);

  return ms + (seconds * 1000) + (minutes * 60 * 1000) + (hours * 60 * 60 * 1000);
}
//Parámetro: entero que representa una cantidad de milisegundos
//Funcionamiento: devuelve cadena en formato XX:XX:XX,XXX (timestamp) correspondiente a dichos milisegundos
function toTimeStamp(ms) {

  let hora = Math.floor(ms / (60 * 60 * 1000));
  ms = ms % (60 * 60 * 1000);

  let minuto = Math.floor(ms / (60 * 1000));
  ms = ms % (60 * 1000);

  let segundo = Math.floor(ms / 1000);
  ms = ms % 1000;

  let timeStamp = "";

  if (hora < 10) {
    timeStamp += "0" + hora + ":";
  }
  else {
    timeStamp += hora + ":";
  }
  if (minuto < 10) {
    timeStamp += "0" + minuto + ":"
  }
  else {
    timeStamp += minuto + ":";
  }
  if (segundo < 10) {
    timeStamp += "0" + segundo + ",";
  }
  else {
    timeStamp += segundo + ","
  }
  if (ms < 10) {
    timeStamp += "00" + ms;
  }
  else if (ms < 100) {
    timeStamp += "0" + ms;
  }
  else {
    timeStamp += ms;
  }
  return timeStamp;
}
//Parámetros: contenido del fichero en variable string y array vacío donde se meterán "objetos subtitulo SRT" (objeto Subtitle)
//Funcionamiento: Devuelve un array de objetos "Subtitle" basándose en los subtítulos presentes en el fichero SRT
function parseSRT(stringFichero) {

  let arrayStringFichero = stringFichero.trim().split("\n").map(item => item.trim());
  let subtitles = [];
  let inicio, final, contenido;
  let subtitulosDetectados = 0;

  for (let i = 0; i < arrayStringFichero.length;) {
    //Esto detecta el número de cada subtitulo
    if (i == 0 ||
      (arrayStringFichero[i - 1] == "" &&
        Number(arrayStringFichero[i]) != NaN &&
        Number(arrayStringFichero[i]) > 0) &&
      arrayStringFichero[i + 1].match(regExpInicio)) {


      subtitulosDetectados++;
      i++;
    }
    //Esto detecta los espacios en blanco entre subtitulos para crear un subtitulo cada vez que se encuentra uno
    //Es robusto frente a subtítulos vacíos (en principio NUNCA te vas a encontrar subtitulos vacios en un SRT, pues no tiene sentido)
    else if (arrayStringFichero[i] == "") {
      if (Number(arrayStringFichero[i + 1]) != NaN && Number(arrayStringFichero[i + 1]) > 0) {
        subtitles.push(new Subtitle(inicio, final, contenido));
        inicio = undefined;
        final = undefined;
        contenido = undefined;
      }

      i++;
    }
    //Esto detecta las marcas de tiempo del subtitulo
    else if (arrayStringFichero[i].match(regExpInicio)) {
      inicio = toMiliSeconds(arrayStringFichero[i].match(regExpInicio)[0].trim());
      final = toMiliSeconds(arrayStringFichero[i].match(regExpFinal)[0].trim());
      i++;
    }
    //Esto detecta todo lo que sea contenido (incluso si el contenido es vacío: más adelante con el filter se quitan todos los subtitulos vaciós
    //si es que los hubiera)
    else {
      if (contenido == undefined) {
        contenido = arrayStringFichero[i].trim();
      }
      else {
        contenido += " " + arrayStringFichero[i].trim();
      }
      if (i == (arrayStringFichero.length - 1)) {
        subtitles.push(new Subtitle(inicio, final, contenido));
      }
      i++;
    }

  }


  console.log("Subtitulos detectados:" + subtitulosDetectados);
  console.log("Cantidad de subtitulos reales:" + subtitles.length);

  if (subtitulosDetectados == subtitles.length) {
    console.log("Estructura SRT correcta.");
    //Esto es para quitar subtítulos que no tengan contenido (esto en principio no va a suceder NUNCA)
    subtitles = subtitles.filter(item => item.contenido != undefined);

    return subtitles;

  }
  else {
    console.log("Estructura SRT incorrecta");
    return null;
  }



}
//Parámetros: array de objetos Subtitle
//Funcionamiento: devuelve un único String en formato SRT según los subtitúlos de entrada para ser copiado en un fichero de texto
function unParseSRT(subtitles) {
  let unParsedSRT = "";
  for (let i = 0; i < subtitles.length; i++) {

    unParsedSRT += (i + 1) + "\n" + toTimeStamp(subtitles[i].inicio) + " --> " + toTimeStamp(subtitles[i].final) + "\n" + subtitles[i].contenido + "\n\n";

  }
  return unParsedSRT;
}
//Parámetros: elemento HTML donde imprimir contenido para comparaciones visuales en la ventana y array de objetos "Subtitle"
//Funcionamiento: (se presupone outPut = etiqueta <pre>)imprime en output lo que se imprimiría en el fichero SRT basándose
//en un array de objetos "Subtitle"
function write(outPut, subtitles) {

  outPut.textContent = "";
  for (let i = 0; i < subtitles.length; i++) {

    outPut.textContent += (i + 1) + "\n" + toTimeStamp(subtitles[i].inicio) + " --> " + toTimeStamp(subtitles[i].final) + "\n" + subtitles[i].contenido + "\n\n";

  }


}
//Parámetros: dos arrays de objetos Subtitulos para fusionar
//Funcionamiento: devuelve un array de objetos subtítulo resultado de fusionar los arrays de entrada
//utilizando la estrategia de eventos:en el resultado habrán subtítulos "espúreos" de corta duración en los que solo 
//hay presente un idioma aun habiendo 1 o más subtítulos correspondientes en el otro idioma
function eventMerge(subtitlesA, subtitlesB) {
  let subtitlesC = [];
  let eventos = [];
  let activeA = ["-"];
  let activeB = ["-"];

  for (let i = 0; i < subtitlesA.length; i++) {
    let eventoInicio = new Evento(subtitlesA[i].inicio, "A", "inicio", subtitlesA[i].contenido);
    eventos.push(eventoInicio);
    let eventoFinal = new Evento(subtitlesA[i].final, "A", "final", subtitlesA[i].contenido);
    eventos.push(eventoFinal);
  }
  for (let i = 0; i < subtitlesB.length; i++) {
    let eventoInicio = new Evento(subtitlesB[i].inicio, "B", "inicio", subtitlesB[i].contenido);
    eventos.push(eventoInicio);
    let eventoFinal = new Evento(subtitlesB[i].final, "B", "final", subtitlesB[i].contenido);
    eventos.push(eventoFinal);
  }

  eventos.sort(function (a, b) { return a.marca - b.marca; });

  let prevTime = eventos[0].marca;

  for (event of eventos) {

    if (prevTime != event.marca) {
      if (!(activeA[0] == "-" && activeB[0] == "-")) {
        subtitlesC.push(new Subtitle(prevTime, event.marca, activeA.join(" ") + "\n" + activeB.join(" ")));
      }

    }

    if (event.tipo == "inicio") {
      if (event.idioma == "A") {
        if (activeA[0] == "-") {
          activeA[0] = event.texto;
        }
        else {
          activeA.push(event.texto);
        }
      }

      else {
        if (activeB[0] == "-") {
          activeB[0] = event.texto;
        }
        else {
          activeB.push(event.texto);
        }
      }
    }

    else {
      if (event.idioma == "A") {

        activeA = activeA.filter(function (item) {
          return item != event.texto;
        });

        if (activeA.length == 0) {
          activeA.push("-");
        }
      }
      else {
        activeB = activeB.filter(function (item) {
          return item != event.texto;
        });

        if (activeB.length == 0) {
          activeB.push("-");
        }
      }
    }

    prevTime = event.marca;
  }

  return subtitlesC;
}
function addColor(subtitles) {
  let colorA = document.getElementById("colorA").value;
  let colorB = document.getElementById("colorB").value;

  if (colorA != "#ffffff") {

    let contenidoA = "";
    for (let i = 0; i < subtitles.length; i++) {
      contenidoA = subtitles[i].contenido.split("\n")[0];

      contenidoA = "<font color ='" + colorA + "'>" + contenidoA + "</font>";
      subtitles[i].contenido = contenidoA + "\n" + subtitles[i].contenido.split("\n")[1];
    }
  }
  if (colorB != "#ffffff") {

    let contenidoB = "";
    for (let i = 0; i < subtitles.length; i++) {
      contenidoB = subtitles[i].contenido.split("\n")[1];

      contenidoB = "<font color ='" + colorB + "'>" + contenidoB + "</font>";
      subtitles[i].contenido = subtitles[i].contenido.split("\n")[0] + "\n" + contenidoB;
    }
  }
}
//Parámtros: un string con contenido de un fichero SRT, y el nombre del fichero deseado
//Funcionamiento: habilita enlace de descarga para descargar fichero SRT
function download(data, filename) {

  let enlaceDeDescarga = document.getElementById("descarga");
  enlaceDeDescarga.download = filename;
  enlaceDeDescarga.hidden = false;

  let blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
  enlaceDeDescarga.href = URL.createObjectURL(blob);

  enlaceDeDescarga.addEventListener("click", function () {
    URL.revokeObjectURL(this.href);
  })


}
// Parámetros:array de objetos Subtitle y tiempo de persistencia en sgundos
//Funcionamiento:añade persistencia al array de subtitulos que se pasa por parámetro.
function addPersistence(subtitles, persistenceTime) {

  for (let i = 0; i < subtitles.length - 1; i++) {
    if ((subtitles[i].contenido.includes("-\n") || subtitles[i].contenido.at(-2) == "\n") && !subtitles[i].contenido.match(/-.{1,}-\n/)) {
      continue;
    }
    if (subtitles[i + 1].inicio - subtitles[i].final > persistenceTime) {

      subtitles[i].final += (persistenceTime * 1000);
    }
    else {
      subtitles[i].final += (subtitles[i + 1].inicio - subtitles[i].final - 20);

    }
  }
}
//Parámetros: array de objetos subtitle y tiempo de persistencia (hacia los lados)
//Funcionamiento: similar a la función addPersistence, pero en su lugar añade persistencia al principio y al final de cada subtítulo
//En principio está funcio está solamente para ser utilizada al seleccionar el modo "eliminar subtitulos solitarios", ya que sirve 
//para "recuperar algo de tiempo" de subitulo cuando hemos eliminado los subtítulos "espúreos"
function addDoublePersistance(subtitles, persistenceTime) {

  for (let i = 0; i < subtitles.length - 1; i++) {
    if ((subtitles[i].contenido.includes("-\n") || subtitles[i].contenido.at(-2) == "\n") && !subtitles[i].contenido.match(/-.{1,}-\n/)) {
      continue;
    }
    else {
      if (subtitles[i + 1].inicio - subtitles[i].final > persistenceTime) {
        subtitles[i].final += persistenceTime;
      }

      if (i > 0) {
        if (subtitles[i].inicio - subtitles[i - 1].final > persistenceTime) {
          subtitles[i].inicio = subtitles[i].inicio - persistenceTime;
        }
        else {
          subtitles[i].inicio = subtitles[i - 1].final;
        }
      }

    }
  }

}
//Parámetros: array de objetos subtitle
//Funcionamiento: devuelve un array de objetos subtitle, pero habiendo quitado aquellos subtitulos en los que solo hay un idioma y la duracion es menor a 1 segundo
//Además, añade doble persistencia con "addDoublePersistence" la pérdida de milisegundos de subtítulos al eliminar los subtítulos "espúreos"
function getSpecialSubtitles(subtitles) {

  let ventanaEspureo = document.getElementById("espureo").value != "" ? Number(document.getElementById("espureo").value) : 1000;

  let lonelySubtitles = subtitles.filter(function (item) {

    if (item.contenido.match(/-/)) {
      if (item.contenido.includes("-\n") && (item.final - item.inicio < ventanaEspureo) && !item.contenido.match(/-.{1,}-\n/)) {
        return true;
      }
      else if (item.contenido.at(-2) == "\n" && (item.final - item.inicio < ventanaEspureo)) {
        return true;
      }
      else {
        return false;
      }

    }
    else {
      return false;
    }

  });

  let specialSubtitles = subtitles.filter(function (item) {

    if (item.contenido.match(/-/)) {
      if (item.contenido.includes("-\n") && (item.final - item.inicio < ventanaEspureo) && !item.contenido.match(/-.{1,}-\n/)) {
        return false;
      }
      else if (item.contenido.at(-2) == "\n" && (item.final - item.inicio < ventanaEspureo)) {
        return false;
      }
      else {
        return true;
      }

    }
    else {
      return true;
    }

  });

  let lonelyNecesarySubtitles = specialSubtitles.filter(function (item) {


    if (item.contenido.match(/-/)) {
      if (item.contenido.includes("-\n") && !item.contenido.match(/-.{1,}-\n/)) {
        return true;
      }
      else if (item.contenido.at(-2) == "\n") {
        return true;
      }
      else {
        return false;
      }

    }
    else {
      return false;
    }

  });

  let media = Math.ceil(lonelySubtitles.reduce((sum, current) => sum + (current.final - current.inicio), 0) / (specialSubtitles.length - lonelyNecesarySubtitles.length));
  console.log("Media de tiempo perdido por subtítulo:" + media);

  media = Math.ceil(media / 2);
  console.log("Media por los lados:" + media);

  let segundosPerdidos = lonelySubtitles.reduce((sum, current) => sum + (current.final - current.inicio), 0) / 1000;
  let segundosAntes = subtitles.reduce((sum, current) => sum + (current.final - current.inicio), 0) / 1000;
  console.log("Porcentaje de tiempo perdido antes de añadir doble persistencia: " + ((segundosPerdidos / segundosAntes) * 100));
  console.log("Segundos perdidos: " + segundosPerdidos);

  addDoublePersistance(specialSubtitles, media);


  let segundosDespues = specialSubtitles.reduce((sum, current) => sum + (current.final - current.inicio), 0) / 1000;
  console.log("Porcentaje de tiempo perdido después de añadir doble persistencia: " + (100 - (segundosDespues / segundosAntes) * 100));
  console.log("Segundos perdidos: " + (segundosAntes - segundosDespues));

  return specialSubtitles;
}
//Funcionamiento: hace que se pueda meter en el primer input file un fichero (idioma A), y después lo imprime en la ventana del navegador para ver 
//el resultado del parseo, dejando cada subtítulo como una sola línea
document.getElementById('inputfile')
  .addEventListener('change', function () {

    if (this.files[0].name.includes(".srt")) {
      let promesaDefichero = read(this);

      promesaDefichero.then(
        function (result) {
          subtitlesA = parseSRT(result);
          if (subtitlesA == null) {
            alert("El fichero SRT no tiene internamente estructura de subtítulos SRT.")
          }
          else {
            write(firstOutPut, subtitlesA);
          }

        }
      );
    }
    else {
      alert("Tienes que introducir un archivo con extensión .srt");
    }

  });
//Funcionamiento: hace que se pueda meter en el segundo input file un fichero (idioma B), y después lo imprime en la ventana del navegador para ver 
//el resultado del parseo, dejando cada subtítulo como una sola línea
document.getElementById('secFile')
  .addEventListener('change', function () {
    if (this.files[0].name.includes(".srt")) {
      let promesaDefichero = read(this);

      promesaDefichero.then(
        function (result) {
          subtitlesB = parseSRT(result);
          if (subtitlesB == null) {
            alert("El fichero SRT no tiene internamente estructura de subtítulos SRT.")
          }
          else {
            write(secondOutPut, subtitlesB);
          }
        }
      );
    }
    else {
      alert("Tienes que introducir un archivo con extensión .srt");
    }
  });
//Funcionamiento: tras introducir dos ficheros en los dos input files (porque de lo contrario no permite hacer nada) fusiona los dos ficheros 
//srt de entrada, generando un array de objetos subtítulo resultado de la fusión; después comprueba si está marcada la opción de "Eliminar subtitulos
// solitarios" para eliminar subtítulos espúreos y, en tal caso, si hay el modo persistencia esta activado y hay un valor de segundos, añade persistencia
// al array de subtítulos resultado de la fusión. Por último escribe el resultado en la ventana para comprobaciones, y habilita un enlace de descarga
// para el fichero de subtítulos resultado de la fusión"
document.getElementById("mergeButton")
  .addEventListener('click', function () {

    if (subtitlesA.length != 0 && subtitlesB.length != 0) {

      subtitlesC = eventMerge(subtitlesA, subtitlesB);

      if (document.getElementById("opti").checked) {

        subtitlesC = getSpecialSubtitles(subtitlesC);
      }
      if (document.getElementById("persistence").value != "") {
        addPersistence(subtitlesC, Number(document.getElementById("persistence").value));

      }
      addColor(subtitlesC);

      write(thirdOutPut, subtitlesC);
      // let nombreFichero = prompt("Indica el nombre que deseas para el fichero resultado");
      let nombreFichero = "resultado";
      nombreFichero += ".srt";
      download(unParseSRT(subtitlesC), nombreFichero);
    }
    else {
      alert("Tienes que meter dos ficheros.");
    }
  });
//Funcionamiento:hace que marcar la opción de "Eliminar subtítulos solitarios" habilite o deshabilite el modo persistencia, ya que 
//el modo persistencia solo tiene sentido en caso de seleccionar la opción "Eliminar subtítulos solitarios"
document.getElementById("opti")
  .addEventListener("change", function () {
    if (this.checked) {

      document.getElementById("persistence").disabled = false;
      document.getElementById("espureo").disabled = false;

    }
    else {
      document.getElementById("persistence").disabled = true;
      document.getElementById("espureo").disabled = true;
      document.getElementById("persistence").value = "";
      document.getElementById("espureo").value = "";

    }
  });




























