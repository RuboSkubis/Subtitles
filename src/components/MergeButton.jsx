import { useState } from 'react';
import { read, toMiliSeconds, toTimeStamp, parseSRT, unParseSRT, eventMerge, addPersistence, optSubtitles, isContinuous } from '../lib/srtActions.js';
export default function MergeButton({ subtitlesA, subtitlesB, colorA, colorB, optModeOn, mode, persistenceTime, handleTextChange }) {

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