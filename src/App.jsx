import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import heroImg from './assets/hero.png';
import { read, toMiliSeconds, toTimeStamp, parseSRT, unParseSRT, eventMerge, addPersistence, optSubtitles, isContinuous } from './lib/srtActions.js';
import './App.css';
import { detect } from './lib/jschardet.esm.min.js';
import SRTInput from './components/SRTInput.jsx';
import Output from './components/Output.jsx';
import OptimizationSettings from './components/OptimizationSettings.jsx';
import MergeButton from './components/MergeButton.jsx';

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









