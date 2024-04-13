# wasm-group-10

`emcc lib/primeFactors.c -o func/primeFactors.js -sEXPORTED_FUNCTIONS=_primeFactors -sEXPORTED_RUNTIME_METHODS=ccall -s WASM=1`


# Correr con makefile

`make`
`make clean`

En caso de mensaje `bash: emcc: command not found`, correr lo siguiente pues significa que Emscripten no está activado en la terminal actual
1) cd emsdk
2) source ./emsdk_env.sh
3) emcc --version


Con esto ya debería funcionar nuevamente make y make clean.

