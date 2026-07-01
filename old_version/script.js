import Subtitle from './Subtitle.js';
import Evento from './Evento.js';
import MergedSubtitle from './MergedSubtitle.js';
import {
  read, toMiliSeconds, toTimeStamp, parseSRT, unParseMergedSRT, write, eventMerge, download, addPersistence,
  optSubtitles, isContinuous
} from './srtActions.js';

import { detect, detectAll } from './jschardet.esm.min.js';


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
document.getElementById('inputFile')
  .addEventListener('change', function () {

    if (this.files[0].name.includes(".srt")) {

      let promesaDefichero = read(this);
      promesaDefichero.then(
        function (result) {
          try {

            let uint8Array = new Uint8Array(result);

            let string = "";
            for (var i = 0; i < uint8Array.length; ++i) {
              string += String.fromCharCode(uint8Array[i]);
            }

            let detectedEncoding = detect(string).encoding;


            let decoder = new TextDecoder(detectedEncoding, { fatal: true });
            let str = decoder.decode(result);


            subtitlesA = parseSRT(str);

            if (subtitlesA == null) {
              alert("El fichero SRT no tiene internamente estructura de subtítulos SRT.")
            }
            else {
              write(firstOutPut, subtitlesA);
            }
          }
          catch (error) {

            alert("La codificación " + detectedEncoding + " no es soportada.");
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
          try {

            let uint8Array = new Uint8Array(result);

            let string = "";
            for (var i = 0; i < uint8Array.length; ++i) {
              string += String.fromCharCode(uint8Array[i]);
            }

            let detectedEncoding = detect(string).encoding;


            let decoder = new TextDecoder(detectedEncoding, { fatal: true });
            let str = decoder.decode(result);


            subtitlesB = parseSRT(str);

            if (subtitlesB == null) {
              alert("El fichero SRT no tiene internamente estructura de subtítulos SRT.")
            }
            else {
              write(secondOutPut, subtitlesA);
            }
          }
          catch (error) {

            alert("La codificación " + detectedEncoding + " no es soportada.");
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
        let optMode = Array.from(document.getElementsByName("prioridad")).find(item => item.checked == true).value;
        subtitlesC = optSubtitles(subtitlesC, optMode);
        addPersistence(subtitlesC, Number(document.getElementById("persistence").value));
      }


      subtitlesC.forEach((item) => {
        item.addColor(document.getElementById("colorA").value, document.getElementById("colorB").value)
      });

      write(thirdOutPut, subtitlesC);
      // let nombreFichero = prompt("Indica el nombre que deseas para el fichero resultado");
      let nombreFichero = "merged";
      nombreFichero += ".srt";
      download(unParseMergedSRT(subtitlesC), nombreFichero);
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
      document.getElementById("prioridadSuperior").disabled = false;
      document.getElementById("prioridadInferior").disabled = false;
      document.getElementById("prioridadMaximizar").disabled = false;
      document.getElementById("prioridadMinimizar").disabled = false;
    }

    else {
      document.getElementById("persistence").disabled = true;
      document.getElementById("persistence").value = "";
      document.getElementById("prioridadSuperior").disabled = true;
      document.getElementById("prioridadInferior").disabled = true;
      document.getElementById("prioridadMaximizar").disabled = true;
      document.getElementById("prioridadMinimizar").disabled = true;
    }
  });
document.getElementById("persistence")
  .addEventListener("keydown", function (event) {
    event.preventDefault();
  });







































