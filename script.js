let arrayDeMarcasUno;
let arrayDeMarcasDos;
let regexp = /\d\d.\d\d.\d\d.\d\d\d\s...\s\d\d.\d\d.\d\d.\d\d\d/g;
let FirstOutPut = document.getElementById('output');
let SecondOutPut = document.getElementById("secOutPut");
let ThirdOutPut = document.getElementById('thirdOutPut');
let ForthOutPut = document.getElementById("forthOutPut");

function readAndWrite(a, b, c,fichero) {
  let fr = new FileReader();

  fr.onload = function () {
    a.textContent = fr.result;

    c = fr.result.match(regexp);
    let textoPre = c.join("\n\n");

    b.textContent = textoPre;
  }

  fr.readAsBinaryString(fichero.files[0]);

}
document.getElementById('inputfile')
  .addEventListener('change', function () {
    readAndWrite(FirstOutPut,SecondOutPut,arrayDeMarcasUno,this);
  });


document.getElementById('secFile')
  .addEventListener('change', function () {
    readAndWrite(ThirdOutPut,ForthOutPut,arrayDeMarcasDos,this);
  });
