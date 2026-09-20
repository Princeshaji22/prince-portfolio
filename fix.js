const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Imports
code = code.replace(
  "import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';",
  "import { motion, useScroll, useTransform, AnimatePresence, useInView, useMotionValue, useSpring } from 'framer-motion';"
);
code = code.replace(
  "Award, Sun, Moon\n} from 'lucide-react';",
  "Award, Sun, Moon,\n  MessageSquare, Bot, Send, Terminal as TerminalIcon\n} from 'lucide-react';"
);

// 2. Add Components
const componentsStr = `// --- COMPONENTS ---

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = React.useState(false);

  React.useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseOver = (e) => {
      if (e.target.tagName.toLowerCase() === 'a' || e.target.tagName.toLowerCase() === 'button' || e.target.closest('button') || e.target.closest('a') || e.target.closest('.glass-panel')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-brand pointer-events-none z-[100] mix-blend-difference hidden md:block"
      animate={{
        x: mousePosition.x - 16,
        y: mousePosition.y - 16,
        scale: isHovering ? 1.5 : 1,
        backgroundColor: isHovering ? 'var(--color-brand)' : 'transparent',
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
    />
  );
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([
    { role: 'bot', text: "Hi! I'm Prince's AI assistant. Ask me anything about his experience, skills, or projects!" }
  ]);
  const [input, setInput] = React.useState('');
  const endRef = React.useRef(null);

  React.useEffect(() => {
    if (isOpen) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    
    setTimeout(() => {
      let reply = "That's a great question! Prince specializes in Odoo ERP and AI Integrations. Would you like his email to discuss further?";
      if (userMsg.toLowerCase().includes('skill') || userMsg.toLowerCase().includes('tech')) {
        reply = "Prince is proficient in Python, JavaScript, Odoo, PostgreSQL, and AI tech like RAG and LLMs.";
      } else if (userMsg.toLowerCase().includes('experience') || userMsg.toLowerCase().includes('work') || userMsg.toLowerCase().includes('job')) {
        reply = "He has over 4 years of experience as an AI/Solution Engineer and Odoo Developer.";
      } else if (userMsg.toLowerCase().includes('contact') || userMsg.toLowerCase().includes('email')) {
        reply = "You can reach him directly at princeshaji33@gmail.com";
      }
      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    }, 1000);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={\`fixed bottom-6 right-6 w-14 h-14 bg-brand text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:scale-110 transition-transform z-50 \${isOpen ? 'hidden' : ''}\`}
      >
        <MessageSquare />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 bg-bg border border-border shadow-2xl rounded-2xl z-50 flex flex-col overflow-hidden"
          >
            <div className="bg-surface p-4 flex justify-between items-center border-b border-border">
              <div className="flex items-center gap-2">
                <Bot className="text-brand" />
                <h3 className="font-bold text-text-primary">Prince's AI Avatar</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-text-secondary hover:text-brand">
                <X size={20} />
              </button>
            </div>
            
            <div className="h-80 p-4 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={\`max-w-[80%] p-3 rounded-xl text-sm \${m.role === 'bot' ? 'bg-surface text-text-primary self-start rounded-tl-sm' : 'bg-brand text-white self-end rounded-tr-sm'}\`}>
                  {m.text}
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 bg-surface border-t border-border flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Prince..."
                className="flex-1 bg-bg border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-brand text-text-primary"
              />
              <button type="submit" className="w-10 h-10 bg-brand text-white flex items-center justify-center rounded-full shrink-0">
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Terminal = () => {
  const [history, setHistory] = React.useState([
    { type: 'input', text: 'whoami' },
    { type: 'output', text: 'Prince Shaji - AI/Solution Engineer & Python Odoo Dev' }
  ]);
  const [input, setInput] = React.useState('');
  const endRef = React.useRef(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      let output = '';
      
      switch(cmd) {
        case 'whoami':
          output = 'Prince Shaji - Building scalable ERPs and AI integrations.';
          break;
        case 'skills':
          output = 'Python, JavaScript, Odoo, RAG, Prompt Engineering, PostgreSQL';
          break;
        case 'clear':
          setHistory([]);
          setInput('');
          return;
        case 'help':
          output = 'Available commands: whoami, skills, clear, help';
          break;
        case '':
          output = '';
          break;
        default:
          output = \`Command not found: \${cmd}. Type 'help' for available commands.\`;
      }
      
      setHistory(prev => [...prev, { type: 'input', text: input }, ...(output ? [{ type: 'output', text: output }] : [])]);
      setInput('');
    }
  };

  return (
    <div className="glass-panel p-4 font-mono text-sm w-full bg-[#0a0a0a] border border-border h-64 flex flex-col shadow-2xl mt-8">
      <div className="flex gap-2 mb-4 border-b border-border/50 pb-2 items-center">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="ml-2 text-text-secondary text-xs flex items-center gap-1"><TerminalIcon size={12}/> bash</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 text-green-400 custom-scrollbar pr-2">
        {history.map((line, i) => (
          <div key={i} className={line.type === 'input' ? 'text-blue-400' : 'text-green-400'}>
            {line.type === 'input' ? <span className="text-white mr-2">guest@portfolio:~$</span> : null}
            {line.text}
          </div>
        ))}
        <div className="flex items-center text-blue-400">
          <span className="text-white mr-2 shrink-0">guest@portfolio:~$</span>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            className="bg-transparent border-none outline-none flex-1 text-blue-400 focus:ring-0"
            spellCheck="false"
          />
        </div>
        <div ref={endRef} />
      </div>
    </div>
  );
};

const ProjectCard = ({ project, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass-panel group overflow-hidden flex flex-col h-full hover:border-brand/40 transition-colors duration-500 relative"
    >
      <div style={{ transform: "translateZ(30px)" }} className="p-8 flex-1 flex flex-col relative z-10 pointer-events-none">
        <div className="flex justify-between items-start mb-6">
          <Code2 className="w-8 h-8 text-brand opacity-80" strokeWidth={1.5} />
          <a href="#" className="opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-text-primary hover:text-brand pointer-events-auto">
            <ExternalLink size={20} />
          </a>
        </div>
        <h3 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-brand transition-colors duration-300">{project.title}</h3>
        <p className="text-text-secondary text-sm flex-1 leading-relaxed">{project.desc}</p>
        
        <div className="flex flex-wrap gap-2 mt-6">
          {project.tags.map(tag => (
            <span key={tag} className="text-xs font-medium text-brand/80 bg-brand/5 px-2.5 py-1 rounded-full border border-brand/10">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </motion.div>
  );
};`;
code = code.replace('// --- COMPONENTS ---', componentsStr);

// 3. CustomCursor and ChatWidget in App
code = code.replace(
  '<AnimatePresence>\n        {loading && <Preloader onComplete={() => setLoading(false)} />}\n      </AnimatePresence>',
  '<CustomCursor />\n      <AnimatePresence>\n        {loading && <Preloader onComplete={() => setLoading(false)} />}\n      </AnimatePresence>'
);
code = code.replace(
  '<Navbar />\n          \n          <main>',
  '<Navbar />\n          <ChatWidget />\n          <main>'
);

// 4. Insert Terminal
code = code.replace(
  "end-to-end solutions that drive real business value.\n                    </p>\n                  </motion.div>",
  "end-to-end solutions that drive real business value.\n                    </p>\n                    <Terminal />\n                  </motion.div>"
);

// 5. Replace Projects mapping
const oldProjectStr = `<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                  {PROJECTS.map((project, i) => (
                    <motion.div
                      key={project.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="glass-panel group overflow-hidden flex flex-col h-full hover:border-brand/40 transition-colors duration-500"
                    >
                      <div className="p-8 flex-1 flex flex-col relative z-10">
                        <div className="flex justify-between items-start mb-6">
                          <Code2 className="w-8 h-8 text-brand opacity-80" strokeWidth={1.5} />
                          <a href="#" className="opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-text-primary hover:text-brand">
                            <ExternalLink size={20} />
                          </a>
                        </div>
                        <h3 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-brand transition-colors duration-300">{project.title}</h3>
                        <p className="text-text-secondary text-sm flex-1 leading-relaxed">{project.desc}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-6">
                          {project.tags.map(tag => (
                            <span key={tag} className="text-xs font-medium text-brand/80 bg-brand/5 px-2.5 py-1 rounded-full border border-brand/10">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </motion.div>
                  ))}
                </div>`;
const newProjectStr = `<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12" style={{ perspective: "1000px" }}>
                  {PROJECTS.map((project, i) => (
                    <ProjectCard key={project.title} project={project} index={i} />
                  ))}
                </div>`;
code = code.replace(oldProjectStr, newProjectStr);

fs.writeFileSync('src/App.jsx', code);
console.log('Features added!');
