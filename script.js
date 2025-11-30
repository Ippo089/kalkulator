alert("JS berhasil terbaca!");

const displayEl = document.getElementById("display");
let current = "0";      // string shown
let previous = null;    // stored number
let operator = null;    // stored operator
let overwrite = false;  // next number overwrites current

function updateDisplay(){
  displayEl.textContent = current;
}

// helpers
function inputDigit(d){
  if(overwrite || current === "0" && d !== "."){
    current = d === "." ? "0." : d;
    overwrite = false;
    return;
  }
  if(d === "." && current.includes(".")) return;
  current = current + d;
}

function handleOperator(op){
  if(operator && !overwrite){
    compute();
  }
  previous = current;
  operator = op;
  overwrite = true;
}

function compute(){
  if(operator == null || previous == null) return;
  // convert
  const a = parseFloat(previous);
  const b = parseFloat(current);
  if(isNaN(a) || isNaN(b)) return;
  let result = 0;
  switch(operator){
    case "+": result = a + b; break;
    case "-": result = a - b; break;
    case "*": result = a * b; break;
    case "/": result = b === 0 ? "Error" : a / b; break;
    default: return;
  }
  current = (result === "Error") ? "Error" : String(roundAccurate(result));
  operator = null;
  previous = null;
  overwrite = true;
}

function roundAccurate(n){
  // avoid long floating results
  return Math.round((n + Number.EPSILON) * 100000000) / 100000000;
}

function clearAll(){
  current = "0";
  previous = null;
  operator = null;
  overwrite = false;
}

function del(){
  if(overwrite){
    current = "0";
    overwrite = false;
    return;
  }
  if(current.length <= 1){
    current = "0";
  } else {
    current = current.slice(0, -1);
  }
}

function toggleSign(){
  if(current === "0") return;
  if(current.startsWith("-")) current = current.slice(1);
  else current = "-" + current;
}

function percent(){
  const val = parseFloat(current);
  if(isNaN(val)) return;
  current = String(val / 100);
  overwrite = true;
}

// wire buttons
document.querySelectorAll(".btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const num = btn.getAttribute("data-number");
    const action = btn.getAttribute("data-action");
    if(num !== null){
      inputDigit(num);
      updateDisplay();
      return;
    }
    if(action){
      if(action === "clear"){ clearAll(); updateDisplay(); return; }
      if(action === "del"){ del(); updateDisplay(); return; }
      if(action === "neg"){ toggleSign(); updateDisplay(); return; }
      if(action === "percent"){ percent(); updateDisplay(); return; }
      if(action === "="){ compute(); updateDisplay(); return; }
      // operator
      if(["+","-","*","/"].includes(action)){
        handleOperator(action);
        updateDisplay();
        return;
      }
    }
  });
});

// keyboard support
window.addEventListener("keydown", (e)=>{
  if(e.key >= "0" && e.key <= "9") { inputDigit(e.key); updateDisplay(); e.preventDefault(); return; }
  if(e.key === ".") { inputDigit("."); updateDisplay(); e.preventDefault(); return; }
  if(e.key === "Enter" || e.key === "=") { compute(); updateDisplay(); e.preventDefault(); return; }
  if(e.key === "Backspace") { del(); updateDisplay(); e.preventDefault(); return; }
  if(e.key === "Escape") { clearAll(); updateDisplay(); e.preventDefault(); return; }
  if(e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/"){
    handleOperator(e.key);
    updateDisplay();
    e.preventDefault();
    return;
  }
});

// init
updateDisplay();
