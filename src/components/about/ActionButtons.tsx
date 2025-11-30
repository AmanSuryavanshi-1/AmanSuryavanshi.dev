'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, UserCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    }
  }
};

const ActionButton = ({ href, icon: Icon, text, variant }: {
  href: string;
  icon: typeof MessageCircle;
  text: string;
  variant: 'primary' | 'secondary';
}) => {
  const isExternal = href.startsWith('http');
  const buttonStyles = variant === 'primary'
    ? "border-forest-900 bg-forest-900 hover:bg-forest-700 hover:border-forest-700 text-sage-100"
    : cn(
      "border-lime-500 text-forest-900",
      "animate-shimmer bg-[linear-gradient(110deg,#9DCF6F,45%,#FBFADA,55%,#9DCF6F)]",
      "bg-[length:200%_100%] transition-colors hover:bg-lime-500"
    );

  return (
    <Button
      asChild
      size="lg"
      className={`group relative border-4 rounded-3xl overflow-hidden ${buttonStyles}`}
    >
      <motion.a
        href={href}
        aria-label={text}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95, rotate: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.span
          className={`absolute inset-0 ${variant === 'primary' ? 'bg-forest-600' : 'bg-sage-300'}`}
          initial={{ y: variant === 'primary' ? "100%" : "100%" }}
          whileHover={{ y: 0 }}
          transition={{ type: "tween", ease: "easeInOut" }}
        />
        <span className="relative z-10 flex items-center">
          <Icon className="w-5 h-5 mr-2" />
          <span>{text}</span>
        </span>
      </motion.a>
    </Button>
  );
};

const ActionButtons = () => {
  return (
    <motion.div
      className="flex flex-col mt-8 gap-4 md:flex-row md:gap-5 max-lg:justify-center"
      variants={itemVariants}
    >
      <ActionButton
        href="/#contact"
        icon={MessageCircle}
        text="Let's Talk"
        variant="primary"
      />
      <ActionButton
        href="/about"
        icon={UserCircle}
        text="Learn More"
        variant="secondary"
      />
    </motion.div>
  );
};

export default ActionButtons;