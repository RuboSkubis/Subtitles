let regexp = /\d\d.\d\d.\d\d.\d\d\d\s...\s\d\d.\d\d.\d\d.\d\d\d/g;
let regExpInicio = /\d{2}:\d{2}:\d{2},\d{3}./;
let regExpFinal = /.\d{2}:\d{2}:\d{2},\d{3}/;
let regExpContenido = /\s.+\s.*\s\s*/g;

let firstOutPut = document.getElementById('output');
let secondOutPut = document.getElementById("secOutPut");
let thirdOutPut = document.getElementById('thirdOutPut');
let forthOutPut = document.getElementById("forthOutPut");



let subtitlesA = [];
let subtitlesB = [];
let subtitlesC = [];

// function write(a, b, c, d, fichero) {
//   a.textContent = fichero;

//   marcasDeInicio = fichero.match(regExpInicio);
//   let textoPre = marcasDeInicio.map((item) => item.trim()).join("\n\n");
//   b.textContent = textoPre;

//   marcasDeFinal = fichero.match(regExpFinal);
//   textoPre = marcasDeFinal.map((item) => item.trim()).join("\n\n");
//   c.textContent = textoPre;
// }

function Subtitle(inicio, final, contenido) {
  this.inicio = inicio;
  this.final = final;
  this.contenido = contenido;
}

function download(data, filename) {

  let enlaceDeDescarga = document.getElementById("descarga");
  enlaceDeDescarga.download = filename;
  enlaceDeDescarga.hidden = false;

  let blob = new Blob([data], { type: 'text/plain' });
  enlaceDeDescarga.href = URL.createObjectURL(blob);

  enlaceDeDescarga.addEventListener("click",function(){
    URL.revokeObjectURL(this.href);
  })

  
}

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

function write(outPut, subtitles) {

  outPut.textContent = "";
  for (let i = 0; i < subtitles.length; i++) {

    outPut.textContent += (i + 1) + "\n" + subtitles[i].inicio + " --> " + subtitles[i].final + "\n" + subtitles[i].contenido + "\n\n";

  }


}
function unParseSRT(subtitles) {
  let unParsedSRT = "";
  for (let i = 0; i < subtitles.length; i++) {

    unParsedSRT += (i + 1) + "\n" + subtitles[i].inicio + " --> " + subtitles[i].final + "\n" + subtitles[i].contenido + "\n\n";

  }
  return unParsedSRT;
}

function parseSRT(stringFichero, subtitles) {
  let arrayStringFichero = stringFichero.split("\n");

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


}

function toDate(timeStamp) {
  return new Date(Date.parse("2012-01-01T" + timeStamp.replace(",", ".")));
}

function merge() {
  let funMode = Array.from(document.getElementsByClassName("modeButton")).find(item => item.checked == true).value;

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
  if (document.getElementById("persistenceCheckBox").checked) {
    addPersistence(subtitlesC);
  }

  write(thirdOutPut, subtitlesC);

  download(unParseSRT(subtitlesC), "resultado.srt", "text/plain");
  

}

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
      timeStampFinalDate.setMilliseconds(timeStampFinalDate.getMilliseconds() + (timeStampInicioDate - timeStampFinalDate - 1));

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
document.getElementById('inputfile')
  .addEventListener('change', function () {
    let promesaDefichero = read(this);

    promesaDefichero.then(
      function (result) {
        parseSRT(result, subtitlesA);
        write(firstOutPut, subtitlesA);

      }
    );
  });

document.getElementById('secFile')
  .addEventListener('change', function () {
    let promesaDefichero = read(this);

    promesaDefichero.then(
      function (result) {
        parseSRT(result, subtitlesB);
        write(secondOutPut, subtitlesB);

      }
    );
  });

document.getElementById("mergeButton")
  .addEventListener('click', function () {
    if (subtitlesA.length != 0 && subtitlesB.length != 0) {
      merge();
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










