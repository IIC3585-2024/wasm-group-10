#include <stdio.h>
#include <stdlib.h>


// Hecho con ayuda de ChatGPT. Algoritmo base de geeks of geeks "https://www.geeksforgeeks.org/c-program-for-efficiently-print-all-prime-factors-of-a-given-number/"
// No funcionaba por tema de tamaño de memoria (números muy grandes no los manejaba), por lo que se usó esta solución;
unsigned long long* primeFactors(const char* n_str, int* size) {
    unsigned long long n = strtoull(n_str, NULL, 10); //convierte una cadena (array de caracteres, char*) a un número de tipo unsigned long long hasta encontrar NULL. Usa base 10

    printf("Starting prime factorization of %llu\n", n);
    int arraySize = 5;
    unsigned long long* factors = malloc(arraySize * sizeof(unsigned long long));
    int count = 0; 


    while (n % 2 == 0) {
        if (count >= arraySize){
            arraySize += 1;
            factors = realloc(factors, arraySize * sizeof(unsigned long long));
        }
        factors[count++] = 2; // si es divisible por 2, el factor será 2
        n /= 2;
    }

    for (unsigned long long i = 3; i * i <= n; i += 2) {
        while (n % i == 0) {
            if (count >= arraySize){
            arraySize += 1;
            factors = realloc(factors, arraySize * sizeof(unsigned long long));
            }
            factors[count++] = i; // cada vez que se encuentra un factor primo se guarda
            n /= i;
        }
    }

    // Después de dividir n por todos sus posibles factores desde 2 hasta la raíz cuadrada de n, si n todavía es mayor que 2, entonces n mismo es un factor primo.
    if (n > 2) {
        if (count >= arraySize){
            arraySize += 1;
            factors = realloc(factors, arraySize * sizeof(unsigned long long));
        }
        factors[count++] = n;
        
    }
    // printf("Prime factors are: ");
    // for (int i = 0; i < count; i++) {
    //     printf("%llu ", factors[i]);
    // }
    // printf("\n");
    *size = count;
    return factors;
}
