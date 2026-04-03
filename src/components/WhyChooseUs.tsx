import { motion } from "framer-motion";
import { Award, Clock, Users, MapPin } from "lucide-react";

const reasons = [
  { icon: Award, title: "Professional Artistry", desc: "Skilled techniques in both traditional and airbrush makeup." },
  { icon: Users, title: "Personalized Service", desc: "Every client receives a tailored, boutique beauty experience." },
  { icon: Clock, title: "Long-Lasting Results", desc: "Looks that stay flawless from the first moment to the last dance." },
  { icon: MapPin, title: "Heart of Woodbrook", desc: "Conveniently located on Warren Street in Port of Spain." },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-primary font-body text-sm tracking-[0.2em] uppercase mb-4">Why Us</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
            Why Clients Choose Reinvention
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <r.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{r.title}</h3>
              <p className="font-body text-sm text-muted-foreground">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
