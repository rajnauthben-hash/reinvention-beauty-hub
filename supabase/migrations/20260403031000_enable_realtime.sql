-- Enable real-time updates for the appointment_inquiries table so the
-- admin dashboard can receive live notifications without manual refresh.
ALTER TABLE public.appointment_inquiries REPLICA IDENTITY FULL;

ALTER publication supabase_realtime ADD TABLE public.appointment_inquiries;
