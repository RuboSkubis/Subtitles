//Objeto que modela un evento: la marca es su timeStamp (que sera de inicio o final segun el evento sea de inicio o final)
//el idioma será un String con la letra "A"o "B", segun sea el idioma de arriba o abajo; el tipo sera un string con valor "inicio" o "final"
//para distinguir los dos tipos de eventos; el texto será el contenido asociado a un evento de inicio y en caso de ser un evento final valdrá undefined
export default function Evento(marca, idioma, tipo, texto = undefined) {
    this.marca = marca;
    this.idioma = idioma;
    this.tipo = tipo;
    this.texto = texto;
}