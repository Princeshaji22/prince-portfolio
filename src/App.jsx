import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView, useMotionValue, useSpring } from 'framer-motion';
import { 
  Mail, Phone, Globe, ExternalLink, Code2, Database, BrainCircuit, 
  Wrench, Menu, X, Download, ChevronRight, Briefcase, GraduationCap, Award, Sun, Moon,
  MessageSquare, Bot, Send, Terminal as TerminalIcon
} from 'lucide-react';

// --- DATA ---
const NAV_LINKS = ['About', 'Skills', 'Experience', 'Projects', 'Contact'];

const SKILLS = [
  {
    category: 'Languages',
    icon: <Code2 className="w-6 h-6 text-brand" />,
    items: ['Python', 'R', 'JavaScript', 'HTML', 'CSS']
  },
  {
    category: 'AI & LLM',
    icon: <BrainCircuit className="w-6 h-6 text-brand" />,
    items: ['OpenAI API', 'RAG', 'Prompt Engineering', 'Conversational AI', 'AI Agents', 'OCR', 'Generative AI', 'LLMs', 'ML/DL']
  },
  {
    category: 'Databases',
    icon: <Database className="w-6 h-6 text-brand" />,
    items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Cassandra']
  },
  {
    category: 'Frameworks & Tools',
    icon: <Wrench className="w-6 h-6 text-brand" />,
    items: ['Odoo (v14–v18)', 'XML-RPC', 'OdooSH', 'REST API', 'Git', 'Linux', 'Hadoop', 'Spark']
  }
];

const EXPERIENCE = [
  {
    id: 1,
    role: 'AI/Solution Engineer',
    company: 'Milan Digital',
    period: 'Jan 2026 – Present',
    details: [
      'Designed AI-powered solutions using LLMs, RAG, and conversational AI',
      'Built AI chatbots integrated with Odoo ERP for business data querying/automation',
      'Integrated AI systems with Odoo via REST APIs and XML-RPC',
      'Built document analysis/data extraction using OCR + LLMs',
      'Built semantic search/knowledge-base chat using FAISS/vector databases'
    ]
  },
  {
    id: 2,
    role: 'Odoo Developer',
    company: 'Milan Digital',
    period: 'Jul 2024 – Dec 2025',
    details: [
      'Developed Odoo modules (Projects, Timesheet, CRM, Sales, etc.)',
      'Integrated external apps via XML-RPC/REST APIs',
      'Optimized PostgreSQL queries and indexing',
      'Worked across Odoo v16–v18'
    ]
  },
  {
    id: 3,
    role: 'Junior Odoo Developer',
    company: 'Codelayer Technologies',
    period: 'Aug 2022 – Jun 2024',
    details: [
      'Custom workflows for retail and healthcare domains',
      'Customized Sales, Purchase, Inventory, Accounting modules',
      'Post-deployment support, bug fixes, performance tuning, end-user training'
    ]
  },
  {
    id: 4,
    role: 'Data Science Intern',
    company: 'TechCity Software Consulting',
    period: 'Aug 2021 – Oct 2021',
    details: [
      'ML models for classification/prediction; EDA using Pandas/NumPy'
    ]
  },
  {
    id: 5,
    role: 'Process Associate',
    company: 'Nest Information Technologies',
    period: 'Feb 2020 – Nov 2020',
    details: [
      'Document processing and data-entry workflow streamlining'
    ]
  }
];

const PROJECTS = [
  {
    title: 'Eye Hospital Management ERP',
    desc: 'Full-stack Odoo ERP for patient registration, refraction, nurse workflows, doctor consultations, medical reports, billing.',
    tags: ['Odoo', 'PostgreSQL', 'Python']
  },
  {
    title: 'Quarry ERP System',
    desc: 'Odoo-based ERP for fleet management, weighbridge integration, purchase/sales, inventory, multi-company support.',
    tags: ['Odoo', 'IoT', 'Python']
  },
  {
    title: 'Project & Timesheet Management',
    desc: 'Customized Odoo module for task tracking, timesheet validation, team dashboards.',
    tags: ['Odoo', 'REST API']
  },
  {
    title: 'Automatic Attendance Management',
    desc: 'ML-based face recognition system.',
    tags: ['OpenCV', 'Python', 'ML']
  },
  {
    title: 'Skin Disease Detection',
    desc: 'Image classification model using ML on medical image datasets.',
    tags: ['ML', 'Computer Vision']
  },
  {
    title: 'House Price Prediction',
    desc: 'Regression model for property price estimation.',
    tags: ['Scikit-Learn', 'Python']
  }
];

const EDUCATION = [
  { deg: 'MSc Big Data Analytics', inst: 'St. Agnes College Mangalore', year: '2020–2022' },
  { deg: 'BCA', inst: 'Deva Matha Arts and Science College Paisakary', year: '2016–2019' },
  { deg: 'Higher Secondary', inst: 'Sacred Heart HSS Payyavoor', year: '2014–2016' }
];

const CERTIFICATIONS = [
  'National Level Workshop on Artificial Intelligence',
  'AI Master Class Using Python — Pantech Solutions',
  'Machine Learning for All — Coursera',
  'MySQL Basics — Great Learning'
];

// --- COMPONENTS ---

const playSound = (type = 'click') => {
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
    playSound('send');
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
        className={`fixed bottom-6 right-6 w-14 h-14 bg-brand text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:scale-110 transition-transform z-50 ${isOpen ? 'hidden' : ''}`}
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
                <div key={i} className={`max-w-[80%] p-3 rounded-xl text-sm ${m.role === 'bot' ? 'bg-surface text-text-primary self-start rounded-tl-sm' : 'bg-brand text-white self-end rounded-tr-sm'}`}>
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
          output = `Command not found: ${cmd}. Type 'help' for available commands.`;
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
            onKeyDown={(e) => { playSound('type'); handleCommand(e); }}
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
};

const Preloader = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg"
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-brand font-bold text-6xl tracking-tighter mb-4"
        >
          PS.
        </motion.div>
        <div className="w-48 h-1 bg-surface rounded overflow-hidden">
          <motion.div 
            className="h-full bg-brand"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'circOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
};

const ThemeToggle = () => {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('theme') === 'light' || 
       (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches)) {
      setIsLight(true);
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggleTheme = () => {
    if (isLight) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
      setIsLight(false);
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
      setIsLight(true);
    }
  };

  return (
    <button 
      onClick={() => { playSound('click'); toggleTheme(); }}
      className="p-2 rounded-full hover:bg-surface border border-transparent hover:border-border text-text-secondary hover:text-brand transition-all duration-300 ml-2"
      aria-label="Toggle theme"
    >
      {isLight ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${scrolled ? 'py-4 backdrop-blur-lg bg-bg/80 border-b border-border' : 'py-6 bg-transparent'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center max-w-6xl">
        <div className="text-2xl font-bold tracking-tighter cursor-pointer text-text-primary flex items-center gap-1" onClick={() => window.scrollTo(0, 0)}>
          Prince<span className="text-brand">.</span>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {NAV_LINKS.map(link => (
            <button 
              key={link} 
              onClick={() => { playSound('click'); scrollTo(link); }}
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors relative group"
            >
              {link}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand transition-all group-hover:w-full"></span>
            </button>
          ))}
          <button onClick={() => { playSound('click'); scrollTo('Contact'); }} className="px-5 py-2 text-sm font-medium border border-brand text-brand hover:bg-brand hover:text-white rounded-full transition-all duration-300">
            Hire Me
          </button>
          <ThemeToggle />
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button className="text-text-primary p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-bg/95 backdrop-blur-lg border-b border-border overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {NAV_LINKS.map(link => (
                <button 
                  key={link} 
                  onClick={() => { playSound('click'); scrollTo(link); }}
                  className="text-left text-lg font-medium text-text-secondary hover:text-brand transition-colors"
                >
                  {link}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

const SectionHeading = ({ children, align = "left" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={`mb-12 ${align === "center" ? "text-center" : ""}`}
    >
      <h2 className="text-3xl md:text-5xl font-bold inline-block">
        {children}
        <div className={`h-1 bg-brand mt-2 ${align === "center" ? "w-24 mx-auto" : "w-24"}`}></div>
      </h2>
    </motion.div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [loading, setLoading] = useState(true);
  
  // Scroll driven animation values for Hero
  const { scrollY } = useScroll();
  const yHeroText = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityHero = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="bg-bg text-text-primary min-h-screen selection:bg-brand/30 selection:text-white font-sans">
      <CustomCursor />
      <div className="noise-bg"></div>
      <AnimatePresence>
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <>
          <Navbar />
          <ChatWidget />
          <main>
            {/* HERO SECTION */}
            <section className="relative min-h-screen flex items-center pt-20 overflow-hidden" id="hero">
              {/* Animated Background Gradients */}
              <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand/10 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-brand/5 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="container mx-auto px-6 max-w-6xl relative z-10 flex flex-col-reverse md:flex-row items-center gap-12 pt-24 md:pt-0">
                <motion.div style={{ y: yHeroText, opacity: opacityHero }} className="flex-1 max-w-2xl">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <p className="text-brand font-medium tracking-wide uppercase mb-4 flex items-center gap-2">
                      <span className="w-8 h-[2px] bg-brand inline-block"></span>
                      Prince Shaji
                    </p>
                  </motion.div>
                  
                  <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-[1.1]"
                  >
                    AI/Solution Engineer <br />
                    <span className="text-text-secondary text-4xl md:text-6xl lg:text-7xl">&amp; Python Odoo Dev</span>
                  </motion.h1>

                  <motion.p 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl leading-relaxed"
                  >
                    4+ years of experience integrating AI models, building scalable ERP solutions, and automating business workflows. Based in Coimbatore, India.
                  </motion.p>

                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-wrap gap-4 items-center"
                  >
                    <button 
                      onClick={() => { playSound('click'); document.getElementById('projects').scrollIntoView({ behavior: 'smooth' }); }}
                      className="px-8 py-4 bg-brand text-white font-medium rounded-full hover:bg-brand-hover hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-brand/20"
                    >
                      View Work
                    </button>
                    <a 
                      href="/Prince_Shaji_Resume.pdf" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 bg-surface border border-border text-text-primary font-medium rounded-full hover:bg-surface-hover hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
                    >
                      <Download size={18} /> Resume
                    </a>
                  </motion.div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="w-64 h-64 md:w-96 md:h-96 relative shrink-0 mt-8 md:mt-0"
                >
                  <div className="absolute inset-0 bg-brand/20 rounded-full blur-3xl -z-10"></div>
                  <img 
                    src="/profile.jpg" 
                    alt="Prince Shaji" 
                    className="w-full h-full object-cover rounded-3xl border border-border shadow-[0_0_40px_rgba(220,38,38,0.15)] bg-surface"
                  />
                </motion.div>
              </div>
            </section>

            {/* ABOUT SECTION */}
            <section id="about" className="py-24 relative">
              <div className="container mx-auto px-6 max-w-6xl">
                <SectionHeading>About Me</SectionHeading>
                
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="space-y-6 text-lg text-text-secondary leading-relaxed"
                  >
                    <p>
                      I have a <span className="text-text-primary font-medium">strong foundation in Odoo ERP customization</span>, REST/XML-RPC integrations, and PostgreSQL database management. Over the years, I've designed custom modules for diverse domains including retail, healthcare, and fleet management.
                    </p>
                    <p>
                      Currently, I am deeply focused on a <span className="text-text-primary font-medium">growing specialization in LLMs, RAG pipelines, and conversational AI agents</span>. I build AI chatbots that seamlessly integrate with Odoo, enabling businesses to query their data naturally and automate complex workflows.
                    </p>
                    <p>
                      Whether it's building a Python/FastAPI backend, a React frontend, or managing OdooSH infrastructure, I focus on delivering end-to-end solutions that drive real business value.
                    </p>
                    <Terminal />
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                  >
                    <div className="aspect-square max-w-md mx-auto relative glass-panel overflow-hidden p-8 flex flex-col justify-center items-center group">
                      <div className="absolute inset-0 bg-gradient-to-tr from-brand/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <BrainCircuit className="w-32 h-32 text-brand/80 mb-6 group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />
                      <h3 className="text-2xl font-bold text-center text-text-primary mb-2">Bridging AI & ERP</h3>
                      <p className="text-center text-sm text-text-secondary">Transforming traditional business systems into intelligent, automated platforms.</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* SKILLS SECTION */}
            <section id="skills" className="py-24 bg-surface/30 relative">
              <div className="container mx-auto px-6 max-w-6xl">
                <SectionHeading align="center">Technical Arsenal</SectionHeading>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                  {SKILLS.map((skill, i) => (
                    <motion.div
                      key={skill.category}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="glass-panel p-6 hover:-translate-y-2 hover:shadow-xl hover:shadow-brand/5 hover:border-brand/30 transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-bg/50 border border-border flex items-center justify-center mb-6 group-hover:bg-brand/10 transition-colors">
                        {skill.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-text-primary">{skill.category}</h3>
                      <ul className="space-y-2">
                        {skill.items.map(item => (
                          <li key={item} className="text-text-secondary text-sm flex items-start gap-2">
                            <span className="text-brand mt-1 opacity-70">▹</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* EXPERIENCE TIMELINE SECTION */}
            <section id="experience" className="py-24 relative overflow-hidden">
              <div className="container mx-auto px-6 max-w-4xl relative">
                <SectionHeading>Experience</SectionHeading>
                
                <div className="relative mt-16">
                  {/* Timeline Line */}
                  <div className="absolute left-4 md:left-[50%] top-0 bottom-0 w-px bg-border transform md:-translate-x-1/2">
                    <motion.div 
                      className="absolute top-0 w-full bg-brand"
                      initial={{ height: 0 }}
                      whileInView={{ height: '100%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                  </div>

                  <div className="space-y-16">
                    {EXPERIENCE.map((exp, i) => {
                      const isEven = i % 2 === 0;
                      return (
                        <div key={exp.id} className="relative flex flex-col md:flex-row items-start justify-between w-full group">
                          
                          {/* Timeline Dot */}
                          <div className="absolute left-4 md:left-[50%] w-4 h-4 bg-bg border-2 border-brand rounded-full transform -translate-x-1/2 mt-1.5 z-10 group-hover:scale-150 transition-transform duration-300 shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
                          
                          {/* Left Side (Desktop) */}
                          <div className={`md:w-[45%] pl-12 md:pl-0 ${isEven ? 'md:text-right md:pr-12' : 'md:order-2 md:pl-12'}`}>
                            <motion.div
                              initial={{ opacity: 0, x: isEven ? -50 : 50, md: { x: isEven ? -50 : 50 }, sm: { x: 50 } }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true, margin: "-100px" }}
                              transition={{ duration: 0.6 }}
                            >
                              <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-1 group-hover:text-brand transition-colors">{exp.role}</h3>
                              <p className="text-brand font-medium mb-1">{exp.company}</p>
                              <p className="text-sm text-text-secondary mb-4">{exp.period}</p>
                              <ul className={`space-y-2 text-sm text-text-secondary ${isEven ? 'md:inline-block md:text-left' : ''}`}>
                                {exp.details.map((detail, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-brand opacity-70 mt-1 flex-shrink-0">▹</span>
                                    <span>{detail}</span>
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          </div>
                          
                          {/* Right Side Empty for Layout (Desktop) */}
                          <div className={`hidden md:block md:w-[45%] ${isEven ? 'md:order-2' : ''}`}></div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* PROJECTS SECTION */}
            <section id="projects" className="py-24 bg-surface/20 relative">
              <div className="container mx-auto px-6 max-w-6xl">
                <SectionHeading>Selected Work</SectionHeading>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12" style={{ perspective: "1000px" }}>
                  {PROJECTS.map((project, i) => (
                    <ProjectCard key={project.title} project={project} index={i} />
                  ))}
                </div>
              </div>
            </section>

            {/* EDUCATION & CERTIFICATIONS */}
            <section className="py-24 relative">
              <div className="container mx-auto px-6 max-w-6xl">
                <div className="grid lg:grid-cols-2 gap-16">
                  
                  {/* Education */}
                  <div>
                    <SectionHeading>Education</SectionHeading>
                    <div className="space-y-6 mt-12">
                      {EDUCATION.map((edu, i) => (
                        <motion.div 
                          key={edu.deg}
                          initial={{ opacity: 0, x: -30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                          className="glass-panel p-6 hover:bg-surface-hover transition-colors flex gap-4"
                        >
                          <div className="mt-1">
                            <GraduationCap className="text-brand w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-text-primary">{edu.deg}</h4>
                            <p className="text-text-secondary text-sm mt-1">{edu.inst}</p>
                            <p className="text-xs text-brand mt-2 font-medium">{edu.year}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <SectionHeading>Certifications</SectionHeading>
                    <div className="space-y-4 mt-12">
                      {CERTIFICATIONS.map((cert, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: 30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                          className="glass-panel p-5 flex items-center gap-4 hover:border-brand/30 transition-colors"
                        >
                          <Award className="text-brand w-5 h-5 flex-shrink-0" />
                          <span className="text-sm text-text-secondary font-medium">{cert}</span>
                        </motion.div>
                      ))}
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="mt-12 p-6 glass-panel border-brand/20"
                    >
                      <h4 className="text-text-primary font-bold mb-2 flex items-center gap-2">Languages</h4>
                      <p className="text-sm text-text-secondary">English, Malayalam, Tamil</p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </section>

            {/* CONTACT SECTION */}
            <section id="contact" className="py-24 relative bg-surface/10 border-t border-border">
              <div className="container mx-auto px-6 max-w-4xl text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="text-brand font-medium tracking-widest uppercase mb-4">What's Next?</p>
                  <h2 className="text-4xl md:text-6xl font-bold mb-6">Get In Touch</h2>
                  <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-12">
                    Whether you have a question about AI integration, need an ERP tailored to your business, or just want to say hi, I'll try my best to get back to you!
                  </p>
                </motion.div>

                <div className="glass-panel p-8 md:p-12 text-left max-w-3xl mx-auto relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-[80px] pointer-events-none" />
                  
                  <div className="grid md:grid-cols-2 gap-12">
                    <div>
                      <h3 className="text-2xl font-bold text-text-primary mb-6">Contact Info</h3>
                      <div className="space-y-6">
                        <button 
                          onClick={() => {
                            playSound('click');
                            const vcard = `BEGIN:VCARD\nVERSION:4.0\nN:Shaji;Prince;;;\nFN:Prince Shaji\nORG:Independent Consultant\nTITLE:AI/Solution Engineer & Python Odoo Developer\nROLE:Software Engineer\nTEL;TYPE=work,voice;VALUE=uri:tel:+918547515273\nEMAIL:princeshaji33@gmail.com\nURL:https://linkedin.com/in/prince-shaji-157848178\nNOTE:Expert in Python, Odoo ERP, and AI integrations (RAG/LLMs).\nX-SOCIALPROFILE;type=linkedin:https://linkedin.com/in/prince-shaji-157848178\nEND:VCARD`;
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
                        </button>
                        <a href="mailto:princeshaji33@gmail.com" className="flex items-center gap-4 text-text-secondary hover:text-brand transition-colors group">
                          <div className="w-12 h-12 rounded-full bg-bg border border-border flex items-center justify-center group-hover:border-brand/50 transition-colors">
                            <Mail size={20} />
                          </div>
                          <span>princeshaji33@gmail.com</span>
                        </a>
                        <a href="tel:+918547515273" className="flex items-center gap-4 text-text-secondary hover:text-brand transition-colors group">
                          <div className="w-12 h-12 rounded-full bg-bg border border-border flex items-center justify-center group-hover:border-brand/50 transition-colors">
                            <Phone size={20} />
                          </div>
                          <span>+91 8547515273</span>
                        </a>
                        <a href="https://linkedin.com/in/prince-shaji-157848178" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-text-secondary hover:text-brand transition-colors group">
                          <div className="w-12 h-12 rounded-full bg-bg border border-border flex items-center justify-center group-hover:border-brand/50 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                          </div>
                          <span>LinkedIn Profile</span>
                        </a>
                      </div>
                    </div>

                    <div>
                      <form className="space-y-4" onSubmit={async (e) => {
                        e.preventDefault();
                        const btn = e.currentTarget.querySelector('button[type="submit"]');
                        const originalText = btn.innerHTML;
                        btn.innerHTML = 'Sending...';
                        btn.disabled = true;

                        try {
                          await fetch("https://formsubmit.co/ajax/princeshaji33@gmail.com", {
                            method: "POST",
                            headers: { 
                              'Content-Type': 'application/json',
                              'Accept': 'application/json'
                            },
                            body: JSON.stringify({
                              name: e.target.name.value,
                              email: e.target.email.value,
                              message: e.target.message.value
                            })
                          });

                          btn.innerHTML = '✓ Message Sent!';
                          btn.classList.add('bg-green-500', 'text-white', 'border-green-500');
                          btn.classList.remove('bg-text-primary', 'text-bg', 'hover:bg-brand');
                          e.target.reset();
                          
                          setTimeout(() => {
                            btn.innerHTML = originalText;
                            btn.disabled = false;
                            btn.classList.remove('bg-green-500', 'text-white', 'border-green-500');
                            btn.classList.add('bg-text-primary', 'text-bg', 'hover:bg-brand');
                          }, 3000);
                        } catch (error) {
                          btn.innerHTML = 'Error! Try Again';
                          setTimeout(() => {
                            btn.innerHTML = originalText;
                            btn.disabled = false;
                          }, 3000);
                        }
                      }}>
                        <div>
                          <input 
                            name="name"
                            type="text" 
                            placeholder="Name" 
                            className="w-full bg-bg/50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all text-text-primary placeholder-text-secondary"
                            required
                          />
                        </div>
                        <div>
                          <input 
                            name="email"
                            type="email" 
                            placeholder="Email" 
                            className="w-full bg-bg/50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all text-text-primary placeholder-text-secondary"
                            required
                          />
                        </div>
                        <div>
                          <textarea 
                            name="message"
                            placeholder="Message" 
                            rows="4"
                            className="w-full bg-bg/50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all text-text-primary placeholder-text-secondary resize-none"
                            required
                          ></textarea>
                        </div>
                        <button type="submit" className="w-full bg-text-primary text-bg hover:bg-brand hover:text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300">
                          Send Message
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* Footer */}
          <footer className="py-8 border-t border-border/50 text-center text-sm text-text-secondary">
            <p>Designed & Built with <span className="text-brand">♥</span></p>
            <p className="mt-2 text-xs opacity-50">© {new Date().getFullYear()} Prince Shaji. All rights reserved.</p>
          </footer>
        </>
      )}
    </div>
  );
}
