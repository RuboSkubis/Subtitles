import { createRoot } from '../node_modules/react-dom/client';

// Borra el contenido HTML existente
document.body.innerHTML = '<div id="app"></div>';

// Renderiza tu componente React en su lugar
const root = createRoot(document.getElementById('app'));
root.render(<h1>¡Hola, mundo!</h1>);F
    
    let arrayDeMarcasUno;
    let arrayDeMarcasDos;
    
    let regexp = /\d\d.\d\d.\d\d.\d\d\d\s...\s\d\d.\d\d.\d\d.\d\d\d/g;
    document.getElementById('inputfile')
      .addEventListener('change', function () {

        let fr = new FileReader();
        fr.onload = function () {
          document.getElementById('output')
            .textContent = fr.result;
            arrayDeMarcasUno = fr.result.match(regexp);
            let textoPre = arrayDeMarcasUno.join("\n\n");
            document.getElementById("secOutPut").textContent=textoPre;
            //console.log(arrayDeMarcasUno);
            

          //console.log(typeof fr.result);
          //console.log(fr.result.length);
        }

        fr.readAsBinaryString(this.files[0]);
        console.log( this.files[0]);
      });


    document.getElementById('secFile')
      .addEventListener('change', function () {

        let fr = new FileReader();
        fr.onload = function () {
          document.getElementById('thirdOutPut')
            .textContent = fr.result;
            arrayDeMarcasDos = fr.result.match(regexp);
             let textoPre = arrayDeMarcasDos.join("\n\n");
            document.getElementById("forthOutPut").textContent=textoPre;
            console.log(arrayDeMarcasDos);

          // console.log(typeof fr.result);
          // console.log(fr.result.length);
        }

        fr.readAsBinaryString(this.files[0]);
      })
