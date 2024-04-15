import { primeFactorsJS } from './lib/primeFactors.js';

// Boton y esquema de multiples runs hecho con ayuda de chatGPT
const button = document.getElementById("prime-factors-button");

button?.addEventListener("click", async () => {
  let number = document.getElementById("number-input")?.value;
  let runs = parseInt(document.getElementById("runs-input")?.value);

  console.log(typeof(number));
  if (isNaN(number) || number === '') {
    alert("Please enter a valid number");
    return;
  }
  if (isNaN(runs) || runs === '') {
    alert("Please enter how many");
    return;
  }

  console.log(typeof(runs));

  let factorsJS, factorsWASM;
  let computeTimeJS = 0;
  let computeTimeWASM = 0;

  for (let i = 0; i < runs; i++) {
  let startJS = performance.now();
  factorsJS = primeFactorsJS(Number(number));
  let endJS = performance.now();
  computeTimeJS += (endJS - startJS);
  }


  /////////////////////////////////////////////////////////////////////////////////////.C
  // Module.cwrap es una función Emscripten para conectar c/c++ compilados en WebAssembly con js. Mas eficiente que ccall si se quiere haer varios llamados
  let primeFactors = Module.cwrap('primeFactors', 'number', ['string', 'number']); //nombre de la función, tipo, tipos de los parámetros
  for (let i = 0; i < runs; i++) {

  // Punteros 
  const sizePtr = Module._malloc(4); // 4 bytes for an integer

  // Se llama la función primeFactors. retorna un puntero al array con factores
  let startWASM = performance.now();
  const ptr = primeFactors(number, sizePtr);

  // Es el número de elementos en el array de factores. Se accede a memoria de WebAssembly como un array. Puntero se mueve 4 bytes a la derecha (2^2 = 4 bytes de sizePtr)
  const size = Module.HEAP32[sizePtr >> 2]; 
  // Se leen los factores
  factorsWASM = new BigInt64Array(Module.HEAPU64.buffer, ptr, size);
  
  let endWASM = performance.now();
  computeTimeWASM += (endWASM - startWASM);

  Module._free(ptr);
  Module._free(sizePtr);
  }
  
  /////////////////////////////////////////////////////////////////////////////////////.C
  const avgJS = (computeTimeJS / runs).toFixed(2);
  const avgWASM = (computeTimeWASM / runs).toFixed(2);
  displayFactors(factorsJS, avgJS, factorsWASM, avgWASM);


});

function displayFactors(factorsJS, avgJS, factorsWASM, avgWASM) {
  const resultContainer = document.getElementById('result-container');
  resultContainer.innerHTML = `
    <p>JavaScript Prime Factors: [${factorsJS.join(', ')}] - Computation Time: ${avgJS} ms</p>
    <p>WebAssembly Prime Factors: [${Array.from(factorsWASM).join(', ')}] - Computation Time: ${avgWASM} ms</p>
  `;  
}



