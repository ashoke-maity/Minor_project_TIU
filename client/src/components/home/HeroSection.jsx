"use client";

import { motion } from "framer-motion";
import Button from "../ui/Button";

function HeroSection() {
  return (
    <section id="home" className="relative">
      <div className="absolute inset-0 z-10 bg-primary-foreground" />
      <div
        className="h-[700px] bg-cover bg-center backdrop-blur-sm"
        style={{ backgroundImage: "url('/bg_home.jpg')" }}
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
                  staggerChildren: 0.25, // slightly faster
                },
              },
            }}
          >
            {/* Heading */}
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{
                type: "spring",
                stiffness: 80,  // springiness
                damping: 20,     // less vibration
              }}
              className="text-6xl font-bold tracking-tighter text-primary-200 justify-evenly"
            >
              Connect with your Alumni Community
            </motion.h1>

            {/* Paragraph */}
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
              className="text-lg text-primary-100 justify-evenly"
            >
              Join thousands of graduates in our vibrant network. Reconnect with classmates, advance your career, and
              give back to your alma mater.
            </motion.p>

            {/* Buttons */}
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
