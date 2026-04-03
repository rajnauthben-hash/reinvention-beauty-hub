CREATE TABLE public.appointment_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  preferred_date DATE,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.appointment_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit appointment inquiry"
  ON public.appointment_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "No public read access"
  ON public.appointment_inquiries
  FOR SELECT
  USING (false);