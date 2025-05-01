"use client";

import { motion } from "framer-motion";
import Button from "../ui/Button";
import { useEffect, useRef, useState } from "react";

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
    <section id="home" ref={sectionRef} className="relative min-h-screen overflow-hidden">
      <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/background.mp4" // replace this with your own video URL
          autoPlay
          muted
          loop
          playsInline
      />

      <div className="absolute inset-0 flex items-center z-20 flex-col justify-center w-full h-full">
        <div className="container text-center px-4">
          <motion.div
            className="max-w-2xl space-y-4 mx-auto"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.25,
                },
              },
            }}
          >
            <motion.h1
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
              }}
              transition={{ duration: 0.5 }}
              className="text-7xl  font-bold tracking-tighter text-primary-100 min-h-[160px]"
            >
              {text}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block ml-1 w-1 h-12 bg-primary-200"
              />
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 18,
                delay: 0.1,
              }}
              className="text-lg text-muted-foreground"
            >
              Join thousands of graduates in our vibrant network. Reconnect with classmates, advance your career, and
              give back to your alma mater.
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 18,
                delay: 0.2,
              }}
              className="justify-center gap-3 grid grid-cols-2"
            >
              <Button size="lg">Join the Network</Button>
              <Button size="lg">Explore Benefits</Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
