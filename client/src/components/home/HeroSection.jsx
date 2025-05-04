import { motion } from "framer-motion";
import Button from "../ui/Button";
import { useEffect, useRef, useState } from "react";
import { LampContainer } from "../ui/LampContainer";

function HeroSection() {
  const [text, setText] = useState("");
  const fullText = "Connect with your Alumni Community";
  const sectionRef = useRef(null);

  // Typing animation function
  const startTyping = () => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startTyping();
        }
      },
      {
        threshold: 0.7, // Trigger when 70% of section is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-black -mt-1">
      <section id="home" ref={sectionRef} className="relative min-h-screen overflow-hidden bg-black">
      <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        Alumni Connect <br /> Connect with your Alumni
      </motion.h1>
    </LampContainer>
    </section>
    </div>
  );
}

export default HeroSection;
