import React, { useState, useEffect, useRef } from "react";
import { useAppState } from "../state";
import { MessageSquare, X, Send, User, ShieldCheck, Sparkles } from "lucide-react";

export const SupportChat: React.FC = () => {
  const { currentUser, chatMessages, sendChatMessage } = useAppState();
  const [isOpen, setIsOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Get conversation ID
  const conversationId = currentUser.isGuest ? "guest_support" : currentUser.email;

  // Filter messages for this conversation
  const myMessages = chatMessages.filter(
    (msg: any) => msg.conversationId === conversationId
  );

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [myMessages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    await sendChatMessage(messageText);
    setMessageText("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="support-chat-wrapper">
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3.5 bg-gradient-to-r from-neon-blue to-[#008BFF] text-black font-black rounded-full shadow-[0_0_20px_rgba(0,191,255,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer select-none group"
          id="chat-toggle-open"
        >
          <div className="relative">
            <MessageSquare className="h-5 w-5 animate-pulse" />
            {myMessages.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-2.5 w-2.5 bg-neon-green rounded-full ring-2 ring-black"></span>
            )}
          </div>
          <span className="text-xs uppercase tracking-wider font-extrabold hidden md:inline">Live Chat Support</span>
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div 
          className="w-[340px] h-[450px] bg-[#0E0E12] border border-white/10 rounded-lg shadow-[0_10px_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
          id="chat-window"
        >
          {/* Header */}
          <div className="p-4 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-neon-green rounded-full animate-ping"></div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-1">
                  <span>Elite Support Agent</span>
                  <Sparkles className="h-3.5 w-3.5 text-neon-blue" />
                </h4>
                <p className="text-[10px] text-white/50 font-mono">
                  {currentUser.isGuest ? "Guest Chat Session" : `Active: ${currentUser.username}`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-sm hover:bg-white/5 text-white/40 hover:text-white transition-colors cursor-pointer"
              id="chat-toggle-close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0A0A0E]/50">
            {myMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <MessageSquare className="h-8 w-8 text-white/20 mb-2" />
                <p className="text-xs font-semibold text-white/80">Need assistance or custom logs?</p>
                <p className="text-[10px] text-white/45 mt-1 leading-normal">
                  Send us a message below! Our admin team responds in real time.
                </p>
              </div>
            ) : (
              myMessages.map((msg: any, i: number) => {
                const isMe = msg.senderEmail === (currentUser.email || "guest@elitelogs.net");
                return (
                  <div
                    key={msg.id || i}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      {!isMe && (
                        <span className="text-[9px] font-bold text-neon-blue uppercase tracking-wider flex items-center gap-0.5">
                          <ShieldCheck className="h-3 w-3" /> Admin
                        </span>
                      )}
                      <span className="text-[8px] text-white/30 font-mono">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div
                      className={`px-3 py-2 rounded-sm text-xs max-w-[85%] break-all ${
                        isMe
                          ? "bg-neon-blue/10 border border-neon-blue/30 text-white"
                          : "bg-white/5 border border-white/10 text-white/95"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Form */}
          <form 
            onSubmit={handleSendMessage}
            className="p-3 bg-white/[0.01] border-t border-white/5 flex gap-2"
          >
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-neon-blue/50"
            />
            <button
              type="submit"
              className="px-3 bg-neon-blue hover:bg-neon-blue/90 text-black font-black rounded-sm flex items-center justify-center transition-transform hover:scale-[1.03] cursor-pointer select-none"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
