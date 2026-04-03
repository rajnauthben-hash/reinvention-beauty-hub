import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Reinvention Beauty Bar salon interior"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-charcoal/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-warm-gold font-body text-sm md:text-base tracking-[0.3em] uppercase mb-6"
        >
          Woodbrook, Port of Spain
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold text-warm-cream leading-tight mb-6"
        >
          Beauty, Glam &{" "}
          <span className="italic text-warm-gold">Confidence</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-body text-warm-cream/80 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          A polished beauty experience with salon services and professional makeup artistry —
          including traditional and airbrushed makeup for everyday glam, events, and bridal moments.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#book"
            className="bg-primary text-primary-foreground px-8 py-4 rounded-md font-body text-sm font-medium tracking-wide uppercase hover:opacity-90 transition-opacity"
          >
            Book Appointment
          </a>
          <a
            href="#services"
            className="border border-warm-cream/40 text-warm-cream px-8 py-4 rounded-md font-body text-sm font-medium tracking-wide uppercase hover:bg-warm-cream/10 transition-colors"
          >
            View Services
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-5 h-8 border-2 border-warm-cream/40 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-warm-cream/60 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
