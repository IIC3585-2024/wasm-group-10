# Makefile for compiling WebAssembly module with Emscripten

# Define the compiler to use
EMCC = emcc

# Source and target files
SRC = lib/primeFactors.c
TARGET_JS = func/primeFactors.js
TARGET_WASM = $(TARGET_JS:.js=.wasm)

# Compiler flags
EMCC_FLAGS = -s EXPORTED_FUNCTIONS='["_primeFactors","_freeFactors", "_malloc", "_free"]' \
             -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' \
             -s WASM=1 \
			 -s WASM_BIGINT # Para soprtar inputs grandes (64 bits) lo cual es importante, pues C puede aguantar, pero hay que indicarle a js también mediante el emcc

# The default target
all: $(TARGET_JS)

# Rule for building the target
$(TARGET_JS): $(SRC)
	$(EMCC) $(SRC) -o $(TARGET_JS) $(EMCC_FLAGS)

# Clean target for removing build artifacts
clean:
	rm -f $(TARGET_JS) $(TARGET_WASM)

.PHONY: all clean
