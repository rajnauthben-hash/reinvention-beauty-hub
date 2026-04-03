import { motion } from "framer-motion";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import heroBg from "@/assets/hero-bg.jpg";

const images = [
  { src: gallery1, alt: "Beauty products flat lay" },
  { src: gallery2, alt: "Glamorous event makeup" },
  { src: gallery3, alt: "Beauty tools and cosmetics" },
  { src: heroBg, alt: "Reinvention Beauty Bar salon" },
];

const GalleryPreview = () => {
  return (
    <section id="gallery" className="py-20 md:py-32 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-body text-sm tracking-[0.2em] uppercase mb-4">Our Work</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Portfolio
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            A glimpse into the artistry and beauty we create every day at Reinvention Beauty Bar.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-lg group ${
                index === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover aspect-square group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                width={800}
                height={800}
              />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <a
            href="https://www.instagram.com/reinventionbeautybar/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-primary text-primary px-6 py-3 rounded-md font-body text-sm font-medium tracking-wide uppercase hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            View More on Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default GalleryPreview;
