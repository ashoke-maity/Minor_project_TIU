import React, { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";
import { gsap } from "gsap";

// Predefined responses for common questions
const botResponses = {
  greetings: ["Hi there!", "Hello! How can I help you today?", "Welcome to AlumniConnect!"],
  help: [
    "I can help you with finding connections, navigating events, searching for jobs, or using platform features.",
    "Need assistance? Ask me about connections, events, profile management, or jobs!"
  ],
  connections: [
    "To connect with other alumni, visit their profile and click on the 'Connect' button.",
    "You can view all your connections by clicking on your connections count in your profile sidebar."
  ],
  events: [
    "Check out upcoming events in the Events section. You can filter by date, location, or type.",
    "Want to create an event? Click on 'Create Event' in the Events section!"
  ],
  jobs: [
    "Looking for job opportunities? Check the Jobs section for the latest postings.",
    "You can filter jobs by industry, location, or experience level."
  ],
  profile: [
    "Update your profile by clicking on your profile picture and then 'Edit Profile'.",
    "Make sure your profile is complete to get better connection suggestions!"
  ],
  default: [
    "I'm not sure I understand. Could you rephrase that?",
    "I don't have information about that yet. Please try asking something about connections, events, jobs, or profile management.",
    "I'm still learning! Try asking about how to use AlumniConnect features."
  ]
};

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: "bot", 
      text: "Hello! I'm your AlumniConnect assistant. How can I help you today?" 
    }
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);
  const chatbotIconRef = useRef(null);
  const animationRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = { sender: "user", text: inputText };
    setMessages([...messages, userMessage]);
    
    // Generate bot response
    setTimeout(() => {
      const botMessage = { sender: "bot", text: generateBotResponse(inputText) };
      setMessages(prev => [...prev, botMessage]);
    }, 600);

    setInputText("");
  };

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Check for keywords in user input
    if (input.match(/hi|hello|hey/)) {
      return botResponses.greetings[Math.floor(Math.random() * botResponses.greetings.length)];
    } else if (input.match(/help|assist|support|guide/)) {
      return botResponses.help[Math.floor(Math.random() * botResponses.help.length)];
    } else if (input.match(/connect|connection|network|contact|friend/)) {
      return botResponses.connections[Math.floor(Math.random() * botResponses.connections.length)];
    } else if (input.match(/event|meetup|gathering|conference/)) {
      return botResponses.events[Math.floor(Math.random() * botResponses.events.length)];
    } else if (input.match(/job|career|opportunity|work|employ/)) {
      return botResponses.jobs[Math.floor(Math.random() * botResponses.jobs.length)];
    } else if (input.match(/profile|account|setting|info|picture/)) {
      return botResponses.profile[Math.floor(Math.random() * botResponses.profile.length)];
    } else {
      return botResponses.default[Math.floor(Math.random() * botResponses.default.length)];
    }
  };

  // Determine if we should show the notification dot
  const [showNotification, setShowNotification] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  
  // Show welcome message on new pages
  useEffect(() => {
    // Check if we've shown the welcome message for this page
    const currentPath = window.location.pathname;
    const welcomeShownForPaths = JSON.parse(localStorage.getItem('chatbotWelcomeShown') || '{}');
    
    if (!welcomeShownForPaths[currentPath]) {
      // Mark this path as having shown the welcome
      welcomeShownForPaths[currentPath] = true;
      localStorage.setItem('chatbotWelcomeShown', JSON.stringify(welcomeShownForPaths));
      
      // Show notification for new page
      setShowNotification(true);
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    }
  }, []);
  
  // Clear notification when chat is opened
  useEffect(() => {
    if (isOpen) {
      setShowNotification(false);
    }
  }, [isOpen]);
  
  // Animation for inactive state - show notification every 30 seconds
  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        setShowNotification(true);
        
        // Auto-hide notification after 5 seconds
        setTimeout(() => {
          setShowNotification(false);
        }, 5000);
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [isOpen]);
  
  // GSAP animation for the chatbot icon
  useEffect(() => {
    if (chatbotIconRef.current) {
      // Kill any existing animation
      if (animationRef.current) {
        animationRef.current.kill();
      }
      
      // Create a floating animation
      animationRef.current = gsap.timeline({ repeat: -1, yoyo: true })
        .to(chatbotIconRef.current, { 
          y: -10, 
          duration: 1.5, 
          ease: "power1.inOut" 
        })
        .to(chatbotIconRef.current, { 
          y: 0, 
          duration: 1.5, 
          ease: "power1.inOut" 
        });
      
      // Add rotation for hover state
      if (isHovered && !isOpen) {
        gsap.to(chatbotIconRef.current, {
          rotation: 15,
          scale: 1.1,
          duration: 0.3,
          ease: "back.out"
        });
      } else {
        gsap.to(chatbotIconRef.current, {
          rotation: 0,
          scale: 1,
          duration: 0.3,
          ease: "back.out"
        });
      }
      
      // Add a wiggle effect when notification appears
      if (showNotification && !isOpen) {
        gsap.timeline()
          .to(chatbotIconRef.current, { 
            rotation: -10, 
            duration: 0.1,
            ease: "power1.inOut" 
          })
          .to(chatbotIconRef.current, { 
            rotation: 10, 
            duration: 0.1,
            ease: "power1.inOut" 
          })
          .to(chatbotIconRef.current, { 
            rotation: -5, 
            duration: 0.1,
            ease: "power1.inOut" 
          })
          .to(chatbotIconRef.current, { 
            rotation: 5, 
            duration: 0.1,
            ease: "power1.inOut" 
          })
          .to(chatbotIconRef.current, { 
            rotation: 0, 
            duration: 0.1,
            ease: "power1.inOut" 
          });
      }
    }
    
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [isHovered, isOpen, showNotification]);

  // Detect screen size
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Update the isMobile state when window is resized
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`fixed ${isMobile ? 'bottom-4 right-4' : 'bottom-5 right-5'} z-50`}>
      {/* Animated chat suggestion bubble - shows occasionally */}
      {showNotification && !isOpen && (
        <div className={`absolute bottom-16 right-0 bg-white p-2 sm:p-3 rounded-lg shadow-lg 
                       ${isMobile ? 'max-w-[calc(100vw-4rem)]' : 'max-w-xs'} 
                       animate-fade-in-up mb-2 border border-teal-100`}>
          <p className="text-xs sm:text-sm font-medium text-gray-700">
            {window.location.pathname === '/home' 
              ? 'Welcome to your feed!' 
              : window.location.pathname === '/network'
                ? 'Looking to connect with alumni?'
                : window.location.pathname === '/settings'
                  ? 'Need help updating your profile?'
                  : window.location.pathname === '/get-events'
                    ? 'Interested in upcoming events?'
                    : window.location.pathname === '/get-jobs'
                      ? 'Looking for career opportunities?'
                      : 'Need help with something?'
            }
          </p>
          <p className="text-xs text-gray-500">I'm here to assist you!</p>
          <div className="absolute -bottom-2 right-5 w-4 h-4 bg-white transform rotate-45 border-r border-b border-teal-100"></div>
        </div>
      )}
      
      {/* Chat toggle button */}
      <button
        onClick={toggleChat}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          ${isOpen ? "bg-transparent" : "bg-transparent"} 
          rounded-full flex items-center justify-center relative transition-all duration-300
        `}
        style={{
          boxShadow: isHovered && !isOpen ? "0 0 15px rgba(20, 184, 166, 0.5)" : "",
          width: isOpen ? "40px" : (isMobile ? "50px" : "60px"),
          height: isOpen ? "40px" : (isMobile ? "50px" : "60px")
        }}
      >
        {!isOpen ? (
          <div className="relative" ref={chatbotIconRef}>
            <img 
              src="/icons/chatbot.png" 
              alt="Chat assistant"
              className="w-full h-full object-contain"
            />
            
            {/* Notification dot */}
            {showNotification && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-ping"></span>
            )}
          </div>
        ) : (
          <X size={24} className="text-teal-600 animate-spin-once" />
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className={`
          absolute bottom-16 right-0 
          ${isMobile ? 'w-[calc(100vw-2rem)] max-w-[90vw]' : 'w-80 sm:w-96'} 
          bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-fade-in-up
        `}>
          {/* Chat header */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-3 sm:p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm sm:text-base flex items-center">
                <span className="inline-block w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></span>
                AlumniConnect Assistant
              </h3>
              <p className="text-xs opacity-80">Ask me anything about the platform</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white hover:bg-teal-600/50 rounded-full p-1.5 transition-colors"
            >
              <X size={isMobile ? 16 : 18} />
            </button>
          </div>

          {/* Messages area */}
          <div className={`${isMobile ? 'h-64' : 'h-80'} overflow-y-auto p-3 sm:p-4 bg-gray-50`}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.sender === "user" ? "text-right" : "text-left"
                } ${
                  // Add animation for the latest message only
                  index === messages.length - 1 ? "animate-fade-in-up" : ""
                }`}
              >
                <div
                  className={`inline-block p-2 sm:p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-teal-500 text-white shadow-md"
                      : "bg-white text-gray-800 border border-gray-200 shadow-sm"
                  } transition-all duration-200 hover:shadow-lg max-w-[85%] text-sm sm:text-base`}
                >
                  {message.text}
                </div>
                <div className="text-xs text-gray-400 mt-1 ml-1">
                  {message.sender === "bot" && index === messages.length - 1 && (
                    <span className="inline-flex items-center">
                      <span className="mr-1">AlumniConnect Bot</span>
                      <span className="inline-block w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions when chat is empty */}
          {messages.length === 1 && (
            <div className="px-3 sm:px-4 py-2 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {["How to connect?", "Find events", "Job search", "Edit profile"].map((q, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                      setInputText(q);
                      // Auto submit after a small delay
                      setTimeout(() => {
                        setMessages([...messages, { sender: "user", text: q }]);
                        setTimeout(() => {
                          const botMessage = { sender: "bot", text: generateBotResponse(q) };
                          setMessages(prev => [...prev, botMessage]);
                        }, 600);
                      }, 300);
                    }}
                    className="text-xs bg-gray-100 hover:bg-teal-50 hover:text-teal-600 text-gray-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input area */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-2 sm:p-3 flex">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 p-2 text-sm sm:text-base border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
            <button
              type="submit"
              className="bg-teal-500 text-white p-2 rounded-r-lg hover:bg-teal-600 transition-colors flex items-center justify-center"
              disabled={!inputText.trim()}
            >
              <Send size={isMobile ? 16 : 20} className={inputText.trim() ? "transform transition-transform hover:translate-x-1" : ""} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatBot;