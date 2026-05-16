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

// function write(a, b, c, d, fichero) {
//   a.textContent = fichero;
//   let regExpInicioTodas = /\d{2}:\d{2}:\d{2},\d{3}./g;
//   let regExpFinalTodas = /.\d{2}:\d{2}:\d{2},\d{3}/g;
//   marcasDeInicio = fichero.match(regExpInicioTodas);
//   let textoPre = marcasDeInicio.map((item) => item.trim()).join("\n\n");
//   b.textContent = textoPre;

//   marcasDeFinal = fichero.match(regExpFinalTodas);
//   textoPre = marcasDeFinal.map((item) => item.trim()).join("\n\n");
//   c.textContent = textoPre;
// }
// function merge(subtitlesA, subtitlesB) {
//   let funMode = Array.from(document.getElementsByClassName("modeButton")).find(item => item.checked == true).value;
//   let subtitlesC = [];

//   if (funMode == "upPriority") {
//     for (let i = 0; i < subtitlesA.length; i++) {
//       let inicio = subtitlesA[i].inicio;
//       let final = subtitlesA[i].final;
//       let contenido = subtitlesA[i].contenido + "\n" + subtitlesB[i].contenido;

//       subtitlesC.push(new Subtitle(inicio, final, contenido));
//     }
//   }
//   else if (funMode == "downPriority") {
//     for (let i = 0; i < subtitlesA.length; i++) {
//       let inicio = subtitlesB[i].inicio;
//       let final = subtitlesB[i].final;
//       let contenido = subtitlesA[i].contenido + "\n" + subtitlesB[i].contenido;

//       subtitlesC.push(new Subtitle(inicio, final, contenido));
//     }
//   }
//   else if (funMode == "maxTime") {
//     for (let i = 0; i < subtitlesA.length; i++) {
//       let timeStampADate = toDate(subtitlesA[i].inicio);
//       let timeStampBDate = toDate(subtitlesB[i].inicio);
//       let inicio = timeStampADate < timeStampBDate ? subtitlesA[i].inicio : subtitlesB[i].inicio;

//       timeStampADate = toDate(subtitlesA[i].final);
//       timeStampBDate = toDate(subtitlesB[i].final);
//       let final = timeStampADate < timeStampBDate ? subtitlesB[i].final : subtitlesA[i].final;

//       let contenido = subtitlesA[i].contenido + "\n" + subtitlesB[i].contenido;

//       subtitlesC.push(new Subtitle(inicio, final, contenido));
//     }
//   }
//   else {
//     for (let i = 0; i < subtitlesA.length; i++) {
//       let timeStampADate = toDate(subtitlesA[i].inicio);
//       let timeStampBDate = toDate(subtitlesB[i].inicio);
//       let inicio = timeStampADate < timeStampBDate ? subtitlesB[i].inicio : subtitlesA[i].inicio;

//       timeStampADate = toDate(subtitlesA[i].final);
//       timeStampBDate = toDate(subtitlesB[i].final);
//       let final = timeStampADate < timeStampBDate ? subtitlesA[i].final : subtitlesB[i].final;

//       let contenido = subtitlesA[i].contenido + "\n" + subtitlesB[i].contenido;

//       subtitlesC.push(new Subtitle(inicio, final, contenido));
//     }
//   }

//   return subtitlesC;

// }

// function altMerge(subtitlesA, subtitlesB) {
//   let subtitlesC = [];

//   for (let i = 0, j = 0; i < subtitlesA.length && j < subtitlesB.length;) {
//     let subtitleEarly = toDate(subtitlesA[i].inicio) > toDate(subtitlesB[j].inicio) ? subtitlesB[j] : subtitlesA[i];
//     let subtitleLate = toDate(subtitlesA[i].inicio) > toDate(subtitlesB[j].inicio) ? subtitlesA[i] : subtitlesB[j];

//     if (toDate(subtitleEarly.final) < toDate(subtitleLate.inicio)) {
//       if (subtitleEarly == subtitlesA[i]) {
//         subtitlesC.push(new Subtitle(subtitleEarly.inicio, subtitleEarly.final, subtitleEarly.contenido + "\n-"));
//         i++;
//       }
//       else {
//         subtitlesC.push(new Subtitle(subtitleEarly.inicio, subtitleEarly.final, "-\n" + subtitleEarly.contenido));
//         j++;
//       }
//     }
//     else {
//       if (subtitleEarly.inicio == subtitleLate.inicio && subtitleEarly.final == subtitleLate.final) {
//         subtitlesC.push(new Subtitle(subtitleEarly.inicio, subtitleEarly.final, subtitleEarly.contenido + "\n" + subtitleLate.contenido));
//         i++;
//         j++;
//       }
//       else if (subtitleEarly.inicio == subtitleLate.inicio) {
//         if (toDate(subtitleEarly.final) < toDate(subtitleLate.final)) {
//           subtitlesC.push(new Subtitle(subtitleEarly.inicio, subtitleEarly.final, subtitleEarly.contenido + "\n" + subtitleLate.contenido));
//           subtitlesC.push(new Subtitle(subtitleEarly.final, subtitleLate.final, "-\n" + subtitleLate.contenido));
//         }
//         else {
//           subtitlesC.push(new Subtitle(subtitleEarly.inicio, subtitleLate.final, subtitleEarly.contenido + "\n" + subtitleLate.contenido));
//           subtitlesC.push(new Subtitle(subtitleLate.final, subtitleEarly.final, subtitleEarly.contenido + "\n-"));
//         }
//         i++;
//         j++;
//       }
//       else if (subtitleEarly.final == subtitleLate.final) {
//         if (subtitleAuxEarly = subtitlesA[i]) {
//           subtitlesC.push(new Subtitle(subtitleEarly.inicio, subtitleLate.inicio, subtitleEarly.contenido + "\n-"));
//           subtitlesC.push(new Subtitle(subtitleLate.inicio, subtitleEarly.final, subtitleEarly.contenido + "\n" + subtitleLate.contenido));

//         }
//         else {
//           subtitlesC.push(new Subtitle(subtitleEarly.inicio, subtitleLate.inicio, "-\n" + subtitleEarly.contenido));
//           subtitlesC.push(new Subtitle(subtitleLate.inicio, subtitleEarly.final, subtitleEarly.contenido + "\n" + subtitleLate.contenido));

//         }
//         i++;
//         j++;
//       }
//       else {

//         if (subtitleEarly == subtitlesA[i]) {
//           subtitlesC.push(new Subtitle(subtitleEarly.inicio, subtitleLate.inicio, subtitleEarly.contenido + "\n-"));

//           if (toDate(subtitleEarly.final) < toDate(subtitleLate.final)) {
//             subtitlesC.push(new Subtitle(subtitleLate.inicio, subtitleEarly.final, subtitleEarly.contenido + "\n" + subtitleLate.contenido));
//             subtitlesC.push(new Subtitle(subtitleEarly.final, subtitleLate.final, "-\n" + subtitleLate.contenido));
//           }
//           else {
//             subtitlesC.push(new Subtitle(subtitleLate.inicio, subtitleLate.final, subtitleEarly.contenido + "\n" + subtitleLate.contenido));
//             subtitlesC.push(new Subtitle(subtitleLate.final, subtitleEarly.final, subtitleEarly.contenido + "\n-"));
//           }

//         }

//         else if (subtitleEarly == subtitlesB[j]) {
//           subtitlesC.push(new Subtitle(subtitleEarly.inicio, subtitleLate.inicio, "-\n" + subtitleEarly.contenido));

//           if (toDate(subtitleEarly.final) < toDate(subtitleLate.final)) {
//             subtitlesC.push(new Subtitle(subtitleLate.inicio, subtitleEarly.final, subtitleLate.contenido + "\n" + subtitleEarly.contenido));
//             subtitlesC.push(new Subtitle(subtitleEarly.final, subtitleLate.final, subtitleLate.contenido + "\n-"));
//           }
//           else {
//             subtitlesC.push(new Subtitle(subtitleLate.inicio, subtitleLate.final, subtitleLate.contenido + "\n" + subtitleEarly.contenido));
//             subtitlesC.push(new Subtitle(subtitleLate.final, subtitleEarly.final, "-\n" + subtitleEarly.contenido));
//           }

//         }
//         i++;
//         j++;
//       }
//     }
//   }
//   return subtitlesC;
// }

// function altMerge2(subtitlesA, subtitlesB) {
//   let subtitlesC = [];

//   for (let i = 0, j = 0; i < subtitlesA.length && j < subtitlesB.length;) {
//     let subtitleAuxEarly = toDate(subtitlesA[i].inicio) > toDate(subtitlesB[j].inicio) ? subtitlesB[j] : subtitlesA[i];
//     let subtitleAuxLate = toDate(subtitlesA[i].inicio) > toDate(subtitlesB[j].inicio) ? subtitlesA[i] : subtitlesB[j];

//     if (subtitleAuxEarly.inicio == subtitleAuxLate.inicio && subtitleAuxEarly.final == subtitleAuxLate.final) {
//       subtitlesC.push(new Subtitle(subtitleAuxEarly.inicio, subtitleAuxEarly.final, subtitleAuxEarly.contenido + "\n" + subtitleAuxLate.contenido));
//       i++;
//       j++;
//     }

//     else if (subtitleAuxEarly.inicio == subtitleAuxLate.inicio) {
//       if (subtitleAuxEarly.final < subtitleAuxLate.final) {
//         subtitlesC.push(new Subtitle(subtitleAuxEarly.inicio, subtitleAuxEarly.final, subtitleAuxEarly.contenido + "\n" + subtitleAuxLate.contenido));
//         subtitlesC.push(new Subtitle(subtitleAuxEarly.final, subtitleAuxLate.final, "-\n" + subtitleAuxLate.contenido));

//       }
//       else {
//         subtitlesC.push(new Subtitle(subtitleAuxEarly.inicio, subtitleAuxLate.final, subtitleAuxEarly.contenido + "\n" + subtitleAuxLate.contenido));
//         subtitlesC.push(new Subtitle(subtitleAuxLate.final, subtitleAuxEarly.final, subtitleAuxEarly.contenido + "\n-"));

//       }
//       i++;
//       j++;


//     }

//     else if (subtitleAuxEarly.final == subtitleAuxLate.final) {
//       if (subtitleAuxEarly = subtitlesA[i]) {
//         subtitlesC.push(new Subtitle(subtitleAuxEarly.inicio, subtitleAuxLate.inicio, subtitleAuxEarly.contenido + "\n-"));
//         subtitlesC.push(new Subtitle(subtitleAuxLate.inicio, subtitleAuxEarly.final, subtitleAuxEarly.contenido + "\n" + subtitleAuxLate.contenido));

//       }
//       else {
//         subtitlesC.push(new Subtitle(subtitleAuxEarly.inicio, subtitleAuxLate.inicio, "-\n" + subtitleAuxEarly.contenido));
//         subtitlesC.push(new Subtitle(subtitleAuxLate.inicio, subtitleAuxEarly.final, subtitleAuxEarly.contenido + "\n" + subtitleAuxLate.contenido));

//       }
//       i++;
//       j++;
//     }

//     else if (subtitleAuxEarly.final < subtitleAuxLate.inicio) {

//       if (subtitleAuxEarly == subtitlesA[i]) {

//         subtitlesC.push(new Subtitle(subtitleAuxEarly.inicio, subtitleAuxEarly.final, subtitleAuxEarly.contenido + "\n-"));
//         i++;
//       }
//       else if (subtitleAuxEarly == subtitlesB[j]) {

//         subtitlesC.push(new Subtitle(subtitleAuxEarly.inicio, subtitleAuxEarly.final, "-\n" + subtitleAuxEarly.contenido));
//         j++;
//       }



//     }
//     else {

//       if (subtitleAuxEarly == subtitlesA[i]) {
//         subtitlesC.push(new Subtitle(subtitleAuxEarly.inicio, subtitleAuxLate.inicio, subtitleAuxEarly.contenido + "\n-"));

//         if (subtitleAuxEarly.final < subtitleAuxLate.final) {
//           subtitlesC.push(new Subtitle(subtitleAuxLate.inicio, subtitleAuxEarly.final, subtitleAuxEarly.contenido + "\n" + subtitleAuxLate.contenido));
//           subtitlesC.push(new Subtitle(subtitleAuxEarly.final, subtitleAuxLate.final, "-\n" + subtitleAuxLate.contenido));
//         }
//         else {
//           subtitlesC.push(new Subtitle(subtitleAuxLate.inicio, subtitleAuxLate.final, subtitleAuxEarly.contenido + "\n" + subtitleAuxLate.contenido));
//           subtitlesC.push(new Subtitle(subtitleAuxLate.final, subtitleAuxEarly.final, subtitleAuxEarly.contenido + "\n-"));
//         }
//         i++;
//         j++;

//       }

//       else if (subtitleAuxEarly == subtitlesB[j]) {
//         subtitlesC.push(new Subtitle(subtitleAuxEarly.inicio, subtitleAuxLate.inicio, "-\n" + subtitleAuxEarly.contenido));

//         if (subtitleAuxEarly.final < subtitleAuxLate.final) {
//           subtitlesC.push(new Subtitle(subtitleAuxLate.inicio, subtitleAuxEarly.final, subtitleAuxLate.contenido + "\n" + subtitleAuxEarly.contenido));
//           subtitlesC.push(new Subtitle(subtitleAuxEarly.final, subtitleAuxLate.final, subtitleAuxLate.contenido + "\n-"));
//           i++;
//           j++;
//         }
//         else {
//           subtitlesC.push(new Subtitle(subtitleAuxLate.inicio, subtitleAuxLate.final, subtitleAuxLate.contenido + "\n" + subtitleAuxEarly.contenido));

//           console.log(i);
//           if (subtitlesA[i + 1] != undefined && (toDate(subtitlesA[i + 1].inicio) < toDate(subtitleAuxEarly.final))) {
//             subtitlesC.push(new Subtitle(subtitleAuxLate.final, subtitlesA[i + 1].inicio, "\n-" + subtitleAuxEarly.contenido));
//             if (toDate(subtitlesA[i + 1].final) > toDate(subtitleAuxEarly.final)) {
//               subtitlesC.push(new Subtitle(subtitlesA[i + 1].inicio, subtitleAuxEarly.final, subtitlesA[i + 1].contenido + "\n" + subtitleAuxEarly.contenido));
//               subtitlesC.push(new Subtitle(subtitleAuxEarly.final, subtitlesA[i + 1].final, subtitlesA[i + 1].contenido + "\n-"));
//             }
//             else {
//               subtitlesC.push(new Subtitle(subtitlesA[i + 1].inicio, subtitlesA[i + 1].final, subtitlesA[i + 1].contenido + "\n" + subtitleAuxEarly.contenido));
//               subtitlesC.push(new Subtitle(subtitlesA[i + 1].final, subtitleAuxEarly.final, subtitleAuxEarly.contenido + "\n-"));
//             }
//             i += 2;
//             j++;
//           }

//           else {
//             subtitlesC.push(new Subtitle(subtitleAuxLate.final, subtitleAuxEarly.final, "-\n" + subtitleAuxEarly.contenido));
//             i++;
//             j++;
//           }

//         }

//       }

//     }
//   }
//   return subtitlesC;
// }
//Parámetro:timeStamp en formato "00:00:00,000" de inicio o final de un objeto Subtitle
//Funcionamiento: devuelve un objeto Date creado a partir de un timeStamp
// function toDate(timeStamp) {
//   return new Date(Date.parse("2012-01-01T" + timeStamp.replace(",", ".")));
// }

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
  let arrayStringFichero = stringFichero.trim().split("\n");
  let subtitles = [];
  for (let i = 1; i < arrayStringFichero.length;) {

    let inicio = toMiliSeconds(arrayStringFichero[i].match(regExpInicio)[0].trim());
    let final = toMiliSeconds(arrayStringFichero[i].match(regExpFinal)[0].trim());
    let contenido = arrayStringFichero[i + 1].trim();

    if (arrayStringFichero[i + 2] == "" || arrayStringFichero[i + 2] == undefined || arrayStringFichero[i + 2] == "\r") {
      subtitles.push(new Subtitle(inicio, final, contenido));
      i += 4;


    }
    else {
      contenido += " " + arrayStringFichero[i + 2].trim();
      subtitles.push(new Subtitle(inicio, final, contenido));
      i += 5;

    }

  }

  return subtitles;

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
  let activeA = "-";
  let activeB = "-";

  for (let i = 0; i < subtitlesA.length; i++) {
    let eventoInicio = new Evento(subtitlesA[i].inicio, "A", "inicio", subtitlesA[i].contenido);
    eventos.push(eventoInicio);
    let eventoFinal = new Evento(subtitlesA[i].final, "A", "final");
    eventos.push(eventoFinal);
  }
  for (let i = 0; i < subtitlesB.length; i++) {
    let eventoInicio = new Evento(subtitlesB[i].inicio, "B", "inicio", subtitlesB[i].contenido);
    eventos.push(eventoInicio);
    let eventoFinal = new Evento(subtitlesB[i].final, "B", "final");
    eventos.push(eventoFinal);
  }

  eventos.sort(function (a, b) { return a.marca - b.marca; });

  let prevTime = eventos[0].marca;

  for (event of eventos) {

    if (prevTime != event.marca) {
      if (!(activeA == "-" && activeB == "-")) {
        subtitlesC.push(new Subtitle(prevTime, event.marca, activeA + "\n" + activeB));
      }

    }

    if (event.tipo == "inicio") {
      if (event.idioma == "A") {
        activeA = event.texto;
      }
      else {
        activeB = event.texto;
      }
    }
    else {
      if (event.idioma == "A") {
        activeA = "-";
      }
      else {
        activeB = "-";
      }
    }

    prevTime = event.marca;
  }
  return subtitlesC;
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
// Parámetros:array de objetos Subtitle
//Funcionamiento:añade persistencia al array de subtitulos que se pasa por parámetro.
function addPersistence(subtitles, persistenceTime) {

  for (let i = 0; i < subtitles.length - 1; i++) {
    if ((subtitles[i].contenido.includes("-\n") || subtitles[i].contenido.at(-2) == "\n") && !subtitles[i].contenido.match(/-.{1,}-\n/)) {
      continue;
    }
    if (subtitles[i + 1].inicio - subtitles[i].final > persistenceTime) {
      subtitles[i].final += persistenceTime;
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

  let lonelySubtitles = subtitles.filter(function (item) {

    if (item.contenido.match(/-/)) {
      if (item.contenido.includes("-\n") && (item.final - item.inicio < 1000) && !item.contenido.match(/-.{1,}-\n/)) {
        return true;
      }
      else if (item.contenido.at(-2) == "\n" && (item.final - item.inicio < 1000)) {
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
      if (item.contenido.includes("-\n") && (item.final - item.inicio < 1000) && !item.contenido.match(/-.{1,}-\n/)) {
        return false;
      }
      else if (item.contenido.at(-2) == "\n" && (item.final - item.inicio < 1000)) {
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
  console.log("Media:" + media);
  media = Math.ceil(media / 2);
  console.log("Media por los lados:" + media);

  addDoublePersistance(specialSubtitles, media);
  return specialSubtitles;
}
//Funcionamiento: hace que se pueda meter en el primer input file un fichero (idioma A), y después lo imprime en la ventana del navegador para ver 
//el resultado del parseo, dejando cada subtítulo como una sola línea
document.getElementById('inputfile')
  .addEventListener('change', function () {
    let promesaDefichero = read(this);

    promesaDefichero.then(
      function (result) {
        subtitlesA = parseSRT(result);
        write(firstOutPut, subtitlesA);
      }
    );
  });
//Funcionamiento: hace que se pueda meter en el segundo input file un fichero (idioma B), y después lo imprime en la ventana del navegador para ver 
//el resultado del parseo, dejando cada subtítulo como una sola línea
document.getElementById('secFile')
  .addEventListener('change', function () {
    let promesaDefichero = read(this);

    promesaDefichero.then(
      function (result) {
        subtitlesB = parseSRT(result);
        write(secondOutPut, subtitlesB);
      }
    );
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
        addPersistence(subtitlesC);
      }

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
      document.getElementById("persistenceLabel").hidden = false;
      document.getElementById("persistence").hidden = false;

    }
    else {
      document.getElementById("persistenceLabel").hidden = true;
      document.getElementById("persistence").hidden = true;
      document.getElementById("persistence").value = "";
    }
  });
  

// document.getElementById("comprobar").addEventListener("click", function () {
//   console.log(document.getElementById("persistence").value);
//   console.log(typeof document.getElementById("persistence").value);
// });












