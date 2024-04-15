import { primeFactorsJS } from "./lib/primeFactors.js";
import { default as Module } from "./func/primeFactors.js";
import { default as ModuleO1 } from "./func/primeFactorsO1.js";
import { default as ModuleO2 } from "./func/primeFactorsO2.js";
import { default as ModuleO3 } from "./func/primeFactorsO3.js";

const wasm = await Module();
const wasmO1 = await ModuleO1();
const wasmO2 = await ModuleO2();
const wasmO3 = await ModuleO3();

// Boton y esquema de multiples runs hecho con ayuda de chatGPT
const button = document.getElementById("prime-factors-button");

button?.addEventListener("click", () => {
  let number = document.getElementById("number-input")?.value;
  let runs = parseInt(document.getElementById("runs-input")?.value);

  console.log(typeof number);
  if (isNaN(number) || number === "") {
    alert("Please enter a valid number");
    return;
  }
  if (isNaN(runs) || runs === "") {
    alert("Please enter how many");
    return;
  }

  console.log(typeof runs);

  const resultJS = jsPrimeFactors(number, runs);
  const resultWASM = wasmPrimeFactors(wasm, number, runs);

  displayFactors(resultJS.factors, resultJS.avgTime, resultWASM.factors, resultWASM.avgTime);
});

function jsPrimeFactors(number, runs) {
  let factors;
  let computeTime = 0;

  for (let i = 0; i < runs; i++) {
    let startTime = performance.now();
    factors = primeFactorsJS(Number(number));
    let endTime = performance.now();
    computeTime += endTime - startTime;
  }

  const avgTime = (computeTime / runs).toFixed(2);

  return { factors, avgTime };
}

function wasmPrimeFactors(wasmInstance, number, runs) {
  // Module.cwrap es una función Emscripten para conectar c/c++ compilados en WebAssembly con js. Mas eficiente que ccall si se quiere haer varios llamados
  let primeFactors = wasmInstance.cwrap("primeFactors", "number", ["string", "number"]); //nombre de la función, tipo, tipos de los parámetros
  let computeTime = 0;
  let factors;

  for (let i = 0; i < runs; i++) {
    // Punteros
    const sizePtr = wasmInstance._malloc(4); // 4 bytes for an integer

    // Se llama la función primeFactors. retorna un puntero al array con factores
    let startTime = performance.now();
    const ptr = primeFactors(number, sizePtr);

    // Es el número de elementos en el array de factores. Se accede a memoria de WebAssembly como un array. Puntero se mueve 4 bytes a la derecha (2^2 = 4 bytes de sizePtr)
    const size = wasmInstance.HEAP32[sizePtr >> 2];
    // Se leen los factores
    factors = new BigInt64Array(wasmInstance.HEAPU64.buffer, ptr, size);

    let endTime = performance.now();
    computeTime += endTime - startTime;

    wasmInstance._free(ptr);
    wasmInstance._free(sizePtr);
  }

  const avgTime = (computeTime / runs).toFixed(2);

  return { factors, avgTime };
}

function displayFactors(factorsJS, avgJS, factorsWASM, avgWASM) {
  const resultContainer = document.getElementById("result-container");
  resultContainer.innerHTML = `
    <p>JavaScript Prime Factors: [${factorsJS.join(", ")}] - Computation Time: ${avgJS} ms</p>
    <p>WebAssembly Prime Factors: [${Array.from(factorsWASM).join(", ")}] - Computation Time: ${avgWASM} ms</p>
  `;
}
