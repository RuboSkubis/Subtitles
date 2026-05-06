const regExpInicio = /\d{2}:\d{2}:\d{2},\d{3}./;
const regExpFinal = /.\d{2}:\d{2}:\d{2},\d{3}/;

let firstOutPut = document.getElementById('output');
let secondOutPut = document.getElementById("secOutPut");
let thirdOutPut = document.getElementById('thirdOutPut');

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

//Objeto que modela el subtítulo SRT
function Subtitle(inicio, final, contenido) {
  this.inicio = inicio;
  this.final = final;
  this.contenido = contenido;
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
//Parámetros: contenido del fichero en variable string y array vacío donde se meterán "objetos subtitulo SRT" (objeto Subtitle)
//Funcionamiento: Devuelve un array de objetos "Subtitle" basándose en los subtítulos presentes en el fichero SRT
function parseSRT(stringFichero) {
  let arrayStringFichero = stringFichero.split("\n");
  let subtitles = [];

  for (let i = 1; i < arrayStringFichero.length;) {
    let inicio = arrayStringFichero[i].match(regExpInicio)[0].trim();
    let final = arrayStringFichero[i].match(regExpFinal)[0].trim();
    let contenido = arrayStringFichero[i + 1];

    if (arrayStringFichero[i + 2] == "") {
      subtitles.push(new Subtitle(inicio, final, contenido));
      i += 4;
    }
    else {
      contenido += " " + arrayStringFichero[i + 2];
      subtitles.push(new Subtitle(inicio, final, contenido));
      i += 5;
    }

  }
  return subtitles;

}
//Parámetros: elemento HTML donde imprimir contenido para comparaciones y array de objetos "Subtitle"
//Funcionamiento: (se presupone outPut = etiqueta <pre>)imprime en output lo que se imprimiría en el fichero SRT basándose
//en un array de objetos "Subtitle"
function write(outPut, subtitles) {

  outPut.textContent = "";
  for (let i = 0; i < subtitles.length; i++) {

    outPut.textContent += (i + 1) + "\n" + subtitles[i].inicio + " --> " + subtitles[i].final + "\n" + subtitles[i].contenido + "\n\n";

  }


}
//Parámetros: dos arrays de objetos Subtitulos para fusionar
//Funcionamiento: devuelve un array de objetos subtítulo resultado de fusionar los arrays de entrada
function merge(subtitlesA, subtitlesB) {
  let funMode = Array.from(document.getElementsByClassName("modeButton")).find(item => item.checked == true).value;
  let subtitlesC = [];

  if (funMode == "upPriority") {
    for (let i = 0; i < subtitlesA.length; i++) {
      let inicio = subtitlesA[i].inicio;
      let final = subtitlesA[i].final;
      let contenido = subtitlesA[i].contenido + "\n" + subtitlesB[i].contenido;

      subtitlesC.push(new Subtitle(inicio, final, contenido));
    }
  }
  else if (funMode == "downPriority") {
    for (let i = 0; i < subtitlesA.length; i++) {
      let inicio = subtitlesB[i].inicio;
      let final = subtitlesB[i].final;
      let contenido = subtitlesA[i].contenido + "\n" + subtitlesB[i].contenido;

      subtitlesC.push(new Subtitle(inicio, final, contenido));
    }
  }
  else if (funMode == "maxTime") {
    for (let i = 0; i < subtitlesA.length; i++) {
      let timeStampADate = toDate(subtitlesA[i].inicio);
      let timeStampBDate = toDate(subtitlesB[i].inicio);
      let inicio = timeStampADate < timeStampBDate ? subtitlesA[i].inicio : subtitlesB[i].inicio;

      timeStampADate = toDate(subtitlesA[i].final);
      timeStampBDate = toDate(subtitlesB[i].final);
      let final = timeStampADate < timeStampBDate ? subtitlesB[i].final : subtitlesA[i].final;

      let contenido = subtitlesA[i].contenido + "\n" + subtitlesB[i].contenido;

      subtitlesC.push(new Subtitle(inicio, final, contenido));
    }
  }
  else {
    for (let i = 0; i < subtitlesA.length; i++) {
      let timeStampADate = toDate(subtitlesA[i].inicio);
      let timeStampBDate = toDate(subtitlesB[i].inicio);
      let inicio = timeStampADate < timeStampBDate ? subtitlesB[i].inicio : subtitlesA[i].inicio;

      timeStampADate = toDate(subtitlesA[i].final);
      timeStampBDate = toDate(subtitlesB[i].final);
      let final = timeStampADate < timeStampBDate ? subtitlesA[i].final : subtitlesB[i].final;

      let contenido = subtitlesA[i].contenido + "\n" + subtitlesB[i].contenido;

      subtitlesC.push(new Subtitle(inicio, final, contenido));
    }
  }

  return subtitlesC;

}
//Parámetro:timeStamp en formato "00:00:00,000" de inicio o final de un objeto Subtitle
//Funcionamiento: devuelve un objeto Date creado a partir de un timeStamp
function toDate(timeStamp) {
  return new Date(Date.parse("2012-01-01T" + timeStamp.replace(",", ".")));
}
//Parámtros: un string con contenido de un fichero SRT, y el nombre del fichero deseado
//Funcionamiento: habilita enlace de descarga para descargar fichero SRT
function download(data, filename) {

  let enlaceDeDescarga = document.getElementById("descarga");
  enlaceDeDescarga.download = filename;
  enlaceDeDescarga.hidden = false;

  let blob = new Blob([data], { type: 'text/plain' });
  enlaceDeDescarga.href = URL.createObjectURL(blob);

  enlaceDeDescarga.addEventListener("click", function () {
    URL.revokeObjectURL(this.href);
  })


}
//Parámetros: array de objetos Subtitle
//Funcionamiento: devuelve un array de Subtitles como un único String en formato SRT
function unParseSRT(subtitles) {
  let unParsedSRT = "";
  for (let i = 0; i < subtitles.length; i++) {

    unParsedSRT += (i + 1) + "\n" + subtitles[i].inicio + " --> " + subtitles[i].final + "\n" + subtitles[i].contenido + "\n\n";

  }
  return unParsedSRT;
}
// Parámetros:array de objetos Subtitle
//Funcionamiento:añade persistencia al array de subtitulos que se pasa por parámetro.
function addPersistence(subtitles) {
  let persistenceTime = Number(document.getElementById("persistenceSeconds").value) * 1000;

  for (let i = 0; i < subtitles.length - 1; i++) {
    let timeStampFinalDate = toDate(subtitles[i].final);
    let timeStampInicioDate = toDate(subtitles[i + 1].inicio);

    if (timeStampInicioDate - timeStampFinalDate > persistenceTime) {
      timeStampFinalDate.setSeconds(timeStampFinalDate.getSeconds() + (persistenceTime / 1000));

      let stringHours = timeStampFinalDate.getHours().toString().length == 2 ? "" + timeStampFinalDate.getHours() : "0" + timeStampFinalDate.getHours();
      let stringMinutes = timeStampFinalDate.getMinutes().toString().length == 2 ? "" + timeStampFinalDate.getMinutes() : "0" + timeStampFinalDate.getMinutes();
      let stringSeconds = timeStampFinalDate.getSeconds().toString().length == 2 ? "" + timeStampFinalDate.getSeconds() : "0" + timeStampFinalDate.getSeconds();
      let stringMilliseconds = timeStampFinalDate.getMilliseconds().toString().length == 3 ?
        "" + timeStampFinalDate.getMilliseconds() : timeStampFinalDate.getMilliseconds().toString().length == 2 ?
          "0" + timeStampFinalDate.getMilliseconds() : "00" + timeStampFinalDate.getMilliseconds();

      subtitles[i].final = stringHours + ":" + stringMinutes + ":" + stringSeconds + "," + stringMilliseconds;

    }
    else {
      timeStampFinalDate.setMilliseconds(timeStampInicioDate.getMilliseconds() - 20);

      let stringHours = timeStampFinalDate.getHours().toString().length == 2 ? "" + timeStampFinalDate.getHours() : "0" + timeStampFinalDate.getHours();
      let stringMinutes = timeStampFinalDate.getMinutes().toString().length == 2 ? "" + timeStampFinalDate.getMinutes() : "0" + timeStampFinalDate.getMinutes();
      let stringSeconds = timeStampFinalDate.getSeconds().toString().length == 2 ? "" + timeStampFinalDate.getSeconds() : "0" + timeStampFinalDate.getSeconds();
      let stringMilliseconds = timeStampFinalDate.getMilliseconds().toString().length == 3 ?
        "" + timeStampFinalDate.getMilliseconds() : timeStampFinalDate.getMilliseconds().toString().length == 2 ?
          "0" + timeStampFinalDate.getMilliseconds() : "00" + timeStampFinalDate.getMilliseconds();

      subtitles[i].final = stringHours + ":" + stringMinutes + ":" + stringSeconds + "," + stringMilliseconds;
    }
  }
}

function altMerge(subtitlesA, subtitlesB) {
  let subtitlesC = [];

  for (let i = 0, j = 0; i < subtitlesA.length && j < subtitlesB.length;) {
    let subtitleAuxEarly = toDate(subtitlesA[i].inicio) > toDate(subtitlesB[j].inicio) ? subtitlesB[j] : subtitlesA[i];
    let subtitleAuxLate = toDate(subtitlesA[i].inicio) > toDate(subtitlesB[j].inicio) ? subtitlesA[i] : subtitlesB[j];
    //OK
    if (subtitleAuxEarly.inicio == subtitleAuxLate.inicio && subtitleAuxEarly.final == subtitleAuxLate.final) {
      subtitlesC.push(new Subtitle(subtitleAuxEarly.inicio, subtitleAuxEarly.final, subtitleAuxEarly.contenido + "\n" + subtitleAuxLate.contenido));
      i++;
      j++;
    }
    //OK
    else if (subtitleAuxEarly.inicio == subtitleAuxLate.inicio) {
      if (subtitleAuxEarly.final < subtitleAuxLate.final) {
        subtitlesC.push(new Subtitle(subtitleAuxEarly.inicio, subtitleAuxEarly.final, subtitleAuxEarly.contenido + "\n" + subtitleAuxLate.contenido));
        subtitlesC.push(new Subtitle(subtitleAuxEarly.final, subtitleAuxLate.final, "-\n" + subtitleAuxLate.contenido));
      }
      else {
        subtitlesC.push(new Subtitle(subtitleAuxEarly.inicio, subtitleAuxLate.final, subtitleAuxEarly.contenido + "\n" + subtitleAuxLate.contenido));
        subtitlesC.push(new Subtitle(subtitleAuxLate.final, subtitleAuxEarly.final, subtitleAuxEarly + "\n-"));
      }
      i++;
      j++;


    }

    else if (subtitleAuxEarly.final < subtitleAuxLate.inicio) {
      
      if (subtitleAuxEarly == subtitlesA[i]) {

        subtitlesC.push(new Subtitle(subtitleAuxEarly.inicio, subtitleAuxEarly.final, subtitleAuxEarly.contenido + "\n-"));
        i++;
      }
      else if (subtitleAuxEarly == subtitlesB[j]) {

        subtitlesC.push(new Subtitle(subtitleAuxEarly.inicio, subtitleAuxEarly.final, "-\n" + subtitleAuxEarly.contenido));
        j++;
      }



    }
    else {

      if (subtitleAuxEarly == subtitlesA[i]) {
        subtitlesC.push(new Subtitle(subtitleAuxEarly.inicio, subtitleAuxLate.inicio, subtitleAuxEarly.contenido + "\n-"));
        
        if (subtitleAuxLate.final < subtitleAuxEarly.final) {
          subtitlesC.push(new Subtitle(subtitleAuxLate.inicio, subtitleAuxLate.final, subtitleAuxEarly.contenido + "\n" + subtitleAuxLate.contenido));
        }
        else {
          subtitlesC.push(new Subtitle(subtitleAuxLate.inicio, subtitleAuxEarly.final, subtitleAuxEarly.contenido + "\n" + subtitleAuxLate.contenido));
        }
        subtitlesC.push(new Subtitle(subtitleAuxLate.final, subtitleAuxEarly.final, subtitleAuxEarly.contenido + "\n-"));
      }

      else if(subtitleAuxEarly ==subtitlesB[j]) {
        subtitlesC.push(new Subtitle(subtitleAuxEarly.inicio, subtitleAuxLate.inicio, "-\n" + subtitleAuxEarly.contenido));
         
        if (subtitleAuxLate.final < subtitleAuxEarly.final) {
          subtitlesC.push(new Subtitle(subtitleAuxLate.inicio, subtitleAuxLate.final, subtitleAuxLate.contenido + "\n" + subtitleAuxEarly.contenido));
        }
        else {
          subtitlesC.push(new Subtitle(subtitleAuxLate.inicio, subtitleAuxEarly.final, subtitleAuxLate.contenido + "\n" + subtitleAuxEarly.contenido));
        }
        subtitlesC.push(new Subtitle(subtitleAuxLate.final, subtitleAuxEarly.final, "-\n" + subtitleAuxEarly.contenido));
      }
      i++;
      j++;
    }
  }
  return subtitlesC;
}
document.getElementById('inputfile')
  .addEventListener('change', function () {
    let promesaDefichero = read(this);

    promesaDefichero.then(
      function (result) {
        subtitlesA = parseSRT(result);
        write(firstOutPut, subtitlesA);
        for (let i = 0; i < subtitlesA.length; i++) {

          if (i > 0) {
            if (toDate(subtitlesA[i].inicio).getSeconds() == toDate(subtitlesA[i - 1].inicio).getSeconds() && toDate(subtitlesA[i].inicio).getMinutes() == toDate(subtitlesA[i - 1].inicio).getMinutes()) {
              console.log("Encontramos segundos repetidos en la posicion:" + i);
            }
          }
        }

      }
    );
  });

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

document.getElementById("mergeButton")
  .addEventListener('click', function () {
    if (subtitlesA.length != 0 && subtitlesB.length != 0) {

      // subtitlesC = merge(subtitlesA, subtitlesB);

      // if (document.getElementById("persistenceCheckBox").checked) {
      //   addPersistence(subtitlesC);
      // }

      subtitlesC = altMerge(subtitlesA, subtitlesB);

      write(thirdOutPut, subtitlesC);
      download(unParseSRT(subtitlesC), "resultado.srt");


    }
    else {
      alert("Tienes que meter dos ficheros.");
    }

  });

document.getElementById("persistenceCheckBox")
  .addEventListener("change", function () {
    if (this.checked) {
      document.getElementById("persistenceSeconds").disabled = false;
    }
    else {
      document.getElementById("persistenceSeconds").disabled = true;

    }

  })










