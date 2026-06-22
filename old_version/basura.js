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
// Parámetro:timeStamp en formato "00:00:00,000" de inicio o final de un objeto Subtitle
// Funcionamiento: devuelve un objeto Date creado a partir de un timeStamp
// function toDate(timeStamp) {
//   return new Date(Date.parse("2012-01-01T" + timeStamp.replace(",", ".")));
// }
// function oldParseSRT(stringFichero) {


//   let arrayStringFichero = stringFichero.trim().split("\n");
//   for (let i = 0; i < arrayStringFichero.length; i++) {
//     arrayStringFichero[i] = arrayStringFichero[i].trim();
//   }

//   let subtitles = [];
//   for (let i = 1; i < arrayStringFichero.length;) {

//     let inicio = toMiliSeconds(arrayStringFichero[i].match(regExpInicio)[0].trim());
//     let final = toMiliSeconds(arrayStringFichero[i].match(regExpFinal)[0].trim());
//     let contenido = arrayStringFichero[i + 1].trim();

//     if (arrayStringFichero[i + 2] == "" || arrayStringFichero[i + 2] == undefined) {
//       subtitles.push(new Subtitle(inicio, final, contenido));
//       i += 4;


//     }
//     else if (arrayStringFichero[i + 3] == "" || arrayStringFichero[i + 3] == undefined) {
//       contenido += " " + arrayStringFichero[i + 2].trim();
//       subtitles.push(new Subtitle(inicio, final, contenido));
//       i += 5;

//     }
//     else {
//       contenido += " " + arrayStringFichero[i + 2].trim() + " " + arrayStringFichero[i + 3].trim();
//       subtitles.push(new Subtitle(inicio, final, contenido));
//       i += 6;
//     }

//   }

//   return subtitles;
// }

// function eventMerge(subtitlesA, subtitlesB) {
//   let subtitlesC = [];
//   let eventos = [];
//   let activeA = "-";
//   let activeB = "-";

//   for (let i = 0; i < subtitlesA.length; i++) {
//     let eventoInicio = new Evento(subtitlesA[i].inicio, "A", "inicio", subtitlesA[i].contenido);
//     eventos.push(eventoInicio);
//     let eventoFinal = new Evento(subtitlesA[i].final, "A", "final");
//     eventos.push(eventoFinal);
//   }
//   for (let i = 0; i < subtitlesB.length; i++) {
//     let eventoInicio = new Evento(subtitlesB[i].inicio, "B", "inicio", subtitlesB[i].contenido);
//     eventos.push(eventoInicio);
//     let eventoFinal = new Evento(subtitlesB[i].final, "B", "final");
//     eventos.push(eventoFinal);
//   }

//   eventos.sort(function (a, b) { return a.marca - b.marca; });

//   let prevTime = eventos[0].marca;

//   for (event of eventos) {

//     if (prevTime != event.marca) {
//       if (!(activeA == "-" && activeB == "-")) {
//         subtitlesC.push(new Subtitle(prevTime, event.marca, activeA + "\n" + activeB));
//       }

//     }

//     if (event.tipo == "inicio") {
//       if (event.idioma == "A") {
//         activeA = event.texto;
//       }
//       else {
//         activeB = event.texto;
//       }
//     }
//     else {
//       if (event.idioma == "A") {
//         activeA = "-";
//       }
//       else {
//         activeB = "-";
//       }
//     }

//     prevTime = event.marca;
//   }

//   return subtitlesC;
// }


// export async function read(entrada,codificacion) {
//     let promesaDefichero = new Promise(function (resolve) {
//         let fr = new FileReader();

//         fr.onload = function () {
            
//             resolve(fr.result);
//         }

//         fr.readAsText(entrada.files[0],codificacion);
//     });

//     return await promesaDefichero;
// }