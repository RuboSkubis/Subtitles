//Similar al objeto Subtitle, salvo que el contenido se divide en 2 atributos,contenidoA y contenidoB
//además se añade un método para añadir color a los contenidos
export default function MergedSubtitle(inicio, final, contenidoA, contenidoB) {
    this.inicio = inicio;
    this.final = final;
    this.contenidoA = contenidoA;
    this.contenidoB = contenidoB;
    this.addColor = function (colorA, colorB) {
        if (colorA != "") {   
            this.contenidoA = "<font color ='" + colorA + "'>" + this.contenidoA + "</font>";
        }

        if (colorB != "") {
            this.contenidoB = "<font color ='" + colorB + "'>" + this.contenidoB + "</font>";
        }
    };
}
