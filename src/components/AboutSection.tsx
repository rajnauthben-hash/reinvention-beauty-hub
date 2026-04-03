import { motion } from "framer-motion";
import aboutImage from "@/assets/about-image.jpg";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <img
                src={aboutImage}
                alt="Reinvention Beauty Bar studio"
                className="w-full rounded-lg shadow-2xl"
                loading="lazy"
                width={800}
                height={1024}
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 rounded-lg -z-10" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-primary font-body text-sm tracking-[0.2em] uppercase mb-4">About the Brand</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6 leading-tight">
              Where Beauty Meets{" "}
              <span className="italic text-primary">Artistry</span>
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-6">
              Reinvention Beauty Bar is a full-service beauty salon in the heart of Woodbrook, Port of Spain.
              Founded by Sabrina Look Kin, we combine professional makeup artistry with a warm, boutique salon
              experience that makes every client feel confident and beautiful.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              Whether you're preparing for your wedding day, a special event, or simply want to treat yourself,
              our team delivers polished results using both traditional and airbrushed makeup techniques.
            </p>
            <a
              href="#services"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md font-body text-sm font-medium tracking-wide uppercase hover:opacity-90 transition-opacity"
            >
              Explore Our Services
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
