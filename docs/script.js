import Subtitle from './Subtitle.js';
import Evento from './Evento.js';
import {
  read, toMiliSeconds, toTimeStamp, parseSRT, unParseSRT, write, eventMerge, addColor, download, addPersistence, addDoublePersistance,
  getSpecialSubtitles, isContinuous
} from './srtActions.js';



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
    console.log("¿Hay continuidad en el resultado?: " + isContinuous(subtitlesC));
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




























