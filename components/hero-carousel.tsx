"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Wallet, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CarouselSlide {
  id: number
  title: string
  description: string
  gradient: string
  cta: string
}

const slides: CarouselSlide[] = [
  {
    id: 1,
    title: "Save. Win. Repeat.",
    description: "Deposit stablecoins, earn yield, win weekly prizes. Your money stays safe.",
    gradient: "from-slate-900 via-purple-900 to-slate-900",
    cta: "Start Saving",
  },
  {
    id: 2,
    title: "100% No-Loss",
    description: "Your principal is always protected. Withdraw anytime without penalties.",
    gradient: "from-slate-900 via-emerald-900 to-slate-900",
    cta: "Deposit Safely",
  },
  {
    id: 3,
    title: "Weekly Prizes",
    description: "Join 1,234+ users competing for yield-generated prizes every week.",
    gradient: "from-slate-900 via-amber-900 to-slate-900",
    cta: "Enter Draw",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  const currentSlideData = slides[currentSlide]

  return (
    <div className="relative h-[100vh] sm:h-[80vh] min-h-[600px] overflow-hidden">
      {/* Dark base background */}
      <div className="absolute inset-0 bg-black" />

      {/* Animated gradient overlay */}
      <motion.div
        key={currentSlide}
        className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.gradient} opacity-80`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1 }}
      />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px] opacity-20" />

      {/* Floating orbs - adjusted for mobile */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{ top: "10%", left: "5%" }}
        />
        <motion.div
          className="absolute w-48 h-48 sm:w-80 sm:h-80 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-3xl"
          animate={{
            x: [0, -25, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{ bottom: "15%", right: "5%" }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Title - Mobile responsive */}
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-white via-gray-100 to-white text-transparent bg-clip-text"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                {currentSlideData.title}
              </motion.h1>

              {/* Description - Mobile responsive */}
              <motion.p
                className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {currentSlideData.description}
              </motion.p>

              {/* CTA Buttons - Mobile responsive */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white border-none font-semibold px-8 py-4 text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
                >
                  <Link href="/dashboard">
                    {currentSlideData.cta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 bg-white/5 backdrop-blur-sm px-8 py-4 text-lg transition-all duration-300"
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation arrows - Hidden on mobile, visible on tablet+ */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-200"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-200"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide indicators - Mobile responsive */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white scale-125 shadow-lg" : "bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          key={currentSlide}
        />
      </div>

      {/* Mobile swipe indicators */}
      <div className="md:hidden absolute bottom-16 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <div className="w-6 h-1 bg-white/30 rounded-full" />
          <span>Swipe</span>
          <div className="w-6 h-1 bg-white/30 rounded-full" />
        </div>
      </div>
    </div>
  )
}
