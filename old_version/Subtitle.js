/*//Objeto que modela el subtítulo SRT: la marca es su timeStamp en milisegundos, y el contenido es un string separando cada 
// idioma con un salto de línea*/
export default function Subtitle(inicio, final, contenido) {
    this.inicio = inicio;
    this.final = final;
    this.contenido = contenido;
}