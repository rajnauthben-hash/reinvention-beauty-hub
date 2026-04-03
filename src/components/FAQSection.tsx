import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What types of makeup services do you offer?",
    a: "We offer traditional makeup application and professional airbrush makeup for everyday glam, special events, bridal parties, editorial shoots, and more.",
  },
  {
    q: "Do you offer bridal makeup trials?",
    a: "Yes! We recommend a bridal trial consultation before your wedding day so we can perfect your look together and ensure you feel confident and beautiful.",
  },
  {
    q: "Can you accommodate bridal parties?",
    a: "Absolutely. We can handle full bridal party bookings including bridesmaids, mothers of the bride/groom, and flower girls. Contact us early to secure your date.",
  },
  {
    q: "Do you offer on-location services?",
    a: "Yes, on-location services are available for weddings, events, and photoshoots. Please inquire for availability and details.",
  },
  {
    q: "How do I book an appointment?",
    a: "You can use the appointment request form on this page, call us at (868) 723-0123, or send an email to reinvention.slk@gmail.com. We'll confirm your booking promptly.",
  },
  {
    q: "Where are you located?",
    a: "We're located at 40 Warren Street, Woodbrook, Port of Spain, Trinidad and Tobago — right in the heart of Woodbrook.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-28 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-primary font-body text-sm tracking-[0.2em] uppercase mb-4">FAQ</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border border-border/50 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-display text-base font-medium text-foreground pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 font-body text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
