import { motion } from "framer-motion";
import bridalImage from "@/assets/bridal-feature.jpg";

const BridalSection = () => {
  return (
    <section id="bridal" className="py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 md:order-1"
          >
            <p className="text-primary font-body text-sm tracking-[0.2em] uppercase mb-4">Bridal & Events</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6 leading-tight">
              Your Perfect{" "}
              <span className="italic text-primary">Bridal Look</span>
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-6">
              Your wedding day deserves makeup that lasts from aisle to after-party. We specialize in both
              traditional and airbrushed bridal makeup, ensuring a flawless finish that photographs beautifully
              and stays perfect throughout your celebration.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Bridal makeup trials & consultations",
                "Traditional & airbrushed techniques",
                "Bridal party group bookings",
                "On-location services available",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 font-body text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="#book"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md font-body text-sm font-medium tracking-wide uppercase hover:opacity-90 transition-opacity"
            >
              Inquire for Bridal Makeup
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 md:order-2"
          >
            <div className="relative">
              <img
                src={bridalImage}
                alt="Bridal beauty preparation"
                className="w-full rounded-lg shadow-2xl"
                loading="lazy"
                width={1024}
                height={1280}
              />
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/20 rounded-lg -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BridalSection;
