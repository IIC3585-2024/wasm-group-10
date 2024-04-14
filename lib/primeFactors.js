
//código base de https://www.geeksforgeeks.org/print-all-prime-factors-of-a-given-number/ y modificado de primeFactors.c pero sin punteros ni memoria

export function primeFactorsJS(n) {

    let factors = [];
    let num = n;

    while (num % 2 === 0) {
        factors.push(2);
        num /= 2;
    }
 

    for (let i = 3; i * i <= num; i += 2) {
        while (num % i === 0) {
          factors.push(i);
          num /= i;
        }
      }
         
    if (num > 2) {
        factors.push(num);
    }

    return factors;
}
 