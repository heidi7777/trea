"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

export function AnimatedSection({ 
  children, 
  className, 
  id,
  delay = 0 
}: { 
  children: ReactNode, 
  className?: string,
  id?: string,
  delay?: number
}) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.section>
  )
}

export function AnimatedGroup({ 
  children, 
  className 
}: { 
  children: ReactNode, 
  className?: string 
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.15
          }
        }
      }}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedItem({ 
  children, 
  className 
}: { 
  children: ReactNode, 
  className?: string 
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
      }}
    >
      {children}
    </motion.div>
  )
}
