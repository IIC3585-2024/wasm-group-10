const button = document.getElementById("prime-factors-button");

button?.addEventListener("click", async () => {
  let number = document.getElementById("number-input")?.value;
  console.log(typeof(number));
  if (isNaN(number)) {
    alert("Please enter a valid number");
    return;
  }
  
  // Module.cwrap es una función Emscripten para conectar c/c++ compilados en WebAssembly con js. Mas eficiente que ccall si se quiere haer varios llamados
  const primeFactors = Module.cwrap('primeFactors', 'number', ['string', 'number']); //nombre de la función, tipo, tipos de los parámetros
  
  // Punteros 
  const sizePtr = Module._malloc(4); // 4 bytes for an integer

  // Se llama la función primeFactors. retorna un puntero al array con factores
  const start = performance.now();
  const ptr = primeFactors(number, sizePtr);

  // Es el número de elementos en el array de factores. Se accede a memoria de WebAssembly como un array. Puntero se mueve 4 bytes a la derecha (2^2 = 4 bytes de sizePtr)
  const size = Module.HEAP32[sizePtr >> 2]; 
  // Se leen los factores
  const factors = new BigInt64Array(Module.HEAPU64.buffer, ptr, size);
  
  const end = performance.now();
  const computeTime = (end - start).toFixed(2);

  displayFactors(factors, computeTime);

  // Free the allocated memory for the array and the size integer
  Module._free(ptr);
  Module._free(sizePtr);
});

function displayFactors(factors, computeTime) {
  const resultContainer = document.getElementById('result-container');
  resultContainer.textContent = `Prime Factors por .c:[${factors.join(', ')}] - Computation Time: ${computeTime} ms`;
}
