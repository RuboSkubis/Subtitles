import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import heroImg from './assets/hero.png';
import { read, toMiliSeconds, toTimeStamp, parseSRT, unParseSRT, eventMerge, addPersistence, optSubtitles, isContinuous } from './srtActions';
import './App.css';
import { detect } from './jschardet.esm.min.js';

export default function App() {
  //Array de objetos subtitle,string del contenido del fichero A
  const [subtitlesA, setSubtitlesA] = useState([]);
  const [textA, setTextA] = useState("");


  //Array de objetos subtitle,string del contenido del fichero B
  const [subtitlesB, setSubtitlesB] = useState([]);
  const [textB, setTextB] = useState("");


  //String con valor hexadecimal del color del subtítulo C, strings con los valores en hexadecimal a aplicar a cada idioma del textoC
  const [textC, setTextC] = useState("");
  const [colorA, setColorA] = useState("");
  const [colorB, setColorB] = useState("");

  //booleano que indica si la opción de optimizar está activada, string con la estrategia de optimización,número entero con la cantidad de persistencia en segundos
  const [optModeOn, setoptModeOn] = useState(false);
  const [mode, setMode] = useState("prioridadSuperior");
  const [persistenceTime, setPersistenceTime] = useState(0);

  function handleSubtitlesAChange(subtitles) {
    setSubtitlesA(subtitles);
    setTextA(unParseSRT(subtitles));
  }

  function handleSubtitlesBChange(subtitles) {
    setSubtitlesB(subtitles);
    setTextB(unParseSRT(subtitles));
  }

  function handleColorAChange(e) {
    if (e == "") {
      setColorA("");
    }
    else if (e == "#000000") {
      setColorA("#000000");
    }
    else {
      setColorA(e.target.value);
    }
  }

  function handleColorBChange(e) {
    if (e == "") {
      setColorB("");
    }
    else if (e == "#000000") {
      setColorB("#000000");
    }
    else {
      setColorB(e.target.value);
    }
  }

  function handleTextCChange(text) {
    setTextC(text);
  }

  function handleOptActivation() {
    setoptModeOn(!optModeOn);
  }

  function handleModeChange(e) {
    setMode(e.target.value);
  }

  function handlePersistenceTimeChange(e) {
    setPersistenceTime(Number(e.target.value));
  }

  return (

    <div id="container">
      <div id="inputContainer">
        <SRTInput idioma="A" color={colorA} handleSubtitlesChange={handleSubtitlesAChange} handleColorChange={handleColorAChange} />
        <SRTInput idioma="B" color={colorB} handleSubtitlesChange={handleSubtitlesBChange} handleColorChange={handleColorBChange} />
        <OptimizationSettings isOn={optModeOn} mode={mode}  handleModeChange={handleModeChange} handleOptActivation={handleOptActivation} handlePersistenceTimeChange={handlePersistenceTimeChange} />
        <MergeButton subtitlesA={subtitlesA} subtitlesB={subtitlesB} colorA={colorA} colorB={colorB} optModeOn={optModeOn} mode={mode} persistenceTime={persistenceTime} handleTextChange={handleTextCChange} />
      </div>
      <Output content={textA} />
      <Output content={textB} />
      <Output content={textC} />
    </div>

  );
}

function SRTInput({ idioma, color, handleSubtitlesChange, handleColorChange }) {

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

function Output({ content }) {
  return (
    <>
      <pre>{content}</pre>
    </>
  );
}

function MergeButton({ subtitlesA, subtitlesB, colorA, colorB, optModeOn, mode, persistenceTime, handleTextChange }) {

  const [fileName, setFileName] = useState("merged.srt");
  const [href, setHref] = useState("");

  function merge() {
    if (subtitlesA.length != 0 && subtitlesB.length != 0) {

      let subtitlesC = eventMerge(subtitlesA, subtitlesB);

      if (optModeOn) {
        subtitlesC = optSubtitles(subtitlesC, mode);
        addPersistence(subtitlesC, persistenceTime);
      }

      subtitlesC.forEach((item) => {
        item.addColor(colorA, colorB);
      });

      handleTextChange(unParseSRT(subtitlesC));

      let blob = new Blob([unParseSRT(subtitlesC)], { type: 'text/plain;charset=utf-8' });
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

function OptimizationSettings({ isOn, mode,  handleModeChange, handleOptActivation, handlePersistenceTimeChange }) {

  return (
    <>
      <label>Modo optimizado.
        <input type="checkbox" value="" onChange={handleOptActivation}></input>
      </label>

      <label>
        <input type="radio" name="prioridad" value="prioridadSuperior" disabled={!isOn} checked={mode === 'prioridadSuperior'} onChange={handleModeChange}></input>
        Prioridad a los subtítulos superiores
      </label>

      <label>
        <input type="radio" name="prioridad" value="prioridadInferior" disabled={!isOn} checked={mode === 'prioridadInferior'} onChange={handleModeChange}></input>
        Prioridad a los subtítulos inferiores
      </label>

      <label>
        <input type="radio" name="prioridad" value="prioridadMaximizar" disabled={!isOn} checked={mode === 'prioridadMaximizar'} onChange={handleModeChange}></input>
        Maximizar tiempo
      </label>

      <label>
        <input type="radio" name="prioridad" value="prioridadMinimizar" disabled={!isOn} checked={mode === 'prioridadMinimizar'} onChange={handleModeChange}></input>
        Minimizar tiempo
      </label>

      <label id="persistenceLabel">Persistencia (segundos):
        <input type="number" disabled={!isOn} min="0" onChange={handlePersistenceTimeChange} onKeyDown={(e) => e.preventDefault()}></input>
      </label>
    </>
  );
}

