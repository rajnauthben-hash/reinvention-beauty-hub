import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-charcoal text-warm-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-12 md:gap-16">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-semibold mb-4">
              Reinvention<span className="text-warm-gold"> Beauty Bar</span>
            </h3>
            <p className="font-body text-warm-cream/70 text-sm leading-relaxed mb-6">
              A premium beauty salon and makeup artistry studio in Woodbrook, Port of Spain.
              Traditional and airbrushed makeup for every occasion.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/reinventionbeautybar/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-warm-cream/10 flex items-center justify-center hover:bg-warm-gold/30 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/ReinventionbySLK/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-warm-cream/10 flex items-center justify-center hover:bg-warm-gold/30 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Get in Touch</h4>
            <div className="space-y-4">
              <a href="tel:+18687230123" className="flex items-center gap-3 font-body text-sm text-warm-cream/70 hover:text-warm-cream transition-colors">
                <Phone className="w-4 h-4 text-warm-gold" />
                (868) 723-0123
              </a>
              <a href="mailto:reinvention.slk@gmail.com" className="flex items-center gap-3 font-body text-sm text-warm-cream/70 hover:text-warm-cream transition-colors">
                <Mail className="w-4 h-4 text-warm-gold" />
                reinvention.slk@gmail.com
              </a>
              <div className="flex items-start gap-3 font-body text-sm text-warm-cream/70">
                <MapPin className="w-4 h-4 text-warm-gold flex-shrink-0 mt-0.5" />
                40 Warren Street, Woodbrook,<br />Port of Spain, Trinidad & Tobago
              </div>
            </div>
          </div>

          {/* Map */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Find Us</h4>
            <div className="rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3921.0!2d-61.525!3d10.655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sWoodbrook%2C+Port+of+Spain!5e0!3m2!1sen!2stt!4v1"
                width="100%"
                height="180"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Reinvention Beauty Bar location"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-warm-cream/10 text-center">
          <p className="font-body text-xs text-warm-cream/50">
            © {new Date().getFullYear()} Reinvention Beauty Bar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
