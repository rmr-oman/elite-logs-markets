import React, { useState } from "react";
import { useAppState } from "../state";
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  MessageCircle, 
  Send, 
  Mail,
  ShieldCheck,
  Zap
} from "lucide-react";

export const FAQView: React.FC = () => {
  const { faqs, supportSettings } = useAppState();
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-20">
      
      {/* Title block */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1.5">
          <h2 className="text-3xl font-black italic uppercase text-white tracking-tight">FAQ & Support Vault</h2>
          <p className="text-white/60 text-xs">Search through verified solutions, carrier setup policies, and refund assurances.</p>
        </div>

        {/* FAQ Search */}
        <div className="w-full md:w-80">
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs">
            <Search className="h-4.5 w-4.5 text-white/40 shrink-0" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search solutions..."
              className="bg-transparent border-none focus:outline-none w-full text-white text-xs px-2.5 placeholder:text-white/30"
            />
          </div>
        </div>
      </section>

      {/* Grid containing FAQ accordion lists and Support Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Side: Dynamic FAQ Accordion */}
        <div className="lg:col-span-8 space-y-4">
          {filteredFaqs.length > 0 ? (
            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div 
                    key={idx} 
                    className="glass-card rounded-sm border border-white/5 transition-all"
                  >
                    {/* Trigger Bar */}
                    <button
                      onClick={() => toggleAccordion(idx)}
                      className="w-full p-5 text-left flex justify-between items-center text-sm font-bold uppercase tracking-wide text-white select-none cursor-pointer hover:text-neon-blue transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-neon-blue font-bold px-2 py-0.5 bg-neon-blue/5 border border-neon-blue/10 rounded">
                          {faq.category}
                        </span>
                        <span className="line-clamp-1">{faq.question}</span>
                      </div>
                      {isOpen ? <ChevronUp className="h-4 w-4 text-neon-blue" /> : <ChevronDown className="h-4 w-4 text-white/40" />}
                    </button>

                    {/* Answer body panel */}
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-white/55 leading-relaxed border-t border-white/5 pt-4">
                        {faq.answer}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/[0.01] border border-white/5 rounded">
              <p className="text-white/40 text-xs">No matching frequently asked questions found.</p>
            </div>
          )}
        </div>

        {/* Right Side: Contact / Ticket Portal */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 rounded-sm border border-white/5 space-y-6">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-white border-b border-white/5 pb-3">
              Admin Escrow Hotline
            </h3>

            <p className="text-xs text-white/50 leading-relaxed">
              Facing complex carrier login errors? Need dynamic bulk discounts or custom API release parameters? Hook directly into our secure channels:
            </p>

            <div className="space-y-3 pt-2">
              <a 
                href={supportSettings.whatsappLink || "https://wa.me/"} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 p-4 bg-white/5 hover:bg-neon-blue/5 border border-white/10 hover:border-neon-blue/20 rounded text-xs text-white transition-all select-none cursor-pointer group"
              >
                <div className="p-2 bg-[#25d366]/10 text-[#25d366] rounded-sm">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-wider group-hover:text-neon-blue">WhatsApp Support</h4>
                  <p className="text-[10px] text-white/40 font-mono">Response ETA: &lt; 5m</p>
                </div>
              </a>

              <a 
                href={supportSettings.telegramLink || "https://t.me/"} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 p-4 bg-white/5 hover:bg-neon-purple/5 border border-white/10 hover:border-neon-purple/20 rounded text-xs text-white transition-all select-none cursor-pointer group"
              >
                <div className="p-2 bg-[#0088cc]/10 text-[#0088cc] rounded-sm">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-wider group-hover:text-neon-purple">Telegram Channel</h4>
                  <p className="text-[10px] text-white/40 font-mono">Daily Stock Updates</p>
                </div>
              </a>

              <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded text-xs text-white">
                <div className="p-2 bg-neon-green/10 text-neon-green rounded-sm">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-wider">Secure Email Desk</h4>
                  <p className="text-[10px] text-white/40 font-mono">support@elitelogs.net</p>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-white/5"></div>

            <div className="space-y-2 text-[10px] text-white/30 font-mono leading-normal">
              <div className="flex gap-1.5 items-center">
                <ShieldCheck className="h-4.5 w-4.5 text-neon-green" />
                <span>ANTI-FRAUD COMPLIANCE ACTIVE</span>
              </div>
              <div className="flex gap-1.5 items-center">
                <Zap className="h-4.5 w-4.5 text-neon-blue" />
                <span>ESCROW SEALS VALIDATED</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
