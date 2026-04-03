import { motion } from "framer-motion";
import { Sparkles, Palette, Scissors, Heart, Star, Gem } from "lucide-react";

const services = [
  {
    icon: Palette,
    title: "Traditional Makeup",
    description: "Expert application for everyday glam, events, and special occasions using premium products.",
  },
  {
    icon: Sparkles,
    title: "Airbrush Makeup",
    description: "Flawless, long-lasting coverage with professional airbrush technique for a seamless finish.",
  },
  {
    icon: Heart,
    title: "Bridal Makeup",
    description: "Your dream bridal look, from trial to wedding day, crafted to photograph beautifully.",
  },
  {
    icon: Scissors,
    title: "Beauty Salon Services",
    description: "Full salon experience including hair styling, treatments, and beauty enhancements.",
  },
  {
    icon: Star,
    title: "Event & Editorial",
    description: "Professional makeup for photoshoots, fashion shows, and editorial productions.",
  },
  {
    icon: Gem,
    title: "Beauty Consultation",
    description: "Personalized beauty advice and product recommendations tailored to your needs.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 md:py-32 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-body text-sm tracking-[0.2em] uppercase mb-4">What We Offer</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Our Services
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            From everyday beauty to bridal perfection, we offer a range of services designed to make you look and feel your best.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card p-8 rounded-lg border border-border/50 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">{service.title}</h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="#book"
            className="inline-block bg-primary text-primary-foreground px-8 py-3.5 rounded-md font-body text-sm font-medium tracking-wide uppercase hover:opacity-90 transition-opacity"
          >
            Inquire About Services
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
