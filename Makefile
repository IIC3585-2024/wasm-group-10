# Makefile for compiling WebAssembly module with Emscripten

# Define the compiler to use
EMCC = emcc

# Source and target files
SRC = lib/primeFactors.c
TARGET = func/primeFactors
TARGET_JS = func/primeFactors.js
TARGET_WASM = $(TARGET_JS:.js=.wasm)

# Compiler flags
EMCC_FLAGS = -s EXPORTED_FUNCTIONS='["_primeFactors", "_malloc", "_free"]' \
             -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' \
             -s WASM=1 \
			 -s WASM_BIGINT # Para soprtar inputs grandes (64 bits) lo cual es importante, pues C puede aguantar, pero hay que indicarle a js también mediante el emcc

all: 
	$(EMCC) $(SRC) -o $(TARGET).js $(EMCC_FLAGS)
	$(EMCC) $(SRC) -o $(TARGET)O1.js $(EMCC_FLAGS) -O1
	$(EMCC) $(SRC) -o $(TARGET)O2.js $(EMCC_FLAGS) -O2
	$(EMCC) $(SRC) -o $(TARGET)O3.js $(EMCC_FLAGS) -O3

default:
	$(EMCC) $(SRC) -o $(TARGET).js $(EMCC_FLAGS)

O1:
	$(EMCC) $(SRC) -o $(TARGET)O1.js $(EMCC_FLAGS) -O1

O2:
	$(EMCC) $(SRC) -o $(TARGET)O2.js $(EMCC_FLAGS) -O2

O3:
	$(EMCC) $(SRC) -o $(TARGET)O3.js $(EMCC_FLAGS) -O3

# Rule for building the target
$(TARGET_JS): $(SRC)
	$(EMCC) $(SRC) -o $(TARGET_JS) $(EMCC_FLAGS)

# Clean target for removing build artifacts
clean:
	rm -f $(TARGET).js $(TARGET).wasm $(TARGET)O1.js $(TARGET)O1.wasm $(TARGET)O2.js $(TARGET)O2.wasm $(TARGET)O3.js $(TARGET)O3.wasm

.PHONY: all make1 make2 make3 clean
