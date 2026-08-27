/*//Objeto que modela el subtítulo SRT: el inicio es su timeStamp en milisegundos al igual que el final, y el contenido es un string separando cada 
// idioma con un salto de línea*/
export default function Subtitle(inicio, final, contenido) {
    this.inicio = inicio;
    this.final = final;
    this.contenido = contenido;
}