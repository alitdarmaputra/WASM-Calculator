# Simple WebAssembly Calculator

### Description
Implement WebAssembly concept in simple calculator

### Tech Stack

- HTML, CSS, JavaScript
- C
- WASM

### How to run?
1. Install [python3](https://www.python.org/downloads) and [emscripten](https://emscripten.org/docs/getting_started/downloads.html)
2. Clone this repository
   ```
   git clone https://github.com/alitdarmaputra/WASM-Calculator
   ```
4. Go to WASM-Calculator directory
   ```
   cd WASM-Calculator
   ```
3. Compile main.c to main.wasm
   ```
   emcc main.c -o main.wasm --no-entry
   ```
   - Flag `--no-entry` is used because there is no main function in the C code
4. Serve the directory as server
   ```
   python3 -m http.server
   ```
5. Go to [localhost:8000](http://localhost:8000) which is the default address of the app in your web browser

