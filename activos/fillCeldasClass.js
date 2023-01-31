/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable space-before-blocks */
/* eslint-disable indent */
/* eslint-disable no-tabs */
// Clase para crear la planilla de calculos
// Llenar de celdas la hoja
// eslint-disable-next-line no-unused-vars
class fillCeldas {
	constructor(filas, colum, sizeCelda) {
		this.filas = filas;
		this.colum = colum;
		this.sizeCelda = sizeCelda;
		this.letraCol = '';
		this.planilla = '';
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
		for (let iFilas = 1; iFilas <= this.filas; iFilas++) {
			// eslint-disable-next-line no-plusplus
			for (let iColum = 0; iColum < this.colum; iColum++) {
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
				this.planilla += `<input type="text" size="${this.sizeCelda}" formula="" class="celElv" name="${this.letraCol}${iFilas}" id="${this.letraCol}${iFilas}">`;
			}
			this.planilla += '<br>';
		}

		const nodo = this.toDOM(this.planilla);
		document.getElementById('cuerpo').appendChild(nodo);
	}
}