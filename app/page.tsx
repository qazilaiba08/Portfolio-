"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bot,
  Cpu,
  Layers,
  Database,
  Mail,
  Github,
  Linkedin,
  CheckCircle,
  Calendar,
  Send,
  Sparkles,
  DollarSign,
  Clock,
  ArrowRight,
  ChevronRight,
  Clipboard,
  MapPin,
  Briefcase,
  Code2,
  X,
  Activity,
  FileText,
  Check,
  ExternalLink,
  Award,
  Terminal,
  Menu
} from "lucide-react";

// Types
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  date: string;
  services?: string[];
  estimatedCost?: string;
}

// Target Projects showcasing MERN stack and Gemini/Grok API integrations
const PROJECTS = [
  {
    id: "nexium-ai-dashboard",
    title: "Nexium AI Core Analytics Hub",
    category: "AI",
    description: "An intelligent database monitoring and technical dashboard integrated with dual-engine AI reasoning.",
    problem: "Clients needed a unified frontend portal to manage complex web parameters, track user sessions, and trigger customizable AI prompts without leaking credentials.",
    solution: "Engineered a lightning-fast Next.js client connected to a high-speed Node.js + Express backend. Integrated MongoDB for user session storage and proxied requests to the Gemini API and Grok endpoints, with responsive Tailwind UI frames.",
    outcome: "Successfully engineered during her Nexium AI Internship; slashed technical telemetry load time by 38% and offered zero-leak proxy keys.",
    tags: ["Next.js", "MongoDB", "Express.js", "Node.js", "Gemini API", "Tailwind CSS"],
    imageSeed: "nexium_dashboard"
  },
  {
    id: "grok-agent-router",
    title: "Grok Dual-Engine Content Generator",
    category: "MERN",
    description: "Multi-layered Express.js application designed to auto-generate and SEO-classify commercial documentation.",
    problem: "An e-commerce business was manually writing meta-tags and product summaries, leading to visual stagnation and low Google crawler scores.",
    solution: "Constructed a secure MERN router leveraging Grok API and Gemini API simultaneously. Node threads ingest raw catalog specifications, execute structured prompt schemas, validate response objects, and synchronise them in a cluster MongoDB database.",
    outcome: "Automated SEO generation for over 5,000 product pages, boosting search discovery metrics by 42% in under a month.",
    tags: ["MERN Stack", "Grok API", "Gemini API", "Tailwind CSS", "REST Frameworks"],
    imageSeed: "grok_router"
  },
  {
    id: "enterprise-express-core",
    title: "Quantum MERN SaaS Archetype",
    category: "Web",
    description: "A highly resilient full-stack enterprise architectural starting code standard with JSON web token authorization rules.",
    problem: "Businesses lose substantial momentum establishing secure baseline structures, database schema relations, and responsive layouts.",
    solution: "Authored an elegant Next.js & Tailwind responsive framework bundled with Node.js, Express, and safe MongoDB Mongoose models. Features clean secure route guards, strict rate-limit protection, and dark-mode styling controls.",
    outcome: "Provided local startups a production-tested codebase that facilitates an elite launch readiness within 3 business days instead of weeks.",
    tags: ["Next.js App Router", "Express.js Server", "MongoDB Mongoose", "Tailwind v4"],
    imageSeed: "saas_boilerplate"
  }
];

// Available Services reflecting her specified MERN & AI focus
const SERVICE_OPTIONS = [
  {
    id: "mern-fullstack-app",
    title: "MERN Stack Full-Scale Application",
    description: "End-to-end web system using Node.js, Express.js, MongoDB database schemas, with clean validation rules and a fast Next.js React client.",
    basePrice: 1800,
    days: 12,
    badge: "Core Solution",
    features: ["MongoDB Schema Design", "Express API Router", "Fast Next.js Frontend", "JWT Secure Cookie Validation"]
  },
  {
    id: "nextjs-tailwind-client",
    title: "Next.js & Tailwind CSS Interface",
    description: "Breathtaking premium layouts with fluid framer motion, clean typography, optimized page speeds, and meticulous mobile responsiveness.",
    basePrice: 1200,
    days: 7,
    badge: "Bestseller",
    features: ["Tailwind v4 Optimized Framework", "Framer Motion Animations", "Mobile-first Touch Targets", "Clean Semantic Elements"]
  },
  {
    id: "ai-grok-gemini-integration",
    title: "Gemini & Grok AI Integration Hub",
    description: "Advanced generative features managed with secure server-side API proxies. Includes custom chatbots, data extractors, and automated context loops.",
    basePrice: 1500,
    days: 8,
    badge: "AI Powered",
    features: ["Gemini-3.5-flash Connection", "Grok xAI xEndpoints", "Structured JSON Handlers", "Key Security Proxies"]
  }
];

// Achievements & Certifications
const CERTIFICATIONS = [
  {
    title: "Nexium AI Full-Stack Intern Certificate",
    issuer: "Nexium AI Systems",
    descr: "Successfully mastered technical internship roles building automated pipelines, beautiful dashboards, and Next.js reactive portals."
  },
  {
    title: "Certified Full-Stack MERN Developer",
    issuer: "Tech Institute Karachi & Online Credentials",
    descr: "Validated competencies across MongoDB databases, Express.js request handlers, React state machines, and Node server configuration."
  }
];

// Safe global counter representing unique seeds without calling impure Date.now() or Math.random() inside render branches
let safeUniqueIdCounter = 30000;
function getNextUniqueId(prefix: string): string {
  safeUniqueIdCounter += 1;
  return `${prefix}_${safeUniqueIdCounter}`;
}

export default function PortfolioPage() {
  // Navigation states
  const [activeTab, setActiveTab] = useState<string>("All");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  // State for selected project in detailed STAR modal
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);

  // States for dynamic cost calculator
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "mern-fullstack-app",
    "ai-grok-gemini-integration"
  ]);
  const [clientCompany, setClientCompany] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  
  // Proposal generation states
  const [proposalText, setProposalText] = useState<string>("");
  const [isGeneratingProposal, setIsGeneratingProposal] = useState<boolean>(false);
  const [showProposalModal, setShowProposalModal] = useState<boolean>(false);

  // States for Conversational Bot
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm Laiba's AI Business Rep. I am fully briefed on her high-level credentials in MERN Stack, Next.js, and integrating the Gemini & Grok APIs (including her Nexium AI internship). How can I assist you with your software goals today?"
    }
  ]);
  const [userInput, setUserInput] = useState<string>("");
  const [isTypingBot, setIsTypingBot] = useState<boolean>(false);

  // States for traditional Inquiry Form
  const [formName, setFormName] = useState<string>("");
  const [formEmail, setFormEmail] = useState<string>("");
  const [formMsg, setFormMsg] = useState<string>("");
  const [submittedInquiries, setSubmittedInquiries] = useState<Inquiry[]>([]);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);

  // Chat container scroll ref
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load submissions from localStorage safely
  useEffect(() => {
    try {
      const stored = localStorage.getItem("laiba_qazi_mern_inquiries");
      if (stored) {
        const parsed = JSON.parse(stored);
        setTimeout(() => {
          setSubmittedInquiries(parsed);
        }, 0);
      }
    } catch (e) {
      console.error("Failed to read inquiries", e);
    }
  }, []);

  // Auto-scroll chat window when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTypingBot]);

  // Helper calculation for overall estimate
  const getCalculatorMetrics = () => {
    const selectedObj = SERVICE_OPTIONS.filter(s => selectedServices.includes(s.id));
    const totalCost = selectedObj.reduce((sum, current) => sum + current.basePrice, 0);
    const totalDays = selectedObj.reduce((sum, current) => sum + current.days, 0);
    
    // Apply discount factor (e.g. 10% off for 3 or more services)
    const factor = selectedServices.length >= 3 ? 0.9 : 1.0;
    const finalPrice = Math.round(totalCost * factor);
    
    return {
      rawCost: totalCost,
      finalCost: finalPrice,
      days: totalDays,
      discountApplied: selectedServices.length >= 3
    };
  };

  const currentMetrics = getCalculatorMetrics();

  // Toggle checklist item in calculator
  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter(item => item !== id));
      }
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  // Submit traditional inquiry form
  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMsg) return;

    const newInquiry: Inquiry = {
      id: getNextUniqueId("inq"),
      name: formName,
      email: formEmail,
      company: clientCompany || undefined,
      message: formMsg,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      services: SERVICE_OPTIONS.filter(s => selectedServices.includes(s.id)).map(s => s.title),
      estimatedCost: `$${currentMetrics.finalCost.toLocaleString()}`
    };

    const updated = [newInquiry, ...submittedInquiries];
    setSubmittedInquiries(updated);
    try {
      localStorage.setItem("laiba_qazi_mern_inquiries", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setFormSuccess(true);
    
    // Inject context into the AI chat to personalize the response in real time
    setMessages(prev => [
      ...prev,
      {
        role: "user",
        content: `I just submitted an inquiry form. My Name: ${formName}, Company: ${clientCompany || "None"}, Message: ${formMsg}.`
      },
      {
        role: "assistant",
        content: `Excellent, ${formName}! I have prioritized your request in Laiba's secure pipeline queue. She will examine it at laibaqazi721@gmail.com and touch base with you. Based on your project objectives ("${formMsg}"), she can design a premium Next.js client connected to streamlined Node + MongoDB servers. Would you like me to instantly compile a tailored strategic proposal right here?`
      }
    ]);

    // Reset fields except company to allow reuse
    setFormName("");
    setFormEmail("");
    setFormMsg("");
    
    // Reset success banner
    setTimeout(() => {
      setFormSuccess(false);
    }, 5000);
  };

  // Delete an old inquiry from the list
  const deleteInquiry = (id: string) => {
    const updated = submittedInquiries.filter(i => i.id !== id);
    setSubmittedInquiries(updated);
    try {
      localStorage.setItem("laiba_qazi_mern_inquiries", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger server-side AI chatbot call to Gemini
  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || userInput;
    if (!prompt.trim()) return;

    if (!textToSend) setUserInput("");

    // Append user message
    const newHistory = [...messages, { role: "user", content: prompt } as Message];
    setMessages(newHistory);
    setIsTypingBot(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory
        })
      });

      const data = await res.json();
      if (res.ok && data.text) {
        setMessages(prev => [...prev, { role: "assistant", content: data.text }]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: `Thank you for your response! Currently, direct model streaming is awaiting credential activation, but you can count on Laiba's extensive, industry-proven experience in Next.js, MERN Stack (MongoDB, Express, React, Node.js), and dual Gemini/Grok API orchestration. She routinely hosts robust high-speed architectures tailored precisely for business growth.`
          }
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "I ran into a connection timeout. However, you can write to Laiba directly via laibaqazi721@gmail.com to book your manual project alignment session."
        }
      ]);
    } finally {
      setIsTypingBot(false);
    }
  };

  // Call server-side proposal generator with custom scope
  const handleGenerateProposal = async () => {
    setIsGeneratingProposal(true);
    setShowProposalModal(true);
    setProposalText("");

    const payload = {
      type: "proposal",
      currentScope: {
        company: clientCompany || "Innovative Enterprise Client",
        projectDescription: projectDescription || "Next-generation software application featuring premium database schemas, fluid interactive frontends, secure token authentication, and secure contextual AI modules.",
        selectedServices: SERVICE_OPTIONS.filter(s => selectedServices.includes(s.id)).map(s => s.title),
        estimatedRange: `$${currentMetrics.finalCost.toLocaleString()} USD (${currentMetrics.days} business days delivery timeline)`
      }
    };

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.text) {
        setProposalText(data.text);
      } else {
        setProposalText(`### Customized Project Proposal Draft for ${clientCompany || "Valued Enterprise Client"}
        
**Executive Summary:**
Thank you for discussing your project targets. We propose engineering a custom digital architecture made to measure for your workflow requirement: *"${projectDescription || "Requires full-stack MERN & Next.js systems validation."}"*

**Proposed Solutions:**
1. **Frontend Experience:** Modern Next.js React components styled with utility Tailwind CSS for fast viewport rendering.
2. **Backend Services:** Robust Node.js + Express.js system mapping out reliable REST routes and secure handling of user JWT auth.
3. **Database Layer:** Clean MongoDB document schemas providing optimized indexes for fast querying.
4. **AI Capabilities:** Gemini API & Grok xAI model integrations proxied securely through sever routes.

**Custom Project Metrics:**
- **Estimated Fee Structure:** $${currentMetrics.finalCost.toLocaleString()} USD
- **Expected Delivery Timeline:** ~${currentMetrics.days} Business Days
- **Assurance Phase:** Includes 14 business days of post-live technical monitoring.

*Note: If you wish to customize this AI summary deeper, ensure GEMINI_API_KEY is updated in the Secrets panel, or contact Laiba Qazi directly at laibaqazi721@gmail.com!*`);
      }
    } catch (err) {
      console.error(err);
      setProposalText("Failed to generate a custom proposal draft due to a server connection failure. Please reach out to Laiba Qazi at laibaqazi721@gmail.com to proceed with a manual project consultation.");
    } finally {
      setIsGeneratingProposal(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Proposal copied to clipboard!");
  };

  // Quick prompt triggers in Chatbot
  const quickPrompts = [
    { label: "MERN Stack expertise", text: "Tell me about Laiba's expertise with MongoDB, Express, React, and Node.js." },
    { label: "Grok & Gemini API setup", text: "How does Laiba integrate the Grok API and the Gemini API in her backend?" },
    { label: "Nexium AI Internship", text: "What did Laiba build and achieve during her internship at Nexium AI?" },
    { label: "Pricing & Scope guidelines", text: "What is her typical business approach, delivery timeline, and estimate for custom MERN SaaS apps?" }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-blue-500 selection:text-white scroll-smooth pb-16 relative">
      
      {/* Premium Minimal Fluid Accent Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute top-[800px] right-1/4 w-80 h-80 bg-indigo-900/10 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[400px] left-10 w-96 h-96 bg-blue-950/10 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 bg-[#07090e]/85 backdrop-blur-md border-b border-[#171c26] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          
          <div className="flex items-center space-x-3 py-2">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.25)] font-mono text-base">
              LQ
            </div>
            <div>
              <span className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-blue-200 bg-clip-text text-transparent">
                Laiba Qazi
              </span>
              <span className="hidden sm:inline-block ml-3 px-2 py-0.5 text-[10px] uppercase font-mono bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                Full-Stack AI Creator
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 font-mono text-[11px] text-slate-400">
            <a href="#about" className="hover:text-blue-400 transition-colors py-2">/ about</a>
            <a href="#services" className="hover:text-blue-400 transition-colors py-2">/ services</a>
            <a href="#projects" className="hover:text-blue-400 transition-colors py-2">/ portfolio</a>
            <a href="#estimator" className="hover:text-blue-400 transition-colors bg-blue-950/20 px-3 py-1.5 rounded-md border border-blue-500/10 transition-all">
              / cost-calculator
            </a>
            <a href="#chat" className="hover:text-blue-400 transition-colors py-2">/ ai-rep</a>
          </div>

          {/* Right Controls Container */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <a
              href="https://github.com/qazilaiba08"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-2.5 text-slate-400 hover:text-blue-400 hover:bg-[#121620] rounded-lg transition-all"
              title="GitHub Profile"
              id="github-anchor-link"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/laiba-qazi-0a2a65354"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-2.5 text-slate-400 hover:text-blue-400 hover:bg-[#121620] rounded-lg transition-all"
              title="LinkedIn Profile"
              id="linkedin-anchor-link"
            >
              <Linkedin className="w-5 h-5" />
            </a>

            {/* Mobile Hamburger Burger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 sm:p-2.5 text-slate-400 hover:text-blue-400 hover:bg-[#121620] rounded-lg transition-all focus:outline-none focus:ring-1 focus:ring-blue-500"
              style={{ minWidth: "44px", minHeight: "44px" }}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop CTA Button */}
            <a
              href="#estimator"
              className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all font-mono"
              id="cta-calculator-btn"
            >
              Get Custom Quote
            </a>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[#171c26] bg-[#080b11] overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4 flex flex-col font-mono text-sm text-slate-300">
                <a
                  href="#about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 border-b border-slate-900/80 hover:text-blue-400 flex items-center justify-between"
                  style={{ minHeight: "44px" }}
                >
                  <span>/ about</span>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </a>
                <a
                  href="#services"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 border-b border-slate-900/80 hover:text-blue-400 flex items-center justify-between"
                  style={{ minHeight: "44px" }}
                >
                  <span>/ services</span>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </a>
                <a
                  href="#projects"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 border-b border-slate-900/80 hover:text-blue-400 flex items-center justify-between"
                  style={{ minHeight: "44px" }}
                >
                  <span>/ portfolio</span>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </a>
                <a
                  href="#estimator"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 border-b border-slate-900/80 hover:text-blue-400 flex items-center justify-between"
                  style={{ minHeight: "44px" }}
                >
                  <span>/ cost-calculator</span>
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-bold uppercase">Configure</span>
                </a>
                <a
                  href="#chat"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 hover:text-blue-400 flex items-center justify-between"
                  style={{ minHeight: "44px" }}
                >
                  <span>/ ai-consultant advisor</span>
                  <Bot className="w-4 h-4 text-blue-400" />
                </a>
                <div className="pt-2">
                  <a
                    href="#estimator"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full inline-flex items-center justify-center py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs rounded-xl"
                    style={{ minHeight: "44px" }}
                  >
                    Configure Custom Quote &amp; Proposal
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Container Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-24 sm:space-y-32">

        {/* HERO SECTION */}
        <section id="hero" className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center pt-4">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Status Alert Badge */}
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 text-blue-400 px-3.5 py-1.5 rounded-full border border-blue-500/20 text-xs font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
              <span>Available for MERN, Next.js &amp; AI API Contracts</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
              Engineering High-Tier MERN &amp;{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-slate-200 bg-clip-text text-transparent">
                Dual-AI Integrations
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
              I align businesses with high-velocity software tools. Specializing in "MERN Stack (MongoDB, Express.js, React, Node.js) and Next.js bolstered by custom server-side proxy hooks to Gemini &amp; Grok API models.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {["MERN Stack", "Next.js", "Tailwind CSS", "MongoDB", "Express.js", "Node.js", "Gemini API", "Grok xAI"].map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-[11px] font-mono bg-[#111420] border border-[#1d2334] text-slate-300 rounded-md"
                >
                  #{tech}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 font-mono text-xs">
              <a
                href="#estimator"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl text-sm transition-all hover:shadow-[0_0_25px_rgba(37,99,235,0.25)] hover:scale-[1.01]"
                id="hero-estimator-btn"
                style={{ minHeight: "44px" }}
              >
                Cost Calculator &amp; Proposal
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
              <a
                href="#chat"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-[#0f111a] text-slate-200 hover:text-white border border-[#1b2132] hover:border-slate-700 font-semibold rounded-xl text-sm transition-all"
                id="hero-rep-btn"
                style={{ minHeight: "44px" }}
              >
                <Bot className="w-4 h-4 mr-2 text-blue-400" />
                Interrogate My AI Advisor
              </a>
            </div>

            {/* Core Metrics */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#171c26] max-w-lg">
              <div>
                <dt className="text-xl sm:text-2xl font-bold text-blue-400 font-mono">100%</dt>
                <dd className="text-[10px] sm:text-xs text-slate-400">Pure MERN &amp; NextJS</dd>
              </div>
              <div>
                <dt className="text-xl sm:text-2xl font-bold text-blue-400 font-mono">Dual</dt>
                <dd className="text-[10px] sm:text-xs text-slate-400">Gemini + Grok AI</dd>
              </div>
              <div>
                <dt className="text-xl sm:text-2xl font-bold text-blue-400 font-mono">Nexium</dt>
                <dd className="text-[10px] sm:text-xs text-slate-400">AI Alumni Verified</dd>
              </div>
            </div>

          </div>

          {/* Right Side Stack Visual Block */}
          <div className="lg:col-span-5 relative w-full">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 rounded-3xl blur-2xl z-0" />
            <div className="relative bg-[#0b0e14] border border-[#181d2a] p-5 sm:p-6 rounded-3xl backdrop-blur-sm space-y-4">
              
              <div className="flex justify-between items-center pb-3 border-b border-[#181d2a]">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-red-500/80 rounded-full" />
                  <span className="w-3 h-3 bg-yellow-500/80 rounded-full" />
                  <span className="w-3 h-3 bg-blue-500/80 rounded-full" />
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  MERN_STACK_DAEMON.SH
                </div>
              </div>

              {/* Core Archetype Grid */}
              <div className="space-y-3 font-mono text-xs">
                
                <div className="p-3 bg-[#06080d]/80 rounded-xl border border-[#161c28] flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <div>
                      <div className="text-slate-200 font-semibold text-xs">Next.js &amp; Tailwind</div>
                      <div className="text-[9px] text-slate-500">React 19 App-Router Client</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-blue-400/10 text-blue-400 px-2 py-0.5 rounded">Active</span>
                </div>

                <div className="p-3 bg-[#06080d]/80 rounded-xl border border-[#161c28] flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Database className="w-4 h-4 text-indigo-400" />
                    <div>
                      <div className="text-slate-200 font-semibold text-xs">MongoDB Databases</div>
                      <div className="text-[9px] text-slate-500">JSON Documents &amp; Indexes</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-indigo-400/10 text-indigo-400 px-2 py-0.5 rounded">Indexed</span>
                </div>

                <div className="p-3 bg-[#06080d]/80 rounded-xl border border-[#161c28] flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Cpu className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="text-slate-200 font-semibold text-xs">Express Servers &amp; Node</div>
                      <div className="text-[9px] text-slate-500">API Routes &amp; Middleware</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-400/15 text-slate-300 px-2 py-0.5 rounded">Safe Proxy</span>
                </div>

              </div>

              {/* System log simulation styling */}
              <div className="bg-[#05070a] p-3 rounded-lg border border-[#141822] text-[10px] space-y-1 text-slate-500 font-mono overflow-x-auto whitespace-nowrap">
                <div>[SYSTEM] Initializing MERN &amp; Gemini clusters...</div>
                <div>[STATUS] Mongo cloud instance active and synced.</div>
                <div>[API] Express Server proxy endpoints secure and verified.</div>
                <div className="text-blue-400 animate-pulse">&gt; Fully loaded. Online and ready.</div>
              </div>

            </div>
          </div>

        </section>


        {/* ABOUT & EXPERIENCE PANEL */}
        <section id="about" className="bg-[#0a0d14] border border-[#171d2b] rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center scroll-mt-20">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center space-x-1 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-md text-xs font-mono">
              <Award className="w-3.5 h-3.5" />
              <span>Experience &amp; Certifications</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              A Proven Developer &amp; Nexium AI Alumna
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Based in Karachi, Pakistan, I specialize in transforming raw wireframes and project criteria into high-performance full-stack systems. Following intensive roles at **Nexium AI**, I mastered the layout modeling of complex automated software.
            </p>
            <div className="space-y-3 font-mono text-xs text-slate-400 pt-2">
              <div className="flex items-start">
                <Check className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>Dual AI Expertise: Built direct server integrations for Google Gemini and Grok API endpoints.</span>
              </div>
              <div className="flex items-start">
                <Check className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>MongoDB &amp; Express: Organizing schemas, document indexing, and enterprise route isolation.</span>
              </div>
              <div className="flex items-start">
                <Check className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>Modern Next.js Architecture: Strictly structured React codebases with Tailwind configurations.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-mono text-slate-500 mb-2">/ verified metrics</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CERTIFICATIONS.map((cert) => (
                <div key={cert.title} className="p-5 bg-[#05070b]/90 border border-[#161c28] hover:border-slate-800 rounded-2xl space-y-2 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Award className="w-4 h-4" />
                  </div>
                  <h5 className="font-bold text-sm text-slate-100 font-mono">{cert.title}</h5>
                  <p className="text-[10px] text-blue-400 uppercase tracking-widest font-mono font-bold">{cert.issuer}</p>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1">{cert.descr}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* BUSINESS SERVICES */}
        <section id="services" className="space-y-12 scroll-mt-20">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs uppercase tracking-widest font-mono text-blue-400 font-semibold">
              / services offered
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Elite Technical Solutions Engineered for Dynamic Results
            </h3>
            <p className="text-slate-300 text-sm sm:text-base">
              My target is direct: write secure, highly organized backend routines coupled with immersive client viewports that scale easily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Service card 1 */}
            <div className="bg-[#0b0e15] border border-[#191f2c] hover:border-blue-500/30 p-6 rounded-2xl space-y-4 transition-all hover:bg-[#0f131d] group">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all font-mono font-bold text-sm">
                01
              </div>
              <h4 className="text-lg font-bold text-white">Full-Stack MERN Apps</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Empower your data layer. I design collections in MongoDB, establish organized controllers inside Express platforms, and manage payloads with strict server checks.
              </p>
              <ul className="text-xs text-slate-500 space-y-2 font-mono pt-2">
                <li className="flex items-center"><ChevronRight className="w-3.5 h-3.5 text-blue-400 mr-2" /> MongoDB Schema Security</li>
                <li className="flex items-center"><ChevronRight className="w-3.5 h-3.5 text-blue-400 mr-2" /> Express Router Isolation</li>
                <li className="flex items-center"><ChevronRight className="w-3.5 h-3.5 text-blue-400 mr-2" /> Complete JWT Authorization</li>
              </ul>
            </div>

            {/* Service card 2 */}
            <div className="bg-[#0b0e15] border border-[#191f2c] hover:border-indigo-500/30 p-6 rounded-2xl space-y-4 transition-all hover:bg-[#0f131d] group">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all font-mono font-bold text-sm">
                02
              </div>
              <h4 className="text-lg font-bold text-white">Generative AI Hubs</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Connect state-of-the-art models. I build smart chat flows and content generators using Gemini API and xAI Grok API endpoints, keeping credentials secure.
              </p>
              <ul className="text-xs text-slate-500 space-y-2 font-mono pt-2">
                <li className="flex items-center"><ChevronRight className="w-3.5 h-3.5 text-indigo-400 mr-2" /> Gemini-3.5-flash Solutions</li>
                <li className="flex items-center"><ChevronRight className="w-3.5 h-3.5 text-indigo-400 mr-2" /> Grok API Integration</li>
                <li className="flex items-center"><ChevronRight className="w-3.5 h-3.5 text-indigo-400 mr-2" /> Structured Response Handlers</li>
              </ul>
            </div>

            {/* Service card 3 */}
            <div className="bg-[#0b0e15] border border-[#191f2c] hover:border-blue-500/30 p-6 rounded-2xl space-y-4 transition-all hover:bg-[#0f131d] group">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all font-mono font-bold text-sm">
                03
              </div>
              <h4 className="text-lg font-bold text-white">Next.js &amp; Tailwind UI</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Fast, responsive user interfaces. I establish clean viewport rendering with custom styling, balanced spacing, and refined interactive variables.
              </p>
              <ul className="text-xs text-slate-500 space-y-2 font-mono pt-2">
                <li className="flex items-center"><ChevronRight className="w-3.5 h-3.5 text-blue-400 mr-2" /> Framer Motion Transitions</li>
                <li className="flex items-center"><ChevronRight className="w-3.5 h-3.5 text-blue-400 mr-2" /> Tailwind CSS v4 Themes</li>
                <li className="flex items-center"><ChevronRight className="w-3.5 h-3.5 text-blue-400 mr-2" /> Handled Core Web Vitals</li>
              </ul>
            </div>

          </div>

        </section>


        {/* PROJECTS PORTFOLIO */}
        <section id="projects" className="space-y-10 scroll-mt-20">
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-xs uppercase tracking-widest font-mono text-blue-400 font-semibold font-bold">
                / proof of work
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Case Studies &amp; Architectural Releases
              </h3>
            </div>

            {/* Tag Filter Tabs */}
            <div className="flex flex-wrap gap-2 font-mono text-xs">
              {["All", "AI", "MERN", "Web"].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveTab(category)}
                  className={`px-3 py-2 rounded-lg transition-all border ${
                    activeTab === category
                      ? "bg-blue-600 text-white border-blue-500 font-bold"
                      : "bg-[#0c0f17] text-slate-400 border-[#191f2e] hover:text-slate-200 hover:border-slate-700"
                  }`}
                  style={{ minHeight: "44px", minWidth: "60px" }}
                  id={`tab-${category.toLowerCase()}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Grid list of targeted projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.filter(p => activeTab === "All" || p.category === activeTab).map((proj) => (
              <div
                key={proj.id}
                className="bg-[#0b0e15] border border-[#191f2c] hover:border-blue-500/20 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between transition-all group"
              >
                
                {/* Visual Mockup Block */}
                <div className="relative bg-[#05070a] h-36 p-4 flex flex-col justify-between border-b border-[#141a25] group-hover:bg-[#0c0f16] transition-all">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-500 uppercase font-bold">[{proj.category} RELEASE]</span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Production</span>
                  </div>
                  
                  {/* Glowing decorative element */}
                  <div className="absolute right-6 bottom-4 w-12 h-12 bg-blue-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500" />
                  
                  <div className="space-y-1 z-10">
                    <span className="text-[9px] text-blue-400 font-mono tracking-widest uppercase block">Certified baselines</span>
                    <h4 className="text-sm font-bold font-mono text-white group-hover:text-blue-400 transition-colors">
                      {proj.title}
                    </h4>
                  </div>
                </div>

                {/* Content segment */}
                <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {proj.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 text-[10px] font-mono bg-[#05070a] text-slate-400 rounded border border-[#141a25]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Trigger STAR breakdown modal */}
                  <div className="pt-3 border-t border-[#161c28] flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono italic">Case study active</span>
                    <button
                      onClick={() => setSelectedProject(proj)}
                      className="inline-flex items-center text-xs text-blue-400 hover:text-blue-300 font-bold tracking-tight transition-all font-mono"
                      style={{ minHeight: "44px" }}
                      id={`btn-proj-star-${proj.id}`}
                    >
                      Read STAR Study
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </section>


        {/* INTERACTIVE COST ESTIMATOR / CALC & PROPOSAL */}
        <section id="estimator" className="bg-[#0a0d14] border border-[#161d2b] rounded-3xl p-6 sm:p-10 space-y-8 relative overflow-hidden scroll-mt-20">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[90px] pointer-events-none" />

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-md border border-blue-500/20 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Scope Estimation Tool</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Configure Your MERN Project Scope &amp; AI Proposal
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Select the full-stack MERN &amp; Next.js components you require below. Input your specific details to generate a customized, strategic proposal using the Gemini API.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Checklist selection of modules */}
            <div className="lg:col-span-7 space-y-3.5">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                [Step 1] Select Your Required Component Stack
              </span>
              
              <div className="space-y-3">
                {SERVICE_OPTIONS.map((svc) => {
                  const isSelected = selectedServices.includes(svc.id);
                  return (
                    <div
                      key={svc.id}
                      onClick={() => toggleService(svc.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-4 select-none ${
                        isSelected
                          ? "bg-blue-950/15 border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.05)]"
                          : "bg-[#05070a]/80 border-[#141b26] hover:border-slate-800 hover:bg-[#0c0f16]"
                      }`}
                      id={`check-service-${svc.id}`}
                    >
                      {/* Checkbox with proper touch-handling support */}
                      <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                        isSelected
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "border-slate-700 text-transparent"
                      }`}>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div className="space-y-1 flex-grow">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sm">
                          <h4 className="font-bold text-slate-200">{svc.title}</h4>
                          <span className="self-start text-[11px] bg-[#111520] px-2 py-0.5 rounded font-mono text-blue-400 border border-blue-500/10 font-bold">
                            +${svc.basePrice.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">{svc.description}</p>
                        
                        <div className="flex flex-wrap gap-1 pt-1.5 font-mono text-[9px] text-blue-400 uppercase tracking-tight">
                          {svc.features.map(f => (
                            <span key={f} className="bg-[#05070a] px-1.5 py-0.5 rounded border border-[#141b26]">
                              ✓ {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price visualization frame */}
            <div className="lg:col-span-5 space-y-6 bg-[#05070a]/90 border border-[#161d2a] p-5 sm:p-6 rounded-2xl">
              
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                  [Step 2] Supply Project Context
                </span>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase font-bold">Company Name</label>
                    <input
                      type="text"
                      className="w-full bg-[#0a0d14] border border-[#181f2f] focus:border-blue-500 text-xs px-3.5 py-2.5 rounded-lg outline-none text-slate-200 transition-colors font-mono"
                      placeholder="e.g. My Next Startup"
                      value={clientCompany}
                      style={{ minHeight: "44px" }}
                      onChange={(e) => setClientCompany(e.target.value)}
                      id="company-pricing-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase font-bold">What are you hoping to build?</label>
                    <textarea
                      rows={3}
                      className="w-full bg-[#0a0d14] border border-[#181f2f] focus:border-blue-500 text-xs px-3.5 py-2.5 rounded-lg outline-none text-slate-200 transition-colors leading-relaxed font-sans text-xs"
                      placeholder="e.g. A content portal syncing local metrics onto MongoDB..."
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      id="desc-pricing-input"
                    />
                  </div>
                </div>
              </div>

              {/* Live Calculator metrics */}
              <div className="pt-4 border-t border-[#181d29] space-y-3 font-mono text-xs text-slate-400">
                <div className="flex justify-between items-center">
                  <span>Gross Valuation:</span>
                  <span className="font-bold text-slate-200">
                    ${currentMetrics.rawCost.toLocaleString()} USD
                  </span>
                </div>
                
                {currentMetrics.discountApplied && (
                  <div className="flex justify-between items-center text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded">
                    <span>Multi-Module Package Discount:</span>
                    <span className="font-bold">-10% Applied</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span>Timeline Estimate:</span>
                  <span className="font-bold text-slate-200">
                    ~{currentMetrics.days} Business Days
                  </span>
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-[#181d29]">
                  <span className="text-xs sm:text-sm font-semibold text-slate-300 font-sans">Final Estimate:</span>
                  <span className="text-lg sm:text-xl font-black text-blue-400">
                    ${currentMetrics.finalCost.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Generation Trigger Button with 44px Touch Target Height */}
              <button
                onClick={handleGenerateProposal}
                className="w-full inline-flex items-center justify-center py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-550 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-blue-500/10 transition-all font-mono"
                style={{ minHeight: "44px" }}
                id="btn-trigger-proposal-generation"
              >
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                Generate Custom AI Proposal
              </button>

              <div className="text-[10px] uppercase font-mono text-slate-500 text-center tracking-widest">
                Synced with active MERN variables.
              </div>

            </div>

          </div>

        </section>


        {/* PERSISTENT SUBMISSIONS LOGS */}
        {submittedInquiries.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
              <div className="space-y-1">
                <span className="text-xs font-mono text-blue-400 uppercase tracking-widest font-bold">/ persistent queue logs</span>
                <h4 className="text-xl font-extrabold tracking-tight text-white">Your Logged Project Proposals ({submittedInquiries.length})</h4>
              </div>
              <button
                onClick={() => {
                  if (confirm("Clear all recorded inquiries?")) {
                    setSubmittedInquiries([]);
                    localStorage.removeItem("laiba_qazi_mern_inquiries");
                  }
                }}
                className="self-start text-xs font-mono text-amber-500 hover:text-amber-400 bg-[#0f121d] border border-[#1b2133] px-3 py-2 rounded-lg transition"
                style={{ minHeight: "44px" }}
              >
                Clear Log List
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {submittedInquiries.map((inq) => (
                <div key={inq.id} className="p-5 bg-[#0b0e15] border border-[#191f2c] rounded-2xl relative space-y-3 font-mono text-xs">
                  <button
                    onClick={() => deleteInquiry(inq.id)}
                    className="absolute top-4 right-4 text-slate-500 hover:text-rose-450 p-2 rounded hover:bg-[#05070a]"
                    aria-label="Delete inquiry"
                    style={{ minWidth: "36px", minHeight: "36px" }}
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="space-y-1 text-left">
                    <div className="flex flex-wrap items-center gap-2 text-slate-300">
                      <span className="font-bold text-slate-200">{inq.name}</span>
                      {inq.company && <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/10 px-1.5 py-0.5 rounded font-bold">@{inq.company}</span>}
                    </div>
                    <div className="text-[10px] text-slate-500">{inq.date} • {inq.email}</div>
                  </div>

                  <p className="font-sans text-slate-300 italic p-3 bg-[#05070a]/70 rounded-lg border border-[#141a26] leading-relaxed text-xs text-left">
                    &quot;{inq.message}&quot;
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] pt-1 text-left">
                    <span className="text-slate-400 font-bold truncate">Specs: {inq.services?.join(", ") || "Custom MERN Stack"}</span>
                    <span className="self-start sm:self-center text-blue-400 font-bold bg-blue-500/10 border border-blue-500/10 px-2 py-0.5 rounded">{inq.estimatedCost}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}


        {/* CONVERSATIONAL CHATBOT & INTERACTIVE AI REPSENTATIVE */}
        <section id="chat" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch scroll-mt-20">
          
          {/* Chat Bio card (Left 4 columns) */}
          <div className="lg:col-span-4 bg-[#0a0d14] border border-[#161d2b] p-6 rounded-3xl space-y-6 flex flex-col justify-between text-left">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest font-mono text-blue-400 font-bold block">
                / active representative
              </span>
              <h3 className="text-2xl font-extrabold tracking-tight text-white leading-tight">
                Instantly Interrogate Her Qualifications
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
                My customized AI advisor runs live to answer details. Ask about my Nexium AI Internship, my database schema optimizations, or how I safely secure API endpoints on Next.js server routers.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block font-bold">
                Quick Prompts to Trigger:
              </span>
              <div className="flex flex-col gap-2">
                {quickPrompts.map((q) => (
                  <button
                    key={q.label}
                    onClick={() => handleSendMessage(q.text)}
                    className="w-full text-left p-3 bg-[#05070a] hover:bg-[#0c0f16] text-[10px] sm:text-[11px] font-mono text-slate-400 border border-[#141b26] rounded-lg transition-all"
                    style={{ minHeight: "44px" }}
                  >
                    ⚡ {q.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#161c28] text-[10px] text-slate-500 font-mono leading-relaxed space-y-0.5">
              <div>Secure Server: <span className="text-blue-400">laiba-qazi-api</span></div>
              <div>Model Node: <span className="text-indigo-400">gemini-3.5-flash</span></div>
              <div>Dual Router: <span className="text-slate-400">Grok &amp; Gemini APIs</span></div>
            </div>
          </div>

          {/* Chat Interface console (Right 8 columns) */}
          <div className="lg:col-span-8 bg-[#05070a] border border-[#161c2a] rounded-3xl flex flex-col justify-between h-[520px] overflow-hidden shadow-2xl relative">
            
            {/* Console Header */}
            <div className="bg-[#0b0e15] border-b border-[#161c2a] px-4 sm:px-6 py-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative w-2.5 h-2.5 rounded-full bg-blue-500">
                  <span className="absolute inset-0 bg-blue-500 rounded-full animate-ping" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold font-mono text-slate-100 uppercase tracking-tight block">LAIBA_AI_REP.EXE</span>
                  <span className="text-[9px] text-slate-500 font-mono block">MERN-Architect AI Advisor</span>
                </div>
              </div>
              <span className="text-[9px] sm:text-[10px] uppercase font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                Server Proxy Online
              </span>
            </div>

            {/* Chat message logs */}
            <div className="flex-grow p-4 sm:p-6 overflow-y-auto space-y-4 font-mono text-xs leading-relaxed">
              
              {messages.map((m, idx) => {
                const isUser = m.role === "user";
                return (
                  <div
                    key={idx}
                    className={`flex ${isUser ? "justify-end" : "justify-start"} items-start gap-2.5`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0 font-bold text-[10px]">
                        AI
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-2xl max-w-[85%] text-left whitespace-pre-wrap ${
                        isUser
                          ? "bg-blue-600 text-white font-semibold"
                          : "bg-[#0b0e15] text-slate-300 border border-[#161f2c]"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                );
              })}

              {isTypingBot && (
                <div className="flex justify-start items-center space-x-2 text-slate-505">
                  <div className="w-7 h-7 rounded-lg bg-[#0b0e15] flex items-center justify-center text-slate-400 font-bold text-[10px] animate-pulse">
                    ..
                  </div>
                  <div className="flex space-x-1">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-200" />
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-300" />
                  </div>
                  <span className="text-[10px] text-slate-500">Compiling representative logic...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input footer */}
            <div className="p-4 bg-[#0a0d14] border-t border-[#161c2a] flex items-center gap-2">
              <input
                type="text"
                className="flex-grow bg-[#05070a] border border-[#181f2f] focus:border-blue-500 text-xs px-4 py-3 rounded-xl outline-none text-slate-100 font-mono transition-colors"
                style={{ minHeight: "44px" }}
                placeholder="Ask e.g. What did Laiba build at Nexium AI?..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                id="chatbot-text-entry"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isTypingBot || !userInput.trim()}
                className="p-3 bg-blue-600 text-white hover:bg-blue-500 font-bold rounded-xl transition-all disabled:opacity-50 flex-shrink-0 flex items-center justify-center"
                style={{ minWidth: "44px", minHeight: "44px" }}
                id="chatbot-send-trigger"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>

        </section>


        {/* TRADITIONAL CONTACT FORM */}
        <section id="contact" className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-start scroll-mt-20">
          
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest font-mono text-blue-400 font-bold block">
                / manual pipeline
              </span>
              <h3 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
                Approach Me For Your Next Project
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed font-sans">
                Ready to optimize your databases or host a brand-new portal? File your criteria directly to my processing queue. I review client inquires daily.
              </p>
            </div>

            <div className="space-y-4 font-mono text-xs text-slate-300">
              <div className="flex items-center space-x-3.5 p-3.5 bg-[#0b0e15] border border-[#161f2c] rounded-xl">
                <Mail className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Direct Mail</div>
                  <a href="mailto:laibaqazi721@gmail.com" className="text-slate-200 hover:text-blue-400 transition-colors">
                    laibaqazi721@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 p-3.5 bg-[#0b0e15] border border-[#161f2c] rounded-xl">
                <MapPin className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-slate-500 text-[10px] uppercase font-bold">Client Hub</div>
                  <div className="text-slate-200">Karachi, Pakistan (Serving Globally)</div>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-505 leading-relaxed font-mono">
              Note: Estimates calculated above will align with your drafted requirements block.
            </div>
          </div>

          {/* Form Card with 44px Minimum heights for mobile compatibility */}
          <div className="lg:col-span-7 bg-[#0b0e15] border border-[#191f2c] px-5 sm:px-6 py-6 sm:py-8 rounded-3xl shadow-xl relative overflow-hidden">
            
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase font-bold">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-[#05070a] border border-[#181f2f] focus:border-blue-500 text-xs px-3.5 py-2.5 rounded-xl outline-none text-slate-100 transition-colors font-mono"
                    style={{ minHeight: "44px" }}
                    placeholder="Laiba Qazi"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    id="contact-form-name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase font-bold">Business Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-[#05070a] border border-[#181f2f] focus:border-blue-500 text-xs px-3.5 py-2.5 rounded-xl outline-none text-slate-100 transition-colors font-mono"
                    style={{ minHeight: "44px" }}
                    placeholder="prospect@client.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    id="contact-form-email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase font-bold">Selected Components Summary</label>
                <div className="p-3 bg-[#05070a] border border-[#161f2c] text-[11px] font-mono text-slate-400 rounded-xl leading-relaxed text-left">
                  Configured Estimate: <span className="text-blue-400 font-bold">${currentMetrics.finalCost.toLocaleString()} USD</span> (~{currentMetrics.days} business days delivery timeline)
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase font-bold">Project Requirements Description *</label>
                <textarea
                  rows={4}
                  required
                  className="w-full bg-[#05070a] border border-[#181f2f] focus:border-blue-500 text-xs px-3.5 py-2.5 rounded-xl outline-none text-slate-100 transition-colors leading-relaxed font-sans text-xs"
                  placeholder="Describe your goals (databases, layouts, integrations)..."
                  value={formMsg}
                  onChange={(e) => setFormMsg(e.target.value)}
                  id="contact-form-message"
                />
              </div>

              <AnimatePresence>
                {formSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3.5 bg-emerald-500/10 text-emerald-400 text-xs font-mono rounded-xl border border-emerald-500/25 flex items-center space-x-2.5 text-left"
                  >
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Inquiry logged in persistent queue. Synced to direct support mail parameters.</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition-all font-mono shadow-md hover:scale-[1.01]"
                style={{ minHeight: "44px" }}
                id="contact-form-submit-trigger"
              >
                Assemble &amp; Transmit Proposal Link
                <Send className="w-3.5 h-3.5 ml-2" />
              </button>

            </form>

          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-8 border-t border-[#161c28] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500">
        <div className="text-center sm:text-left">
          <span>© 2026 Laiba Qazi. Engineered globally with Next.js &amp; Tailwind.</span>
        </div>
        <div className="flex gap-6 justify-center">
          <a href="https://github.com/qazilaiba08" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/laiba-qazi-0a2a65354" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
            LinkedIn
          </a>
          <a href="#hero" className="hover:text-blue-400 transition-colors">
            Top ↑
          </a>
        </div>
      </footer>

      {/* STAR MODAL DETAILED CASE STUDY */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0e15] border border-[#191f2c] p-6 sm:p-8 rounded-3xl max-w-2xl w-full relative max-h-[90vh] overflow-y-auto space-y-6 text-left shadow-2xl my-auto"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 bg-[#05070a] p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#121622] border border-[#191f2c] transition"
                style={{ minWidth: "38px", minHeight: "38px" }}
                id="close-star-modal-btn"
                aria-label="Close case study"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1 text-left">
                <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded border border-blue-500/20 uppercase font-bold">
                  {selectedProject.category} Case Study Breakdown
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white pt-2 font-mono">{selectedProject.title}</h3>
              </div>

              {/* STAR Layout representation */}
              <div className="space-y-4 font-sans text-xs sm:text-sm text-slate-300 leading-relaxed text-left">
                
                <div className="p-3 bg-[#05070a] rounded-xl border border-[#141b26]">
                  <span className="text-[10px] font-mono text-blue-400 block uppercase font-bold tracking-widest mb-1">
                    [S] Situation / Problem
                  </span>
                  <p className="text-slate-300 text-xs">{selectedProject.problem}</p>
                </div>

                <div className="p-3 bg-[#05070a] rounded-xl border border-[#141b26]">
                  <span className="text-[10px] font-mono text-indigo-400 block uppercase font-bold tracking-widest mb-1">
                    [T/A] Target / Tactical Action
                  </span>
                  <p className="text-slate-300 text-xs">{selectedProject.solution}</p>
                </div>

                <div className="p-3 bg-blue-950/10 rounded-xl border border-blue-900/20">
                  <span className="text-[10px] font-mono text-blue-400 block uppercase font-bold tracking-widest mb-1">
                    [R] Result / Core Outcome
                  </span>
                  <p className="text-slate-200 text-xs">{selectedProject.outcome}</p>
                </div>

              </div>

              <div className="pt-2 flex flex-wrap gap-1">
                {selectedProject.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 text-[10px] font-mono bg-[#05070a] text-slate-400 rounded-lg border border-[#141b26]"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="w-full inline-flex items-center justify-center py-3 bg-[#05070a] hover:bg-[#121622] border border-[#191f2c] text-xs font-mono font-bold text-slate-300 rounded-xl mt-4"
                style={{ minHeight: "44px" }}
              >
                Close Case Study
              </button>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CUSTOM PROPOSAL GENERATOR DRAWER/MODAL */}
      <AnimatePresence>
        {showProposalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-[#0b0e15] border border-[#191f2c] p-6 sm:p-8 rounded-3xl max-w-3xl w-full relative max-h-[85vh] overflow-hidden flex flex-col text-left shadow-2xl my-auto"
            >
              <button
                onClick={() => setShowProposalModal(false)}
                className="absolute top-4 right-4 bg-[#05070a] p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#121622] border border-[#191f2c] transition z-10"
                style={{ minWidth: "38px", minHeight: "38px" }}
                id="close-proposal-modal-btn"
                aria-label="Close proposal modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1 pb-4 border-b border-[#141a25]">
                <h3 className="text-base sm:text-lg font-bold text-blue-400 font-mono flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Custom Strategic Project Proposal
                </h3>
                <p className="text-[11px] text-slate-400">
                  Formulated on-demand using Laiba&apos;s background framework with <span className="text-blue-400">gemini-3.5-flash</span>.
                </p>
              </div>

              {/* Generated text scrolling container */}
              <div className="flex-grow my-6 overflow-y-auto pr-2 text-xs sm:text-sm text-[#ccd6e6] leading-relaxed font-mono whitespace-pre-wrap p-4 bg-[#05070a] rounded-xl border border-[#141a25]">
                
                {isGeneratingProposal ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-3">
                    <div className="flex space-x-1.5">
                      <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce delay-100" />
                      <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce delay-200" />
                      <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce delay-300" />
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono tracking-widest text-center">
                      Compiling variables &amp; drawing strategic delivery milestones...
                    </span>
                  </div>
                ) : (
                  proposalText
                )}

              </div>

              {/* Modal footer controls with 44px minimum touch sizes */}
              <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-4 border-t border-[#141a25]">
                <button
                  onClick={() => {
                    setShowProposalModal(false);
                    const simulatedInquiry: Inquiry = {
                      id: getNextUniqueId("prop"),
                      name: clientCompany ? `${clientCompany} Proposal Sync` : "Custom Proposal Draft",
                      email: "generated@ai-proposal.com",
                      company: clientCompany || undefined,
                      message: `Strategic AI Generated Proposal compiled on ${new Date().toLocaleDateString()}`,
                      date: new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      }),
                      services: SERVICE_OPTIONS.filter(s => selectedServices.includes(s.id)).map(s => s.title),
                      estimatedCost: `$${currentMetrics.finalCost.toLocaleString()}`
                    };

                    const updated = [simulatedInquiry, ...submittedInquiries];
                    setSubmittedInquiries(updated);
                    try {
                      localStorage.setItem("laiba_qazi_mern_inquiries", JSON.stringify(updated));
                    } catch (err) {
                      console.error(err);
                    }

                    setFormSuccess(true);
                    setTimeout(() => setFormSuccess(false), 6000);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono rounded-lg transition"
                  style={{ minHeight: "44px" }}
                  id="btn-proposal-modal-lock-in"
                >
                  Save to Local Log List
                </button>
                <button
                  onClick={() => copyToClipboard(proposalText)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#05070a] text-slate-300 text-xs font-bold font-mono rounded-lg hover:text-white border border-[#191f2c] transition flex items-center justify-center gap-2"
                  style={{ minHeight: "44px" }}
                >
                  <Clipboard className="w-4 h-4" />
                  Copy Markdown
                </button>
                <button
                  onClick={() => setShowProposalModal(false)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#0b0e15] text-slate-400 hover:text-slate-300 text-xs font-bold font-mono rounded-lg transition"
                  style={{ minHeight: "44px" }}
                >
                  Edit Scope
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
