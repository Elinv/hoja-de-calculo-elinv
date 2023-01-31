/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */
/* eslint-disable default-case */
/* eslint-disable no-restricted-syntax */
/* eslint-disable spaced-comment */
/* eslint-disable no-lonely-if */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable space-before-blocks */
/* eslint-disable indent */
/* eslint-disable no-tabs */
// variable de uso general.
const $id = document.getElementById.bind(document);
// Celda actual donde se desarrolla el calculo
let cAct = '';
// matriz bidimensional para la relación de celdas
const relCeldas = [];
// desactiva las flechas si se esta editando alguna celda
let f2Edit = false;
// variable para copiar la formula
let formCopy = '';

// eslint-disable-next-line func-names
window.onload = function () {
	// asignamos eventos del teclado a cada celda
	const celdas = document.getElementsByClassName('celElv');
	const cCeldas = celdas.length;
	// eslint-disable-next-line no-plusplus
	for (let x = 0; x < cCeldas; x++) {
		// eslint-disable-next-line no-use-before-define
		celdas[x].onkeyup = keyUpAction;
	}
	// event en la casilla de edifición de formula superior
	// eslint-disable-next-line no-use-before-define
	$id('formula').onkeyup = keyUpFormula;
	// cargamos las hojas salvadas en el storage.
	Claves();
};

// determina si es un número o una letra y un número
function isNumeric(val) {
	// valida número decimal.
	return /^\d*\.?\d*$/.test(val);
}

// Si la formula presenta inconsistencia trata de subsanarlas
function reFormat(formula) {
	let formFinal = '';
	for (const c of formula) {
		if (c === '=') {
			formFinal += ` ${c} `;
		} else if (c === '+' || c === '-' || c === '*' || c === '/' || c === '%' || c === '(' || c === ')') {
			formFinal += ` ${c} `;
		} else {
			formFinal += c;
		}
	}
	return formFinal;
}

//ayuda al usuario de esta hoja de calculo.
function ayuda(titulo, error) {
	$id('tit').innerHTML = titulo;
	$id('texto').innerHTML = error;
	$id('alerta').style.display = 'block';
}

// Hacemos los calculos matemáticos
function matematica(arrForm, id) {
	// lo pasamos a array y eliminamos empty elements
	// Separamos las palabras buscadas por espacio
	// Si la letra de la celda es en minúscula funciona igual.
	const pal = arrForm.toUpperCase().split(' ').filter(Boolean);
	$id(id).setAttribute('formula', pal.join(' '));
	// calculamos
	let calc = '';
	// quitar el primer | El signo igual
	pal.shift();
	// recreamos la formula ingresada.
	pal.forEach((elem) => {
		if (elem === '+' || elem === '-' || elem === '*' || elem === '/' || elem === '%' || elem === '(' || elem === ')') {
			calc += elem;
		} else {
			// Hace calculos desde las celdas origenes
			if (isNumeric(elem) === false) {
				calc += parseFloat($id(elem).value);
				// Hace calculos de los datos de la misma celda
			} else {
				calc += parseFloat(elem);
			}
		}
	});
	// asignamos el resultado.
	try {
		// eslint-disable-next-line no-eval
		$id(id).value = eval(calc);
	} catch (error) {
		ayuda('Inconsistencia grave:', error);
	}
}

function pos(letra, signo) {
	const abc = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
	// eslint-disable-next-line no-plusplus
	for (let j = 0; j <= abc.length; j++) {
		if (abc[j].toUpperCase() === letra.toUpperCase()) {
			if (signo === '+') {
				if (abc[j + 1] !== undefined) {
					return abc[j + 1];
					// eslint-disable-next-line no-else-return
				}
				return 'abc[j]';
			}

			if (signo === '-') {
				if (abc[j - 1] !== undefined) {
					return abc[j - 1];
				}
				return 'A';
			}
		}
	}
	return -1;
}

function keyUpFormula(e) {
	try {
		// Solo si no esta vacía la casilla
		if ($id('formula').value !== '') {
			// Actualizamos en vivo la edición
			$id(cAct.id).value = $id('formula').value;
			// si es la tecla Tab
			if (e.key === 'Tab') {
				// Desactivamos las flechas
				f2Edit = true;
				// reformulamos el contenido para la correcta matemática
				// eslint-disable-next-line no-param-reassign
				$id(cAct.id).value = reFormat($id(cAct.id).value);
				const pal = $id(cAct.id).value.split(' ').filter(Boolean);
				if (pal[0] === '=') {
					matematica($id(cAct.id).value, cAct.id);
					setTimeout(() => {
						cAct.focus();
					}, 400);
					// quitamos referencia a la celda resultado de calculo reciente
					cAct = '';
					$id('formula').value = '';
				}
			}

			// si es la tecla Enter
			if (e.key === 'Enter') {
				// activamos las flechas
				f2Edit = false;
				// reformulamos el contenido para la correcta matemática
				// eslint-disable-next-line no-param-reassign
				$id(cAct.id).value = reFormat($id(cAct.id).value);
				const pal = $id(cAct.id).value.split(' ').filter(Boolean);
				if (pal[0] === '=') {
					matematica($id(cAct.id).value, cAct.id);
					cAct.focus();
					// quitamos referencia a la celda resultado de calculo reciente
					cAct = '';
					$id('formula').value = '';
				}
			}
		}
	} catch (error) {
		// console.log(error);
	}
}

//Verificar si es una letra
const esLetra = (caracter) => {
	const ascii = caracter.toUpperCase().charCodeAt(0);
	return ascii > 64 && ascii < 91;
};

// función de cada una de las celdas de la hoja de cálculo
function keyUpAction(e) {
	//console.log(e.key);
	try {
		//Si el modo edición de celdas esta desactivado
		if (f2Edit === false) {
			//Tecla 'Insert' copia la celda
			if (e.key === 'Insert') {
				// de la formula
				formCopy = $id(this.id).getAttribute('formula');
				if (formCopy === '') {
					// o el valor de la celda
					formCopy = $id(this.id).value;
					if (formCopy === '') {
						// informamos que nada se ha copiado.
						ayuda('Nada se ha copiado!', 'Celda vacía.');
					}
				}
			}
			//Tecla 'Delete' pega el contenido copiado
			if (e.key === 'Delete') {
				if (formCopy !== '') {
					$id(this.id).value = formCopy;
				}
			}
			//ArrowUp ArrowDown ArrowRight ArrowLeft
			//Tecla flecha arriba
			if (e.key === 'ArrowUp') {
				let numero = this.id.slice(1);
				const letra = this.id.slice(0, 1);
				//Solo hasta la casilla 1
				if (numero >= 2) {
					numero -= 1;
					$id(`${letra}${numero}`).focus();
				}
			}
			//Tecla flecha abajo
			if (e.key === 'ArrowDown') {
				let numero = parseInt(this.id.slice(1), 10);
				const letra = this.id.slice(0, 1);
				//Solo hasta la última casilla hacia abajo
				numero += 1;
				// controlando la existencia, controlamos el borde abajo
				if ($id(`${letra}${numero}`)) {
					$id(`${letra}${numero}`).focus();
				}
			}
			//Tecla flecha a la izquierda
			if (e.key === 'ArrowLeft') {
				const numero = parseInt(this.id.slice(1), 10);
				let letra = this.id.slice(0, 1);
				//Solo hasta la última casilla hacia abajo
				letra = pos(letra, '-').toUpperCase();
				// controlando la existencia, controlamos el borde izquierdo
				if ($id(`${letra}${numero}`)) {
					$id(`${letra}${numero}`).focus();
				}
			}
			//Tecla flecha a la derecha
			if (e.key === 'ArrowRight') {
				const numero = parseInt(this.id.slice(1), 10);
				let letra = this.id.slice(0, 1);
				//Solo hasta la última casilla hacia abajo
				letra = pos(letra, '+').toUpperCase();
				// controlando la existencia, controlamos el borde izquierdo
				if ($id(`${letra}${numero}`)) {
					$id(`${letra}${numero}`).focus();
				}
			}
		}

		$id('formula').value = $id(this.id).value;
		if (e.key === 'F2') {
			// Desactivamos las flechas
			f2Edit = true;
			// Si el atributo es vacio guardamos el contenido actual en la celda
			// con lo cual en cada celda queda un respaldo de su valor
			// al presionar F2, situación que las hojas de cálculo actuales no preveen.
			if ($id(this.id).getAttribute('formula') === '') {
				$id(this.id).setAttribute('formula', $id(this.id).value);
			} else {
				// rescatamos la formula a la casilla destino
				$id(this.id).value = $id(this.id).getAttribute('formula');
				// mostramos la formula entera arriba
				$id('formula').value = $id(this.id).value;
				// tenemos el id a mano para la edición en la "celda vista de formula"
				cAct = $id(this.id);

				const celResal = $id(this.id).value.toUpperCase().split(/[ |=|+|*|/|%]+/).filter(Boolean);
				console.log(celResal);
				celResal.forEach((elem) => {
					// si contiene una letra
					if (esLetra(elem)) {
						if (!$id(elem).classList.contains('editCeldas')) {
							$id(elem).classList.add('editCeldas');
						}
					}
				});
			}
		}

		if (e.key === '=') {
			// Asignamos celda actual
			cAct = $id(this.id);
			// Agregamos despues un espacio
			$id(this.id).value += ' ';
		}

		if (e.key === 'Tab') {
			// reformulamos el contenido para la correcta matemática
			// eslint-disable-next-line no-param-reassign
			try {
				// evita una falsa alerta de inconsistencia en la formula
				if (cAct !== '') {
					// eslint-disable-next-line eqeqeq
					if ($id(cAct.id).value != '') {
						$id(cAct.id).value = reFormat($id(cAct.id).value);
						const pal = $id(cAct.id).value.split(' ').filter(Boolean);
						if (pal[0] === '=') {
							matematica($id(cAct.id).value, cAct.id);
							// quitamos referencia a la celda resultado de calculo reciente
							cAct = '';
							$id('formula').value = '';
						}
					}
				}
			} catch (error) {
				ayuda('Inconsistencia grave:', error);
			}
		}

		if (e.key === 'Enter') {
			// activamos las flechas
			f2Edit = false;
			// reformulamos el contenido para la correcta matemática
			// eslint-disable-next-line no-param-reassign
			this.value = reFormat(this.value);
			const pal = this.value.split(' ').filter(Boolean);
			if (pal[0] === '=') {
				// enviamos la información a la matriz de relacion de celdas
				const relActual = [cAct, this.value];
				relCeldas.push(relActual);
				// realizamos la matemática
				matematica(this.value, this.id);
				// quitamos referencia a la celda resultado de calculo reciente
				cAct = '';
				$id('formula').value = '';
				// quitamos el resalte de las celdas editadas
				// tomamos la formula desde el atributo
				const valor = $id(this.id).getAttribute('formula');
				// lo reformulamos en este array
				const celResal = valor.toUpperCase().split(/[ |=|+|*|/|%]+/).filter(Boolean);
				// lo recorremos y...
				celResal.forEach((elem) => {
					// si contiene una letra
					if (esLetra(elem)) {
						// quitamos la clase que resalta la celda
						$id(elem).classList.remove('editCeldas');
					}
				});
			} else {
				// Buscar en la matriz por una parcial coincidencia.
				const idDest = this.id.toString();
				// vemos si la celda está contenida en alguna formula ya creada
				relCeldas.forEach((a) => {
					if (a[1].indexOf(idDest)) {
						// de acuerdo con los datos actuales reformulamos
						// el resultado en la casilla destino
						matematica(a[1], a[0].id);
					}
				});
			}
		}
	} catch (error) {
		ayuda('Inconsistencia grave:', error);
	}
}

// captura id del elemento donde se hace click
// eslint-disable-next-line camelcase
function captura_click(e) {
	// eslint-disable-next-line no-console
	if (typeof cAct.value === 'undefined' || cAct.value === '' || cAct.value === null) {
		// console.log(cAct.value);
	} else {
		// capturar el click del raton
		let clickElem;
		if (e == null) {
			// Si hac click un elemento, lo leemos
			clickElem = e.srcElement;
		} else {
			// Si ha hecho click sobre un destino, lo leemos
			clickElem = e.target;
		}
		// id del elemento clickeado
		const res = clickElem.id;
		// si no se hace click en la casilla de edición de la formula
		if (res !== 'formula') {
			if (cAct.id !== res) {
				cAct.value += ` ${res} `;
				cAct.focus();
			}
		}
	}
}

// Capturamos el click y lo pasamos a una funcion
// eslint-disable-next-line camelcase
document.onclick = captura_click;

// Control del tipo de almacenamiento persistente o no.
async function initStoragePersistence() {
	// eslint-disable-next-line no-undef
	const persist = await tryPersistWithoutPromtingUser();
	switch (persist) {
		case 'never':
			console.log('No es posible conservar el almacenamiento');
			break;
		case 'persisted':
			console.log('Almacenamiento persistente con éxito en silencio');
			break;
		case 'prompt':
			console.log('No persiste, pero podemos avisar al usuario cuando queramos.');
			break;
	}
}
initStoragePersistence();

/* Función para control del menu contextual personalizado */
function track(e) {
	const cm = document.getElementById('menuCont');
	cm.style.top = `${e.clientY}px`;
	cm.style.left = `${e.clientX}px`;
	cm.style.display = 'block';
	return false;
}
document.oncontextmenu = track;



// CODIGO PARA GRABAR O RECUPERAR LAS HOJAS DE CALCULO
// devuelve la letra de la columna
let letras = (x) => {
	switch (x) {
		case 0:
			letraCol = 'A';
			break;
		case 1:
			letraCol = 'B';
			break;
		case 2:
			letraCol = 'C';
			break;
		case 3:
			letraCol = 'D';
			break;
		case 4:
			letraCol = 'E';
			break;
		case 5:
			letraCol = 'F';
			break;
		case 6:
			letraCol = 'G';
			break;
		case 7:
			letraCol = 'H';
			break;
		case 8:
			letraCol = 'I';
			break;
		case 9:
			letraCol = 'J';
			break;
		case 10:
			letraCol = 'K';
			break;
		default:
			break;
	}
	return letraCol;
}

// Función para salvar la hoja actual
let letraCol = '';
let celSave = [];
let saveHC = () => {
	let name = nameST();
	if (name !== -1) {
		for (let x = 0; x < celdasFil.colum; x++) {
			// obtenemos la letra de la columna
			letraCol = letras(x);
			for (let y = 1; y <= celdasFil.filas; y++) {
				let sit = letraCol + '' + y;
				let cel = [sit, $id(letraCol + y).value, $id(letraCol + y).getAttribute('formula')];
				celSave.push(cel);
			}
		}
		// Grabamos en localStorage el objeto.
		localStorage.setObj(name, celSave);
	}
	// refrescamos las hojas almacenadas
	Claves();
}

// Cargar la hoja de calculo anterior
let loadHC = () => {
	let nameHC = $id('calcElinv').value;
	let hojaCal = localStorage.getObj(nameHC);
	for (let x = 0; x < hojaCal.length; x++) {
		$id(hojaCal[x][0]).value = hojaCal[x][1];
		$id(hojaCal[x][0]).setAttribute('formula', hojaCal[x][2]);
	}
}

// ver hojas almacenadas
let Claves = () => {
	$id('calcElinv').options.length = 0;
	for (let i = 0; i < localStorage.length; i++) {
		var x = document.getElementById("calcElinv");
		var option = document.createElement("option");
		option.text = localStorage.key(i);
		x.add(option);
	}
}

//solicita nombre destino en localStorage
let nameST = () => {
	let opcion = prompt("Nombre hoja de cálculo:", "Hoja cálculo 1");
	if (opcion == null || opcion == "") {
		mensaje = "Cancelado o introducido nombre vacío";
		return -1
	} else {
		return opcion;
	}
	return -1;
}