const fs = require('fs');

let code = fs.readFileSync('src/App.jsx', 'utf8');

// Add imports
const imports = `import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';`;

if (!code.includes('vanta')) {
  code = code.replace(
    "import { motion, useScroll",
    `${imports}\nimport { motion, useScroll`
  );
}

// Add Background3D component
const bgComponent = `
const Background3D = () => {
  const [vantaEffect, setVantaEffect] = React.useState(null);
  const myRef = React.useRef(null);
  
  React.useEffect(() => {
    // Only init if not mobile
    if (!vantaEffect && window.innerWidth > 768) {
      window.THREE = THREE;
      setVantaEffect(NET({
        el: myRef.current,
        THREE: THREE,
        color: 0xdc2626, // brand color
        backgroundColor: document.documentElement.classList.contains('light') ? 0xf8fafc : 0x0a0a0a,
        points: 12.00,
        maxDistance: 22.00,
        spacing: 18.00,
        showDots: true,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00
      }));
    }
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' && window.vantaEffectInstance) {
          const isLight = document.documentElement.classList.contains('light');
          window.vantaEffectInstance.setOptions({
            backgroundColor: isLight ? 0xf8fafc : 0x0a0a0a
          });
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });

    return () => {
      if (vantaEffect) vantaEffect.destroy();
      observer.disconnect();
    }
  }, [vantaEffect]);

  // Save instance to window for observer to access since it's in a closure
  React.useEffect(() => {
    window.vantaEffectInstance = vantaEffect;
  }, [vantaEffect]);

  return <div ref={myRef} className="fixed inset-0 z-[-2] w-full h-full pointer-events-none opacity-40"></div>;
};
`;

if (!code.includes('Background3D')) {
  code = code.replace('// --- COMPONENTS ---', '// --- COMPONENTS ---\n' + bgComponent);
}

// Add to App render
code = code.replace(
  '<CustomCursor />',
  '<CustomCursor />\n      <Background3D />'
);

fs.writeFileSync('src/App.jsx', code);
console.log('3D Background Added');
