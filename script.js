const keysContainer = document.getElementById('keys');
const buttons = [
    ['C', 'fn', 'clear'], ['⌫', 'fn', 'back'], ['()', 'fn', '(``)'], ['%', 'fn', '%'], ['^', 'op', '^'], ['÷', 'op', '/'],
    ['sin', 'fn', 'sin('], ['cos', 'fn', 'cos('], ['tan', 'fn', 'tan('], ['ln', 'fn', 'ln('], ['log', 'fn', 'log10('], ['√', 'fn', 'sqrt('],
    ['7', '', '7'], ['8', '', '8'], ['9', '', '9'], ['×', 'op', '*'], ['!', 'fn', '!'], ['π', 'fn', 'pi'],
    ['4', '', '4'], ['5', '', '5'], ['6', '', '6'], ['−', 'op', '-'], ['1/x', 'fn', '1/'], ['e', 'fn', 'e'],
    ['1', '', '1'], ['2', '', '2'], ['3', '', '3'], ['+', 'op', '+'], ['x²', 'fn', 'sqrt(pow(,2))'], ['xʸ', 'fn', 'pow(,);'],
    ['0', 'wide', '0'], ['.', '', '.'], ['=', 'op', 'equals'], [',', 'fn', ',']
];
keysContainer.innerHTML = buttons.map(([txt, cls, ins]) => `<button class="${cls}" data-${ins === 'equals' ? 'action="equals"' : 'insert="' + ins + '"'}>${txt}</button>`).join('');


let isDeg = true, memory = 0;
const exprEl = document.getElementById('expr');
const outEl = document.getElementById('output');


function toR(x) { return x * Math.PI / 180 }
function sin(x) { return isDeg ? Math.sin(toR(x)) : Math.sin(x) }
function cos(x) { return isDeg ? Math.cos(toR(x)) : Math.cos(x) }
function tan(x) { return isDeg ? Math.tan(toR(x)) : Math.tan(x) }
function ln(x) { return Math.log(x) }
function log10(x) { return Math.log10 ? Math.log10(x) : Math.log(x) / Math.LN10 }
function sqrt(x) { return Math.sqrt(x) }
function pow(a, b) { return Math.pow(a, b) }
function factorial(n) { if (n < 0) return NaN; if (Math.floor(n) !== n) return gamma(n + 1); let r = 1; for (let i = 2; i <= n; i++)r *= i; return r; }
function gamma(z) { const g = 7, p = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7]; if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z)); z -= 1; let x = p[0]; for (let i = 1; i < p.length; i++)x += p[i] / (z + i); const t = z + g + 0.5; return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x; }


function evaluateExpression(input) { try { let s = input.replace(/×/g, '*').replace(/÷/g, '/').replace(/π/g, 'Math.PI').replace(/\be\b/g, 'Math.E'); s = s.replace(/\^/g, '**'); s = s.replace(/(\d+(?:\.\d+)?|\([^()]*\))!/g, (m, p1) => 'factorial(' + p1 + ')'); s = s.replace(/\bln\(/g, 'ln(').replace(/\blog10\(/g, 'log10(').replace(/\bsqrt\(/g, 'sqrt('); return Function('return (' + s + ')')(); } catch (e) { return 'Error'; } }


let current = ''; function refresh() { exprEl.textContent = current || ''; const val = current ? evaluateExpression(current) : 0; outEl.textContent = val === undefined ? '' : String(val); }
keysContainer.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; const a = b.dataset.action, i = b.dataset.insert; if (a === 'clear') { current = ''; refresh(); return } if (a === 'back') { current = current.slice(0, -1); refresh(); return } if (a === 'equals') { const val = evaluateExpression(current); outEl.textContent = String(val); current = String(val); exprEl.textContent = ''; return } if (i) { current += i === '(``)' ? '()' : i; refresh(); } });


document.getElementById('mc').onclick = () => memory = 0;
document.getElementById('mr').onclick = () => { current += String(memory); refresh(); };
document.getElementById('mPlus').onclick = () => { const v = evaluateExpression(current); if (!isNaN(v)) memory += Number(v); };
document.getElementById('mMinus').onclick = () => { const v = evaluateExpression(current); if (!isNaN(v)) memory -= Number(v); };
const degBtn = document.getElementById('degBtn'); degBtn.onclick = () => { isDeg = !isDeg; degBtn.textContent = isDeg ? 'DEG' : 'RAD'; refresh(); };
window.addEventListener('keydown', e => { if (/\d/.test(e.key) || ['+', '-', '*', '/', '.', '(', ')', ','].includes(e.key)) { current += e.key; refresh(); e.preventDefault(); return } if (e.key === 'Enter' || e.key === '=') { const v = evaluateExpression(current); outEl.textContent = String(v); current = String(v); exprEl.textContent = ''; e.preventDefault(); } if (e.key === 'Backspace') { current = current.slice(0, -1); refresh(); } if (e.key === 'Escape') { current = ''; refresh(); } });
refresh();