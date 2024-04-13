const button = document.getElementById("prime-factors-button");

button?.addEventListener("click", async () => {
  let number = document.getElementById("number-input")?.value;
  console.log(typeof(number));
  if (isNaN(number)) {
    alert("Please enter a valid number");
    return;
  }
  const primeFactors = Module.cwrap('primeFactors', 'number', ['string', 'number']);
  const start = performance.now();

  // Allocate space for the size integer that will be updated by the C function
  const sizePtr = Module._malloc(4); // 4 bytes for an integer

  // Call the primeFactors function, which returns a pointer to the array of factors
  const ptr = primeFactors(number, sizePtr);

  // Read the size of the array
  const size = Module.HEAP32[sizePtr >> 2]; // Convert byte offset to index
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
