import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import {
  read, toMiliSeconds, toTimeStamp, parseSRT, unParseMergedSRT, write, eventMerge, download, addPersistence,
  optSubtitles, isContinuous
} from './srtActions.js';

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
let subtititlesA = [];
let subtitlesB = [];
let subtitlesC = [];
export default function App() {

  const [subtitlesA, setSubtitlesA] = useState([]);
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [textC, setTextC] = useState("");
  return (

    <div id="container">
      <div id="inputContainer">
        <SRTInput name="inputfile" id="inputfile" />
      </div>
      <Output id="output" content={textA} />
      <Output id="secOutPut" content={textB} />
      <Output id="thirdOutPut" content={textC} />
      <Codification id="codA" name="codificacionA"/>
    </div>


  );
}


function SRTInput({ name, id }) {

  function handleChange(event) {
    if (event.target.files[0].name.includes(".srt")) {

      let promesaDefichero = read(event.target);
      promesaDefichero.then(
        function (result) {
          try {
            console.log(document.getElementById("codA"));
            let decoder = new TextDecoder(document.getElementById("codA").value, { fatal: true });
            let uint8Array = new Uint8Array(result);
            let str = decoder.decode(result)
            subtitlesA = parse(SRT);
            
            

            if (subtitlesA == null) {
              alert("El fichero SRT no tiene internamente estructura de subtítulos SRT.")
            }
            else {
              setTextA(str);
            }
          }
          catch (error) {
            alert("La codificación utilizada para el idioma superior no es la correcta. Pruebe otra.");
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
      <input type="file" onChange={handleChange} name={name} id={id}></input>
    </>
  );

}



// function OptimizationCheck() {

//   return (
//     <>
//       <label for="opti">Modo optimizado.<input type="checkbox" id="opti"></input>
//       </label>
//     </>
//   );
// }

// function PriorityRadio() {
//   return (
//     <>
//       <label for="prioridadSuperior"><input type="radio" id="prioridadSuperior" name="prioridad" value="prioridadSuperior" disabled checked></input>Prioridad de los subtítulos superiores</label>
//       <label for="prioridadInferior"><input type="radio" id="prioridadInferior" name="prioridad" value="prioridadInferior" disabled></input>Prioridad de los subtítulos inferiores</label>
//       <label for="prioridadMaximizar"><input type="radio" id="prioridadMaximizar" name="prioridad" value="prioridadMaximizar" disabled></input>Maximizar tiempo</label>
//       <label for="prioridadMinimizar"><input type="radio" id="prioridadMinimizar" name="prioridad" value="prioridadMinimizar" disabled></input>Minimizar tiempo</label>
//     </>
//   )
// }

// function PersistenceInput() {
//   return (
//     <>
//       <label for="persistence" id="persistenceLabel">Persistencia (segundos):<input type="number" id="persistence"
//         disabled min="1"></input>
//       </label>
//     </>
//   );

// }


// function Color() {

//   return (
//     <>
//       <label for="colorA">Color idioma superior:
//         <input type="color" id="colorA" value="#ffffff"></input>
//       </label>


//       <label for="colorB">Color idioma inferior:
//         <input type="color" id="colorB" value="#ffffff"></input> </label>
//     </>
//   );
// }

function Codification(id,name,idioma) {
  return (
    <>
      <label htmlFor={id}>Codificación del idioma {idioma}:
        <select name={name} id={id}>
          <option value="utf-8">UTF-8</option>
          <option value="windows-1252">Windows 1252</option>
          <option value="iso-8859-1">ISO 8859-1</option>
        </select>
      </label>
    </>
  );
}

// function MergeButton() {
//   return (
//     <>
//       <button type="button" id="mergeButton">Merge</button>
//     </>
//   );
// }

// function Download() {
//   return (
//     <>
//       <a href="" id="descarga">Descarga</a>
//     </>
//   );
// }

function Output({ id, content }) {
  return (
    <>
      <pre id={id}>{content}</pre>
    </>
  );
}