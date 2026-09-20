const fs = require('fs');

// 1. Update index.css for Noise
let css = fs.readFileSync('src/index.css', 'utf8');
if (!css.includes('.noise-bg')) {
  css += `
/* Canvas Noise Overlay */
.noise-bg {
  position: fixed;
  top: -50%; left: -50%; right: -50%; bottom: -50%;
  width: 200%; height: 200vh;
  background: transparent url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E');
  animation: noise 0.2s infinite;
  opacity: 0.04;
  pointer-events: none;
  z-index: 9999;
}
@keyframes noise {
  0% { transform: translate(0, 0); }
  10% { transform: translate(-5%, -5%); }
  20% { transform: translate(-10%, 5%); }
  30% { transform: translate(5%, -10%); }
  40% { transform: translate(-5%, 15%); }
  50% { transform: translate(-10%, 5%); }
  60% { transform: translate(15%, 0); }
  70% { transform: translate(0, 15%); }
  80% { transform: translate(3%, 35%); }
  90% { transform: translate(-10%, 10%); }
  100% { transform: translate(0, 0); }
}`;
  fs.writeFileSync('src/index.css', css);
}

// 2. Update App.jsx
let code = fs.readFileSync('src/App.jsx', 'utf8');

// A. Insert Sound Utility at top of COMPONENTS
const soundStr = `const playSound = (type = 'click') => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'click') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'type') {
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(400 + Math.random()*200, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.05);
    } else if (type === 'send') {
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.15);
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15);
    }
  } catch (e) {
    console.error(e);
  }
};

`;
if (!code.includes('const playSound')) {
  code = code.replace('// --- COMPONENTS ---', '// --- COMPONENTS ---\n\n' + soundStr);
}

// B. Hook sounds into ChatWidget
code = code.replace(
  'const handleSend = (e) => {',
  `const handleSend = (e) => {
    playSound('send');`
);

// C. Hook sounds into Terminal
code = code.replace(
  'onKeyDown={handleCommand}',
  `onKeyDown={(e) => { playSound('type'); handleCommand(e); }}`
);

// D. Hook sounds into common buttons (Hire Me, Resume, View Work, Nav links)
code = code.replace(
  /onClick=\{\(\) => scrollTo\('/g,
  "onClick={() => { playSound('click'); scrollTo('"
);
code = code.replace(
  `onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}`,
  `onClick={() => { playSound('click'); document.getElementById('projects').scrollIntoView({ behavior: 'smooth' }); }}`
);
code = code.replace(
  'onClick={toggleTheme}',
  "onClick={() => { playSound('click'); toggleTheme(); }}"
);

// E. Add vCard function and Button in Contact section
const vcardBtn = `<div>
                      <h3 className="text-2xl font-bold text-text-primary mb-6">Contact Info</h3>
                      <div className="space-y-6">
                        <button 
                          onClick={() => {
                            playSound('click');
                            const vcard = \`BEGIN:VCARD\\nVERSION:3.0\\nFN:Prince Shaji\\nTITLE:AI/Solution Engineer & Python Odoo Developer\\nTEL;TYPE=WORK,VOICE:+918547515273\\nEMAIL:princeshaji33@gmail.com\\nURL:https://linkedin.com/in/prince-shaji-157848178\\nEND:VCARD\`;
                            const blob = new Blob([vcard], { type: 'text/vcard' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = 'Prince_Shaji.vcf';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="w-full bg-surface border border-border text-text-primary font-bold py-3 px-4 rounded-lg hover:bg-brand hover:text-white hover:border-brand transition-colors duration-300 flex items-center justify-center gap-2 mb-6 shadow-sm group"
                        >
                          <Download size={18} className="group-hover:-translate-y-1 transition-transform" /> Save Contact (vCard)
                        </button>`;

code = code.replace(`<div>\n                      <h3 className="text-2xl font-bold text-text-primary mb-6">Contact Info</h3>\n                      <div className="space-y-6">`, vcardBtn);

// F. Add Noise overlay inside main wrapper
code = code.replace(
  '<CustomCursor />',
  '<CustomCursor />\n      <div className="noise-bg"></div>'
);

fs.writeFileSync('src/App.jsx', code);
console.log('Advanced features added!');
