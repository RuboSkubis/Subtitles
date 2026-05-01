let marcasDeInicio;
let marcasDeFinal;
let regexp = /\d\d.\d\d.\d\d.\d\d\d\s...\s\d\d.\d\d.\d\d.\d\d\d/g;
let regExpInicio = /\d{2}:\d{2}:\d{2},\d{3}./g;
let regExpFinal = /.\d{2}:\d{2}:\d{2},\d{3}/g;
// let regExpContenido = //g;
let FirstOutPut = document.getElementById('output');
let SecondOutPut = document.getElementById("secOutPut");
let ThirdOutPut = document.getElementById('thirdOutPut');
let ForthOutPut = document.getElementById("forthOutPut");

function readAndWrite(a, b, c, d, marcasDeInicio,marcasDeFinal,fichero) {
  let fr = new FileReader();

  fr.onload = function () {
    a.textContent = fr.result;

    marcasDeInicio = fr.result.match(regExpInicio);
    let textoPre = marcasDeInicio.map((item) => item.trim()).join("");
    b.textContent = textoPre;

    marcasDeFinal = fr.result.match(regExpFinal);
    textoPre = marcasDeFinal.map((item) => item.trim()).join("");
    c.textContent = textoPre;

    
  }

  fr.readAsBinaryString(fichero.files[0]);

}
document.getElementById('inputfile')
  .addEventListener('change', function () {
    readAndWrite(FirstOutPut,SecondOutPut,ThirdOutPut,ForthOutPut,marcasDeInicio,marcasDeFinal,this);
  });



