export default function MergedSubtitle(inicio, final, contenidoA, contenidoB) {
    this.inicio = inicio;
    this.final = final;
    this.contenidoA = contenidoA;
    this.contenidoB = contenidoB;

    this.addColor = function (colorA, colorB) {
        if (colorA != "#ffffff") {
            
                this.contenidoA = "<font color ='" + colorA + "'>" + this.contenidoA + "</font>";
            
        }

        if (colorB != "#ffffff") {
            
                this.contenidoB = "<font color ='" + colorB + "'>" + this.contenidoB + "</font>";
            
        }
    };

}
