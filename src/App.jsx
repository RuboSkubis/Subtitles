import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import heroImg from './assets/hero.png';
import { read, toMiliSeconds, toTimeStamp, parseSRT, unParseMergedSRT, write, eventMerge, addPersistence, optSubtitles, isContinuous } from './srtActions';
import './App.css';
import { detect } from './jschardet.esm.min.js';

export default function App() {

  const [subtitlesA, setSubtitlesA] = useState([]);
  const [textA, setTextA] = useState("");
  const [colorA, setColorA] = useState("");

  const [subtitlesB, setSubtitlesB] = useState([]);
  const [textB, setTextB] = useState("");
  const [colorB, setColorB] = useState("");

  const [textC, setTextC] = useState("");

  const [optModeOff, setoptModeOff] = useState(true);
  const [mode, setMode] = useState("prioridadSuperior");
  const [persistenceTime, setPersistenceTime] = useState(0);

  const [colorAOn, setColorAOn] = useState(true);
  const [colorBOn, setColorBOn] = useState(true);


  function handleSubtitlesAChange(subtitles) {

    setSubtitlesA(subtitles);
    setTextA(write(subtitles));
  }


  function handleSubtitlesBChange(subtitles) {

    setSubtitlesB(subtitles);
    setTextB(write(subtitles));
  }

  function handleTextCChange(text) {
    setTextC(text);
  }

  function handleColorAChange(e) {
    setColorA(e.target.value);
  }

  function handleColorBChange(e) {
    setColorB(e.target.value);
  }

  function handleOptActivation() {
    setoptModeOff(!optModeOff);
  }

  function handleModeChange(e) {

    setMode(e.target.value);
  }

  function handlePersistenceTimeChange(e) {
    setPersistenceTime(Number(e.target.value));
  }

  function handleColorAActivation() {
    if (colorAOn == false) {
      setColorA("");
    }
    setColorAOn(!colorAOn);
  }

  function handleColorBActivation() {
    if (colorBOn == false) {
      setColorB("");
    }
    setColorBOn(!colorBOn);
  }

  return (

    <div id="container">
      <div id="inputContainer">
        <SRTInput idioma="A" color={colorA} colorOn={colorAOn} handleSubtitlesChange={handleSubtitlesAChange} handleColorChange={handleColorAChange} handleColorActivation={handleColorAActivation} />
        <SRTInput idioma="B" color={colorB} colorOn={colorBOn} handleSubtitlesChange={handleSubtitlesBChange} handleColorChange={handleColorBChange} handleColorActivation={handleColorBActivation} />
        <OptimizationSettings isOff={optModeOff} mode={mode} persistenceTime={persistenceTime} handleModeChange={handleModeChange} handleOptActivation={handleOptActivation} handlePersistenceTimeChange={handlePersistenceTimeChange} />
        <MergeButton subtitlesA={subtitlesA} subtitlesB={subtitlesB} colorA={colorA} colorB={colorB} optModeOff={optModeOff} mode={mode} persistenceTime={persistenceTime} handleTextChange={handleTextCChange} />

      </div>
      <Output content={textA} />
      <Output content={textB} />
      <Output content={textC} />


    </div>


  );
}


function SRTInput({ idioma, color, colorOn, handleSubtitlesChange, handleColorChange, handleColorActivation }) {

  function handleChange(e) {
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
        <input type="file" onChange={handleChange} className='inputFile'></input>
      </label>
      <label>Habilitar selección de color
        <input type="checkbox" value="" onChange={handleColorActivation}></input>
      </label>
      <label style={{ display: colorOn ? "none" : "block" }}>Color idioma {idioma == "A" ? "superior" : "inferior"}:
        <input type="color" value={color} disabled={colorOn} onChange={handleColorChange}></input>
      </label>
    </>
  );

}

function Output({ content }) {
  return (
    <>
      <pre>{content}</pre>
    </>
  );
}

function MergeButton({ subtitlesA, subtitlesB, colorA, colorB, optModeOff, mode, persistenceTime, handleTextChange }) {


  const [fileName, setFileName] = useState("merged.srt");
  const [href, setHref] = useState("");

  function merge() {
    if (subtitlesA.length != 0 && subtitlesB.length != 0) {

      let subtitlesC = eventMerge(subtitlesA, subtitlesB);

      if (!optModeOff) {

        subtitlesC = optSubtitles(subtitlesC, mode);
        addPersistence(subtitlesC, persistenceTime);
      }

      subtitlesC.forEach((item) => {
        item.addColor(colorA, colorB);
      });

      handleTextChange(write(subtitlesC));

      let blob = new Blob([unParseMergedSRT(subtitlesC)], { type: 'text/plain;charset=utf-8' });
      setHref(URL.createObjectURL(blob));

      console.log("¿Hay continuidad en el resultado?: " + isContinuous(subtitlesC));
    }

    else {
      alert("Tienes que meter dos ficheros.");
    }

  }

  return (
    <>
      <button type="button" id="mergeButton" onClick={merge}>Merge</button>
      <a href={href} download={fileName} style={{ visibility: href ? "" : "hidden" }}>Descarga</a>
    </>
  );
}

function OptimizationSettings({ isOff, mode, persistenceTime, handleModeChange, handleOptActivation, handlePersistenceTimeChange }) {


  return (
    <>
      <label>Modo optimizado.
        <input type="checkbox" value="" onChange={handleOptActivation}></input>
      </label>

      <label>
        <input type="radio" name="prioridad" value="prioridadSuperior" disabled={isOff} checked={mode === 'prioridadSuperior'} onChange={handleModeChange}></input>
        Prioridad a los subtítulos superiores
      </label>

      <label>
        <input type="radio" name="prioridad" value="prioridadInferior" disabled={isOff} checked={mode === 'prioridadInferior'} onChange={handleModeChange}></input>
        Prioridad a los subtítulos inferiores
      </label>

      <label>
        <input type="radio" name="prioridad" value="prioridadMaximizar" disabled={isOff} checked={mode === 'prioridadMaximizar'} onChange={handleModeChange}></input>
        Maximizar tiempo
      </label>

      <label>
        <input type="radio" name="prioridad" value="prioridadMinimizar" disabled={isOff} checked={mode === 'prioridadMinimizar'} onChange={handleModeChange}></input>
        Minimizar tiempo
      </label>

      <label id="persistenceLabel">Persistencia (segundos):
        <input type="number" disabled={isOff} min="0" onChange={handlePersistenceTimeChange} onKeyDown={(e) => e.preventDefault()}></input>
      </label>
    </>
  );
}

