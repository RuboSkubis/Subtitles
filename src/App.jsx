import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import heroImg from './assets/hero.png';
import { read, toMiliSeconds, toTimeStamp, parseSRT, unParseMergedSRT, write, eventMerge, download, addPersistence, optSubtitles, isContinuous } from './srtActions_New';
import './App.css';

// export default function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           type="button"
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>

//       <div className="ticks"></div>

//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>

//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }


export default function App() {

  const [subtitlesA, setSubtitlesA] = useState([]);
  const [textA, setTextA] = useState("");
  const [codA, setCodA] = useState("utf-8");
  const [colorA, setColorA] = useState("#ffffff");

  const [subtitlesB, setSubtitlesB] = useState([]);
  const [textB, setTextB] = useState("");
  const [codB, setCodB] = useState("utf-8");
  const [colorB, setColorB] = useState("#ffffff");

  const [textC, setTextC] = useState("");

  const [optModeOff, setoptModeOff] = useState(true);
  const [mode, setMode] = useState("prioridadSuperior");
  const [persistenceTime, setPersistenceTime] = useState(0);



  function handleCodAChange(e) {
    setCodA(e.target.value);
  }

  function handleSubtitlesAChange(subtitles) {

    setSubtitlesA(subtitles);
    setTextA(write(subtitles));
  }

  function handleCodBChange(e) {
    setCodB(e.target.value);
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

  return (

    <div id="container">
      <div id="inputContainer">
        <SRTInput idioma="A" codificacion={codA} color={colorA} handleSubtitlesChange={handleSubtitlesAChange} onCodChange={handleCodAChange} handleColorChange={handleColorAChange} />
        <SRTInput idioma="B" codificacion={codB} color={colorB} handleSubtitlesChange={handleSubtitlesBChange} onCodChange={handleCodBChange} handleColorChange={handleColorBChange} />
        <OptimizationSettings isOff={optModeOff} mode={mode} persistenceTime={persistenceTime} handleModeChange={handleModeChange} handleOptActivation={handleOptActivation} handlePersistenceTimeChange={handlePersistenceTimeChange} />
        <MergeButton subtitlesA={subtitlesA} subtitlesB={subtitlesB} colorA={colorA} colorB={colorB} optModeOff={optModeOff} mode={mode} persistenceTime={persistenceTime} handleTextChange={handleTextCChange} />

      </div>
      <Output content={textA} />
      <Output content={textB} />
      <Output content={textC} />


    </div>


  );
}


function SRTInput({ idioma, codificacion, color, handleSubtitlesChange, onCodChange, handleColorChange }) {

  function handleChange(e) {
    if (e.target.files[0].name.includes(".srt")) {

      let promesaDefichero = read(e.target);
      promesaDefichero.then(
        function (result) {
          try {
            let decoder = new TextDecoder(codificacion, { fatal: true });
            let uint8Array = new Uint8Array(result);
            let str = decoder.decode(result);
            let subtitles = parseSRT(str);

            if (subtitles == null) {
              alert("El fichero SRT no tiene internamente estructura de subtítulos SRT.");
            }
            else {

              handleSubtitlesChange(subtitles);
            }
          }
          catch (error) {
            let posicion = idioma == "A" ? "superior" : "inferior";

            alert("La codificación utilizada para el idioma " + posicion + " no es la correcta. Pruebe otra.");
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


      <label>Codificación del idioma {idioma == "A" ? "superior" : "inferior"}:
        <select name="codificacionA" defaultValue={codificacion} onChange={onCodChange}>
          <option value="utf-8">UTF-8</option>
          <option value="windows-1252">Windows 1252</option>
          <option value="iso-8859-1">ISO 8859-1</option>
        </select>
      </label>

      <label>Color idioma {idioma == "A" ? "superior" : "inferior"}:
        <input type="color" value={color} onChange={handleColorChange}></input>
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


      console.log(optModeOff);
      if (!optModeOff) {
        console.log("Pase por aqui");
        subtitlesC = optSubtitles(subtitlesC, mode);
        addPersistence(subtitlesC, persistenceTime);
      }


      subtitlesC.forEach((item) => {
        item.addColor(colorA, colorB);
      });


      handleTextChange(write(subtitlesC));
      // let nombreFichero = prompt("Indica el nombre que deseas para el fichero resultado");



      let blob = new Blob([unParseMergedSRT(subtitlesC)], { type: 'text/plain;charset=utf-8' });
      setHref(URL.createObjectURL(blob));

      console.log("¿Hay continuidad en el resultado?: " + isContinuous(subtitlesC));
    }

    else {
      alert("Tienes que meter dos ficheros.");
    }

  }

  function download() {
    URL.revokeObjectURL(href);
  }

  return (
    <>
      <button type="button" id="mergeButton" onClick={merge}>Merge</button>
      <a href={href} download={fileName} onClick={download} style={{ visibility: href ? "" : "hidden" }}>Descarga</a>
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

