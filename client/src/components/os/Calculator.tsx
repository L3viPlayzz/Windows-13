import { useState } from 'react';

export function CalculatorApp() {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  const handleNumber = (num: string) => {
    setDisplay(shouldResetDisplay ? num : display === '0' ? num : display + num);
    setShouldResetDisplay(false);
  };

  const handleOperation = (op: string) => {
    const currentNum = parseFloat(display);
    if (memory === null) {
      setMemory(currentNum);
    } else if (operation) {
      const result = calculate(memory, currentNum, operation);
      setDisplay(result.toString());
      setMemory(result);
    }
    setOperation(op);
    setShouldResetDisplay(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return a / b;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (operation && memory !== null) {
      const result = calculate(memory, parseFloat(display), operation);
      setDisplay(result.toString());
      setMemory(null);
      setOperation(null);
      setShouldResetDisplay(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setMemory(null);
    setOperation(null);
    setShouldResetDisplay(false);
  };

  const buttons = [
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+']
  ];

  return (
    <div className="h-full w-full bg-white dark:bg-[#1a1a1a] flex items-center justify-center p-4">
      <div className="w-full max-w-xs bg-zinc-900 dark:bg-zinc-950 rounded-lg p-4 shadow-xl">
        <div className="bg-zinc-800 rounded p-4 mb-4 text-right">
          <div className="text-gray-400 text-sm mb-2 h-6">{operation ? `${memory} ${operation}` : ''}</div>
          <div className="text-white text-4xl font-mono break-words">{display}</div>
        </div>
        <button onClick={handleClear} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded mb-4">C</button>
        {buttons.map((row, i) => (
          <div key={i} className="grid grid-cols-4 gap-2 mb-2">
            {row.map(btn => (
              <button key={btn} onClick={() => btn === '=' ? handleEquals() : ['+', '-', '×', '÷'].includes(btn) ? handleOperation(btn) : handleNumber(btn)} className={`py-4 rounded font-bold text-white transition-colors ${['+', '-', '×', '÷', '='].includes(btn) ? 'bg-blue-600 hover:bg-blue-700' : 'bg-zinc-700 hover:bg-zinc-600'}`}>
                {btn}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
