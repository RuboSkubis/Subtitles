import Subtitle from './Subtitle.js';
import Evento from './Evento.js';
import MergedSubtitle from './MergedSubtitle.js';

const regExpInicio = /\d{2}:\d{2}:\d{2},\d{3}./;
const regExpFinal = /.\d{2}:\d{2}:\d{2},\d{3}/;


//Parámetro: <input type="file">
//Funcionamiento: Devuelve una promesa cuyo resultado es el contenido del fichero srt en una variable string
export async function read(entrada, codificacion) {
    let promesaDefichero = new Promise(function (resolve) {
        let fr = new FileReader();

        fr.onload = function () {

            resolve(fr.result);
        }

        fr.readAsArrayBuffer(entrada.files[0]);
    });

    return await promesaDefichero;
}
//Parámetro: cadena en formato XX:XX:XX,XXX (timestamp)
//Funcionamiento: devuelve la cantidad de milisegundos correspondiente al timestamp
export function toMiliSeconds(timeStamp) {
    let ms = Number(timeStamp.match(/\d{3}/)[0]);
    let hours = Number(timeStamp.match(/\d{2}/g)[0]);
    let minutes = Number(timeStamp.match(/\d{2}/g)[1]);
    let seconds = Number(timeStamp.match(/\d{2}/g)[2]);

    return ms + (seconds * 1000) + (minutes * 60 * 1000) + (hours * 60 * 60 * 1000);
}
//Parámetro: entero que representa una cantidad de milisegundos
//Funcionamiento: devuelve cadena en formato XX:XX:XX,XXX (timestamp) correspondiente a dichos milisegundos
export function toTimeStamp(ms) {

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
export function parseSRT(stringFichero) {

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
export function unParseMergedSRT(subtitles) {
    let unParsedSRT = "";
    for (let i = 0; i < subtitles.length; i++) {

        unParsedSRT += (i + 1) + "\n" + toTimeStamp(subtitles[i].inicio) + " --> " + toTimeStamp(subtitles[i].final) + "\n" + subtitles[i].contenidoA + "\n" + subtitles[i].contenidoB + "\n\n";

    }
    return unParsedSRT;
}
//Parámetros: elemento HTML donde imprimir contenido para comparaciones visuales en la ventana y array de objetos "Subtitle"
//Funcionamiento: (se presupone outPut = etiqueta <pre>)imprime en output lo que se imprimiría en el fichero SRT basándose
//en un array de objetos "Subtitle"
export function write(outPut, subtitles) {
    outPut.textContent = "";

    if (subtitles[0] instanceof Subtitle) {
        for (let i = 0; i < subtitles.length; i++) {
            outPut.textContent += (i + 1) + "\n" + toTimeStamp(subtitles[i].inicio) + " --> " + toTimeStamp(subtitles[i].final) + "\n" + subtitles[i].contenido + "\n\n";
        }
    }

    else {
        for (let i = 0; i < subtitles.length; i++) {
            outPut.textContent += (i + 1) + "\n" + toTimeStamp(subtitles[i].inicio) + " --> " + toTimeStamp(subtitles[i].final) + "\n" + subtitles[i].contenidoA + "\n" + subtitles[i].contenidoB + "\n\n";
        }
    }

}
//Parámetros: dos arrays de objetos Subtitulos para fusionar
//Funcionamiento: devuelve un array de objetos subtítulo resultado de fusionar los arrays de entrada
//utilizando la estrategia de eventos:en el resultado habrán subtítulos "espúreos" de corta duración en los que solo 
//hay presente un idioma aun habiendo 1 o más subtítulos correspondientes en el otro idioma
export function eventMerge(subtitlesA, subtitlesB) {
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
                subtitlesC.push(new MergedSubtitle(prevTime, event.marca, activeA.join(" "), activeB.join(" ")));
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
//Parámtros: un string con contenido de un fichero SRT, y el nombre del fichero deseado
//Funcionamiento: habilita enlace de descarga para descargar fichero SRT
export function download(data, filename) {

    let enlaceDeDescarga = document.getElementById("descarga");
    enlaceDeDescarga.download = filename;
    enlaceDeDescarga.style.visibility = "visible";

    let blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
    enlaceDeDescarga.href = URL.createObjectURL(blob);

    enlaceDeDescarga.addEventListener("click", function () {
        URL.revokeObjectURL(this.href);
    })


}
// Parámetros:array de objetos Subtitle y tiempo de persistencia en sgundos
//Funcionamiento:añade persistencia al array de subtitulos que se pasa por parámetro.
export function addPersistence(subtitles, persistenceTime) {

    if (persistenceTime != 0) {
        for (let i = 0; i < subtitles.length - 1; i++) {

            if (subtitles[i + 1].inicio - subtitles[i].final > (persistenceTime * 1000)) {

                subtitles[i].final += (persistenceTime * 1000);
            }
            else if (subtitles[i].final != subtitles[i + 1].inicio) {
                subtitles[i].final += (subtitles[i + 1].inicio - subtitles[i].final - 20);

            }
        }
    }

}
//Parámetros: array de objetos subtitle
//Funcionamiento: devuelve un array de objetos subtitle, pero habiendo quitado aquellos subtitulos en los que solo hay un idioma y la duracion es menor a 1 segundo
//Además, añade doble persistencia con "addDoublePersistence" la pérdida de milisegundos de subtítulos al eliminar los subtítulos "espúreos"
export function optSubtitles(subtitles, optMode) {

    let specialSubtitles = [];

    if (optMode == "prioridadSuperior") {

        for (let i = 0; i < subtitles.length; i++) {
            if (!((subtitles[i].contenidoA == "-" && subtitles[i].contenidoB != "-") || (subtitles[i].contenidoB == "-" && subtitles[i].contenidoA != "-"))) {
                if (i > 0) {
                    if (subtitles[i - 1].contenidoA == subtitles[i].contenidoA && subtitles[i - 1].contenidoB == "-") {
                        if (i > 1) {
                            if (subtitles[i - 2].final != subtitles[i - 1].final) {
                                subtitles[i].inicio = subtitles[i - 1].inicio;
                            }
                        }
                        else {
                            subtitles[i].inicio = subtitles[i - 1].inicio;
                        }
                    }
                }
                if (i < subtitles.length - 1) {
                    if (subtitles[i + 1].contenidoA == subtitles[i].contenidoA && subtitles[i + 1].contenidoB == "-") {
                        subtitles[i].final = subtitles[i + 1].final;
                    }
                }
            }
        }
        //Esto para quitar subtitulos espureos del idioma al que se da priorridad
        specialSubtitles = subtitles.filter(function (item, index, array) {
            if (index > 0 && index < array.length - 1) {
                if ((item.inicio >= array[index - 1].inicio && item.final <= array[index - 1].final) || (item.inicio >= array[index + 1].inicio && item.final <= array[index + 1].final)) {
                    return false;
                }
                else {
                    return true;
                }
            }

            else if (index == 0) {
                if (item.inicio >= array[index + 1].inicio && item.final <= array[index + 1].final) {
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                if (item.inicio >= array[index - 1].inicio && item.final <= array[index - 1].final) {
                    return false;
                }
                else {
                    return true;
                }
            }
        });
        //Esto para quitar los subtitulos espureos que quedan, es decir los del idioma al que no se da prioridad, y manteniendo los subtítulos que 
        //están solamente en un idioma
        specialSubtitles = specialSubtitles.filter(function (item, index, array) {
            if (item.contenidoA == "-" && item.contenidoB != "-") {
                if (index > 0 && index < array.length - 1) {
                    if (item.contenidoB == array[index + 1].contenidoB || item.contenidoB == array[index - 1].contenidoB) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
                else if (index == 0) {
                    if (item.contenidoB == array[index + 1].contenidoB) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
                else {
                    if (item.contenidoB == array[index - 1].contenidoB) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            }
            else {
                return true;
            }
        });
    }

    else if (optMode == "prioridadInferior") {
        for (let i = 0; i < subtitles.length; i++) {

            if (!((subtitles[i].contenidoA == "-" && subtitles[i].contenidoB != "-") || (subtitles[i].contenidoB == "-" && subtitles[i].contenidoA != "-"))) {
                if (i > 0) {
                    if (subtitles[i - 1].contenidoB == subtitles[i].contenidoB && subtitles[i - 1].contenidoA == "-") {
                        if (i > 1) {
                            if (subtitles[i - 2].final != subtitles[i - 1].final) {
                                subtitles[i].inicio = subtitles[i - 1].inicio;
                            }
                        }
                        else {
                            subtitles[i].inicio = subtitles[i - 1].inicio;
                        }
                    }
                }

                if (i < subtitles.length - 1) {
                    if (subtitles[i + 1].contenidoB == subtitles[i].contenidoB && subtitles[i + 1].contenidoA == "-") {
                        subtitles[i].final = subtitles[i + 1].final;
                    }
                }
            }
        }

        //Esto para quitar subtitulos espureos del idioma al que se da priorridad
        specialSubtitles = subtitles.filter(function (item, index, array) {
            if (index > 0 && index < array.length - 1) {
                if ((item.inicio >= array[index - 1].inicio && item.final <= array[index - 1].final) || (item.inicio >= array[index + 1].inicio && item.final <= array[index + 1].final)) {
                    return false;
                }
                else {
                    return true;
                }
            }

            else if (index == 0) {
                if (item.inicio >= array[index + 1].inicio && item.final <= array[index + 1].final) {
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                if (item.inicio >= array[index - 1].inicio && item.final <= array[index - 1].final) {
                    return false;
                }
                else {
                    return true;
                }
            }
        });
        //Esto para quitar los subtitulos espureos que quedan, es decir los del idioma al que no se da prioridad, y manteniendo los subtítulos que 
        //están solamente en un idioma
        specialSubtitles = specialSubtitles.filter(function (item, index, array) {
            if (item.contenidoB == "-" && item.contenidoA != "-") {
                if (index > 0 && index < array.length - 1) {
                    if (item.contenidoA == array[index + 1].contenidoA || item.contenidoA == array[index - 1].contenidoA) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
                else if (index == 0) {
                    if (item.contenidoA == array[index + 1].contenidoA) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
                else {
                    if (item.contenidoA == array[index - 1].contenidoA) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            }
            else {
                return true;
            }
        });
    }

    else if (optMode == "prioridadMaximizar") {
        for (let i = 0; i < subtitles.length; i++) {

            if (!((subtitles[i].contenidoA == "-" && subtitles[i].contenidoB != "-") || (subtitles[i].contenidoB == "-" && subtitles[i].contenidoA != "-"))) {
                if (i > 0) {
                    if ((subtitles[i - 1].contenidoA == subtitles[i].contenidoA && subtitles[i - 1].contenidoB == "-") || (subtitles[i - 1].contenidoB == subtitles[i].contenidoB && subtitles[i - 1].contenidoA == "-")) {
                        if (i > 1) {
                            if (subtitles[i - 2].final != subtitles[i - 1].final) {
                                subtitles[i].inicio = subtitles[i - 1].inicio;
                            }
                        }
                        else {
                            subtitles[i].inicio = subtitles[i - 1].inicio;
                        }
                    }
                }
                if (i < subtitles.length - 1) {
                    if ((subtitles[i + 1].contenidoA == subtitles[i].contenidoA && subtitles[i + 1].contenidoB == "-") || (subtitles[i + 1].contenidoB == subtitles[i].contenidoB && subtitles[i + 1].contenidoA == "-")) {
                        subtitles[i].final = subtitles[i + 1].final;
                    }
                }
            }
        }
        //Esto para quitar subtitulos espureos del idioma al que se da priorridad
        specialSubtitles = subtitles.filter(function (item, index, array) {
            if (index > 0 && index < array.length - 1) {
                if ((item.inicio >= array[index - 1].inicio && item.final <= array[index - 1].final) || (item.inicio >= array[index + 1].inicio && item.final <= array[index + 1].final)) {
                    return false;
                }
                else {
                    return true;
                }
            }

            else if (index == 0) {
                if (item.inicio >= array[index + 1].inicio && item.final <= array[index + 1].final) {
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                if (item.inicio >= array[index - 1].inicio && item.final <= array[index - 1].final) {
                    return false;
                }
                else {
                    return true;
                }
            }
        });
    }

    else {
        for (let i = 0; i < subtitles.length; i++) {

            if (!((subtitles[i].contenidoA == "-" && subtitles[i].contenidoB != "-") || (subtitles[i].contenidoB == "-" && subtitles[i].contenidoA != "-"))) {


                specialSubtitles = subtitles.filter(function (item, index, array) {
                    if ((item.contenidoA == "-" && item.contenidoB != "-")) {
                        if (index > 0 && index < array.length - 1) {
                            if (item.contenidoB == array[index + 1].contenidoB || item.contenidoB == array[index - 1].contenidoB) {
                                return false;
                            }
                            else {
                                return true;
                            }
                        }
                        else if (index == 0) {
                            if (item.contenidoB == array[index + 1].contenidoB) {
                                return false;
                            }
                            else {
                                return true;
                            }
                        }
                        else {
                            if (item.contenidoB == array[index - 1].contenidoB) {
                                return false;
                            }
                            else {
                                return true;
                            }
                        }
                    }
                    else if (item.contenidoB == "-" && item.contenidoA != "-") {
                        if (index > 0 && index < array.length - 1) {
                            if (item.contenidoA == array[index + 1].contenidoA || item.contenidoA == array[index - 1].contenidoA) {
                                return false;
                            }
                            else {
                                return true;
                            }
                        }
                        else if (index == 0) {
                            if (item.contenidoA == array[index + 1].contenidoA) {
                                return false;
                            }
                            else {
                                return true;
                            }
                        }
                        else {
                            if (item.contenidoA == array[index - 1].contenidoA) {
                                return false;
                            }
                            else {
                                return true;
                            }
                        }
                    }
                    else {
                        return true;
                    }
                });
            }
        }
    }



    return specialSubtitles;
}
//Parámetros:array de objetos subtitle
//Funcionamiento: devuelve true o false según haya continuidad temporal en el array del parámetro(esto es para hacer pruebas)
export function isContinuous(subtitles) {

    let esContinuo = true;

    for (let i = 0; i < subtitles.length; i++) {
        if (subtitles[i].inicio > subtitles[i].final) {
            esContinuo = false;
            console.log("Marca de final menor a marca inicial.")
            console.log("Subtitulo " + (i + 1));
            console.log("Contenido:" + subtitles[i].contenido);
            break;
        }

        if ((i != subtitles.length - 1) && subtitles[i].final > subtitles[i + 1].inicio) {
            esContinuo = false;
            console.log("Subtitulo coexitiendo con otro posterior.")
            console.log("Subtitulo " + (i + 1));
            console.log("Contenido:" + subtitles[i].contenido);
            break;
        }

    }
    return esContinuo;

}