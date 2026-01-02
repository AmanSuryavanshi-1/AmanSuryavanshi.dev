'use client'
import React, { useRef, useState } from 'react';
import { Send, MessageSquare, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import HeroSocial from '@/components/hero/HeroSocial';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const ContactForm = () => {
  const form = useRef<HTMLFormElement>(null);
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setIsMessageSent(false);

    const formData = new FormData(form.current);
    const data = {
      from_name: formData.get('from_name'),
      reply_to: formData.get('reply_to'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      setIsMessageSent(true);
      if (form.current) form.current.reset();

      // Hide the success message after 5 seconds
      setTimeout(() => {
        setIsMessageSent(false);
      }, 5000);
    } catch (error: any) {
      console.error('Failed to send email:', error);
      setErrorMessage(error.message || 'Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      id="contact"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col py-8 lg:py-12 sm:px-8 items-center justify-center"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        id="Contact-us-heading"
        className="text-2xl md:text-4xl font-bold font-serif text-forest-900 dark:text-sage-100 text-center tracking-tight"
      >
        Contact<span className="text-lime-500 dark:text-lime-400">Us</span>
      </motion.h1>

      <div className="md:hidden w-full max-w-[58rem] mt-8">
        <HeroSocial className="flex justify-center gap-6" />
      </div>

      <div className="w-full max-w-[58rem] relative flex gap-4">
        <div className="hidden md:flex flex-col justify-center">
          <HeroSocial className="grid gap-4" />
        </div>

        <Card className="w-full overflow-hidden bg-transparent border-0 shadow-none">
          <CardContent className="p-0 bg-transparent">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col p-6 sm:p-8 lg:px-12 lg:py-10 text-lime-500 dark:text-lime-400">
                <div className="flex flex-col space-y-5">
                  <ContactCard
                    icon={<Mail className="w-6 h-6" />}
                    title="Email"
                    content="amansurya.work@gmail.com"
                    link="mailto:amansurya.work@gmail.com"
                    linkText="Send an email"
                  />
                  <ContactCard
                    icon={<MessageSquare className="w-7 h-7" />}
                    title="WhatsApp"
                    content="Message me directly"
                    link="https://api.whatsapp.com/send?phone=+918745030106&text=Hello%20there!"
                    linkText="Chat on WhatsApp"
                  />
                  <ContactCard
                    icon={<MapPin className="w-6 h-6" />}
                    title="Location"
                    content="Delhi, India"
                    link="https://maps.google.com/?q=Delhi,India"
                    linkText="View on Maps"
                  />
                </div>
              </div>

              <div className="flex flex-col p-6 sm:p-8 lg:p-12">
                <form ref={form} onSubmit={sendEmail} className="flex flex-col space-y-5">
                  <Input name="from_name" placeholder="Your Full Name" />
                  <Input name="reply_to" type="email" placeholder="Your Email" />
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Your Message"
                    required
                    className="w-full h-52 px-4 py-4 text-sm rounded-2xl shadow-md shadow-forest-500 dark:shadow-forest-950/50 bg-transparent border-4 border-sage-100 dark:border-sage-300/30 text-forest-900 dark:text-sage-100 placeholder:text-forest-700 dark:placeholder:text-sage-400 focus:from-forest-900 focus:to-forest-500 focus:text-forest-700 focus:placeholder:text-sage-300 transition-all duration-300 focus:outline-none resize-none"
                  />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    type="submit"
                    className="flex rounded-3xl border-2 border-sage-100 dark:border-lime-500 items-center justify-center px-4 py-3 text-sm font-bold tracking-wide text-sage-100 bg-forest-900 hover:bg-forest-700 dark:bg-lime-500 dark:text-forest-950 dark:hover:bg-lime-400 transition-colors duration-300 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <Send className="ml-2 w-4 h-4" />
                  </motion.button>
                  {isMessageSent && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-semibold text-center bg-lime-500 mx-auto border-2 py-1 px-2 shadow-md shadow-forest-900 rounded-full text-sage-100"
                    >
                      Message sent successfully!
                    </motion.p>
                  )}
                  {errorMessage && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-semibold text-center bg-red-500 mx-auto border-2 py-1 px-2 shadow-md shadow-forest-900 rounded-full text-white"
                    >
                      {errorMessage}
                    </motion.p>
                  )}
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

const ContactCard = ({ icon, title, content, link, linkText }: { icon: React.ReactNode; title: string; content: string; link: string; linkText: string }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="group flex items-center space-x-4 p-6 rounded-2xl 
               bg-gradient-to-br from-lime-500 to-lime-300/10 dark:from-[#162c22] dark:to-forest-800
               border-4 border-sage-100 dark:border-white/10 
               hover:from-forest-900 hover:to-forest-500 hover:text-sage-100 
               dark:hover:from-lime-500 dark:hover:to-lime-400
               transition-colors duration-300 
               shadow-lg shadow-forest-500/20 dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]
               backdrop-blur-sm"
  >
    <div className="p-4 rounded-full bg-forest-900 dark:bg-lime-500/20 text-lime-500 dark:text-lime-400 group-hover:bg-lime-500 group-hover:text-forest-900 dark:group-hover:bg-forest-900 dark:group-hover:text-lime-400">
      {icon}
    </div>
    <div>
      <h4 className="text-base font-semibold text-forest-900 dark:text-sage-100 group-hover:text-lime-500 dark:group-hover:text-forest-900">{title}</h4>
      <p className="text-sm text-forest-500 dark:text-sage-200 mb-1 group-hover:text-lime-100 dark:group-hover:text-forest-800">{content}</p>
      <Link href={link} className="text-sm font-medium text-forest-500 dark:text-lime-400 group-hover:text-forest-700 dark:group-hover:text-forest-900 transition-colors duration-200">
        {linkText}
      </Link>
    </div>
  </motion.div>
);

const Input = ({ name, type = 'text', placeholder }: { name: string; type?: string; placeholder: string }) => (
  <input
    name={name}
    type={type}
    placeholder={placeholder}
    required
    className="w-full px-4 py-3 text-sm rounded-2xl 
               shadow-md shadow-forest-500/30 dark:shadow-[0_0_15px_rgba(157,207,111,0.1)]
               bg-white dark:bg-[#162c22]
               border-4 border-sage-100 dark:border-sage-300/20
               text-forest-900 dark:text-sage-100 
               placeholder:text-forest-700 dark:placeholder:text-sage-500
               focus:border-lime-500 dark:focus:border-lime-400
               transition-all duration-300 focus:outline-none"
  />
);

export default ContactForm;