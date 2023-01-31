/* eslint-disable indent */
// Clase para crear titulos de columnas y filas.
// eslint-disable-next-line no-unused-vars
class titColumFilas {
    constructor(filas, colum, sizeCelda) {
        // Creamos las reglas demarcatorias de las celdas
        // arriba y a la izquierda.
        // Creamos la planilla de calculos
        // alto 30 filas ancho 10 columnas
        this.filas = filas;
        this.colum = colum;
        this.sizeCelda = sizeCelda;
        this.letraCol = '';
        this.planilla = '<div class="primer"></div>';
    }

    // Para crear fragment de document => nodes
    // eslint-disable-next-line class-methods-use-this
    toDOM(planilla) {
        const d = document;
        let i;
        const a = d.createElement('div');
        const b = d.createDocumentFragment();
        a.innerHTML = planilla;
        // eslint-disable-next-line no-cond-assign
        while (i = a.firstChild) b.appendChild(i);
        return b;
    }

    init() {
        // eslint-disable-next-line no-plusplus
        for (let iColum = 0; iColum <= this.colum; iColum++) {
            switch (iColum) {
                case 0:
                    this.letraCol = 'A';
                    break;
                case 1:
                    this.letraCol = 'B';
                    break;
                case 2:
                    this.letraCol = 'C';
                    break;
                case 3:
                    this.letraCol = 'D';
                    break;
                case 4:
                    this.letraCol = 'E';
                    break;
                case 5:
                    this.letraCol = 'F';
                    break;
                case 6:
                    this.letraCol = 'G';
                    break;
                case 7:
                    this.letraCol = 'H';
                    break;
                case 8:
                    this.letraCol = 'I';
                    break;
                case 9:
                    this.letraCol = 'J';
                    break;
                case 10:
                    this.letraCol = 'K';
                    break;

                default:
                    break;
            }
            this.planilla += `<div class="col">${this.letraCol}</div>`;
        }

        const col = this.toDOM(this.planilla);
        document.getElementById('col').appendChild(col);

        this.planilla = '<br>';

        // eslint-disable-next-line spaced-comment
        //this.planilla += '<div style="padding-top: -30px; width: 0px;"></div>';

        // eslint-disable-next-line no-plusplus
        for (let iFilas = 1; iFilas <= this.filas; iFilas++) {
            this.planilla += `<div class="fil">${iFilas}</div>`;
        }

        const fil = this.toDOM(this.planilla);
        document.getElementById('fil').appendChild(fil);
    }
}
