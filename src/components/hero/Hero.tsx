'use client'

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeaderSocial from './HeroSocial';
import HeroData from './HeroData';
import { ChevronDown } from 'lucide-react';
import pfp from '../../../public/Profile/PFP.png'

export default function Header() {
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
    const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

    return (
        <motion.section
            id="home"
            className="relative w-full my-16 overflow-hidden md:mb-4 md:p-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <motion.div
                className="container relative flex flex-col items-center justify-center h-full gap-8 mx-auto md:h-5/6"
                style={{ opacity, scale, y }}
            >
                <div className="max-h-[750px]:mt-28 py-16 max-h-[650px]:mt-32 overflow-hidden  grid grid-cols-1 md:grid-cols-[auto_3fr_1.5fr] gap-8 md:gap-12 px-20 max-md:px-2 md:pt-22  items-center">
                    <motion.div
                        className="relative order-1 w-64 h-64 mx-auto md:order-3 md:w-96 md:h-96 md:mx-0"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20, duration: 1.2 }}
                    >
                        <Image
                            src={pfp}
                            alt="Profile"
                            priority
                            className="object-cover w-full bg-[#9dcd6f] h-full border-4 shadow-inner md:border-8 border-white rounded-full"
                            style={{
                                borderRadius: "50%",
                                animation: "profile__animate 8s ease-in-out infinite 1s",
                                // background: "linear-gradient(145deg, #9dcd6f, #749a48)",
                                boxShadow: "10px 10px 15px #12372A, -10px -10px 15px #FBFADA"
                            }}
                            fill
                        />
                    </motion.div>
                    <div className="order-2 md:order-1">
                        <HeaderSocial />
                    </div>
                    <div className="order-3 md:order-2">
                        <HeroData />
                    </div>
                </div>
            </motion.div>
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                    <ChevronDown className="w-8 h-8 text-sage-100" />
                </motion.div>
            </motion.div>
        </motion.section>
    );
}