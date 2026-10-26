CREATE TABLE public.rsvp_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  attending boolean NOT NULL,
  adults int NOT NULL DEFAULT 1 CHECK (adults BETWEEN 0 AND 20),
  children int NOT NULL DEFAULT 0 CHECK (children BETWEEN 0 AND 20),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 30),
  message text CHECK (message IS NULL OR char_length(message) <= 500),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.rsvp_responses TO anon, authenticated;
GRANT ALL ON public.rsvp_responses TO service_role;
ALTER TABLE public.rsvp_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit RSVP" ON public.rsvp_responses FOR INSERT TO anon, authenticated WITH CHECK (true);