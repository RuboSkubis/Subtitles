
import { useState } from 'react';
import { read, toMiliSeconds, toTimeStamp, parseSRT, unParseSRT, eventMerge, addPersistence, optSubtitles, isContinuous } from '../lib/srtActions.js';
import { detect } from '../lib/jschardet.esm.min.js';

export default function SRTInput({ idioma, color, handleSubtitlesChange, handleColorChange }) {

  const [colorOn, setColorOn] = useState(false);

  function handleColorActivation() {
    if (colorOn == true) {
      handleColorChange("");
    }
    else {
      handleColorChange("#000000");
    }
    setColorOn(!colorOn);
  }

  function handleFileChange(e) {
    if (e.target.files[0].name.includes(".srt")) {
      let promesaDefichero = read(e.target);
      promesaDefichero.then(
        function (result) {
          try {
            let uint8Array = new Uint8Array(result);
            let string = "";
            for (var i = 0; i < uint8Array.length; ++i) {
              string += String.fromCharCode(uint8Array[i]);
            }
            var detectedEncoding = detect(string).encoding;
            var decoder = new TextDecoder(detectedEncoding, { fatal: true });
          }
          catch (error) {
            console.log(error);
            alert("La codificación del fichero seleccionado " + detectedEncoding + " no es soportada.Es posible que algunos caracteres no se representen correctamente.");
            decoder = new TextDecoder();
          }
          finally {
            let str = decoder.decode(result);
            let subtitles = parseSRT(str);

            if (subtitles == null) {
              alert("El fichero SRT no tiene internamente estructura de subtítulos SRT.");
            }
            else {
              handleSubtitlesChange(subtitles);
            }
          }
        }
      );
    }
    else {
      alert("Tienes que introducir un archivo con extensión .srt");
    }
  }

  return (
    <>
      <label>Idioma {idioma == "A" ? "superior" : "inferior"}:
        <input type="file" onChange={handleFileChange} className='inputFile'></input>
      </label>
      <label>Habilitar selección de color
        <input type="checkbox" value="" onChange={handleColorActivation}></input>
      </label>
      <label style={{ display: colorOn ? "block" : "none" }}>Color idioma {idioma == "A" ? "superior" : "inferior"}:
        <input type="color" value={color} disabled={!colorOn} onChange={handleColorChange}></input>
      </label>
    </>
  );
}