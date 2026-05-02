let marcasDeInicio;
let marcasDeFinal;
let regexp = /\d\d.\d\d.\d\d.\d\d\d\s...\s\d\d.\d\d.\d\d.\d\d\d/g;
let regExpInicio = /\d{2}:\d{2}:\d{2},\d{3}./g;
let regExpFinal = /.\d{2}:\d{2}:\d{2},\d{3}/g;

let regExpContenido = /\s.+\s.*\s\s*/g;
let FirstOutPut = document.getElementById('output');
let SecondOutPut = document.getElementById("secOutPut");
let ThirdOutPut = document.getElementById('thirdOutPut');
let ForthOutPut = document.getElementById("forthOutPut");

async function read(entrada) {
  

  let promesaDeResultado = new Promise(function (resolve) {
    let fr = new FileReader();


    fr.onload = function () {
      resolve(fr.result);
      
    }

    fr.readAsBinaryString(entrada.files[0]);
  });
  let result = await promesaDeResultado;

  return result;
}
function write(a, b, c, d, resultado) {
  a.textContent = resultado;

  marcasDeInicio = resultado.match(regExpInicio);
  let textoPre = marcasDeInicio.map((item) => item.trim()).join("\n\n");
  b.textContent = textoPre;

  marcasDeFinal = resultado.match(regExpFinal);
  textoPre = marcasDeFinal.map((item) => item.trim()).join("\n\n");
  c.textContent = textoPre;
}
function parseSRT(fichero){
    let arrayDeContenido = fichero.split("\n");
    console.log(arrayDeContenido);
    console.log(arrayDeContenido.filter(item => item != ""));
}
document.getElementById('inputfile')
  .addEventListener('change', function () {
    let promesaDeResultado = read(this);

    promesaDeResultado.then(
      function(result){
        write(FirstOutPut,SecondOutPut,ThirdOutPut,ForthOutPut,result);
        parseSRT(result);
      } 
    );
  });



