    let arrayDeMarcasUno;
    let arrayDeMarcasDos;
    let regexp = /\d\d.\d\d.\d\d.\d\d\d\s...\s\d\d.\d\d.\d\d.\d\d\d/g;
    let FirstOutPut = document.getElementById('output');
    let SecondOutPut = document.getElementById("secOutPut");
    let ThirdOutPut = document.getElementById('thirdOutPut');
    let ForthOutPut = document.getElementById("forthOutPut");

    document.getElementById('inputfile')
      .addEventListener('change', function () {

        let fr = new FileReader();

        fr.onload = function () {
          FirstOutPut.textContent = fr.result;

          arrayDeMarcasUno = fr.result.match(regexp);
          let textoPre = arrayDeMarcasUno.join("\n\n");

          SecondOutPut.textContent=textoPre;
        }

        fr.readAsBinaryString(this.files[0]);
       
      });


    document.getElementById('secFile')
      .addEventListener('change', function () {

        let fr = new FileReader();

        fr.onload = function () {
        ThirdOutPut.textContent = fr.result;

        arrayDeMarcasDos = fr.result.match(regexp);
        let textoPre = arrayDeMarcasDos.join("\n\n");

        ForthOutPut.textContent=textoPre;
        }

        fr.readAsBinaryString(this.files[0]);
      });
