const button = document.getElementById("prime-factors-button");

button?.addEventListener("click", async () => {
  const number = parseInt(document.getElementById("number-input")?.value);
  if (isNaN(number)) {
    alert("Please enter a valid number");
    return;
  }

  console.log("ccall");
  Module.ccall("primeFactors", "number", ["number"], [number]);

  console.log("call directly");
  Module._primeFactors(number);
  console.log("runned");
  // console.log("[JS] primeFactors", primeFactors);
});
