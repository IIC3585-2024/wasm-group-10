# wasm-group-10

`emcc lib/primeFactors.c -o func/primeFactors.js -sEXPORTED_FUNCTIONS=_primeFactors -sEXPORTED_RUNTIME_METHODS=ccall -s WASM=1`