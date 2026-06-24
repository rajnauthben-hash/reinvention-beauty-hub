import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const serviceOptions = [
  "Traditional Makeup",
  "Airbrush Makeup",
  "Bridal Makeup",
  "Event Makeup",
  "Beauty Salon Services",
  "Beauty Consultation",
  "Other",
];

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.service) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const booking = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        service: formData.service,
        preferred_date: formData.date || null,
        message: formData.message.trim() || null,
      };

      const { error } = await supabase.from("appointment_inquiries").insert(booking);

      if (error) throw error;

      // Send confirmation to client + alert to admin (non-blocking)
      supabase.functions
        .invoke("send-email", { body: { type: "new_booking", booking } })
        .catch(() => {});

      toast.success("Your appointment request has been submitted! We'll be in touch shortly.");
      setFormData({ name: "", email: "", phone: "", service: "", date: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please call us at (868) 723-0123 to book.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="book" className="py-20 md:py-32 bg-secondary/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-primary font-body text-sm tracking-[0.2em] uppercase mb-4">Book With Us</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Request an Appointment
          </h2>
          <p className="font-body text-muted-foreground">
            Fill out the form below and we'll get back to you to confirm your booking.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-card p-8 md:p-10 rounded-lg border border-border/50 shadow-lg space-y-6"
        >
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-body text-sm font-medium text-foreground mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={100}
                className="w-full px-4 py-3 rounded-md border border-input bg-background font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-foreground mb-2">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                maxLength={20}
                className="w-full px-4 py-3 rounded-md border border-input bg-background font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="(868) 000-0000"
              />
            </div>
          </div>

          <div>
            <label className="block font-body text-sm font-medium text-foreground mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              maxLength={255}
              className="w-full px-4 py-3 rounded-md border border-input bg-background font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="your@email.com"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-body text-sm font-medium text-foreground mb-2">Service *</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-md border border-input bg-background font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select a service</option>
                {serviceOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-foreground mb-2">Preferred Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md border border-input bg-background font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="block font-body text-sm font-medium text-foreground mb-2">Additional Details</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              maxLength={1000}
              className="w-full px-4 py-3 rounded-md border border-input bg-background font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Tell us about your event, bridal party size, or any special requests..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-4 rounded-md font-body text-sm font-medium tracking-wide uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Appointment Request"}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default AppointmentForm;
