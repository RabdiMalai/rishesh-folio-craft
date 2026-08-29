
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;

CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());

CREATE OR REPLACE FUNCTION public.claim_admin() RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN RETURN false; END IF;
  INSERT INTO public.user_roles(user_id, role) VALUES (uid, 'admin') ON CONFLICT DO NOTHING;
  RETURN true;
END; $$;
GRANT EXECUTE ON FUNCTION public.claim_admin() TO authenticated;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL DEFAULT '',
  professional_title text NOT NULL DEFAULT '',
  tagline text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  about_heading text NOT NULL DEFAULT '',
  biography text NOT NULL DEFAULT '',
  short_description text NOT NULL DEFAULT '',
  professional_focus text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  current_status text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  profile_image_url text,
  is_active boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.skill_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.skill_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  level text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  degree text NOT NULL,
  field text,
  institution text NOT NULL,
  location text,
  score text,
  start_year text,
  end_year text,
  description text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  role text NOT NULL,
  location text,
  employment_type text,
  start_date text,
  end_date text,
  is_current boolean NOT NULL DEFAULT false,
  description text,
  responsibilities text[] NOT NULL DEFAULT '{}',
  technologies text[] NOT NULL DEFAULT '{}',
  company_logo_url text,
  company_website text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.leadership_experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  organization text,
  role text,
  date_range text,
  description text,
  responsibilities text[] NOT NULL DEFAULT '{}',
  metrics jsonb NOT NULL DEFAULT '[]'::jsonb,
  impact text,
  recognition text,
  logo_url text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text,
  category text,
  status text,
  overview text,
  description text,
  problem text,
  solution text,
  contribution text,
  features text[] NOT NULL DEFAULT '{}',
  technologies text[] NOT NULL DEFAULT '{}',
  metrics jsonb NOT NULL DEFAULT '[]'::jsonb,
  github_url text,
  live_url text,
  docs_url text,
  cover_image_url text,
  images text[] NOT NULL DEFAULT '{}',
  start_date text,
  end_date text,
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  issuer text,
  issue_date text,
  credential_id text,
  credential_url text,
  file_url text,
  description text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  metric text,
  description text,
  context text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.positions_of_responsibility (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  organization text,
  date_range text,
  description text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL DEFAULT 'Resume',
  file_path text NOT NULL,
  file_name text,
  is_active boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  label text,
  url text NOT NULL,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_title text NOT NULL DEFAULT '',
  meta_title text NOT NULL DEFAULT '',
  meta_description text NOT NULL DEFAULT '',
  favicon_url text,
  og_image_url text,
  accent_color text NOT NULL DEFAULT '#E2703A',
  default_theme text NOT NULL DEFAULT 'dark',
  footer_text text NOT NULL DEFAULT '',
  contact_email text NOT NULL DEFAULT '',
  copyright text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL DEFAULT '',
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['profiles','skill_categories','skills','education','experiences','leadership_experiences','projects','certifications','achievements','positions_of_responsibility','resumes','social_links','site_settings']
  LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon;', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated;', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role;', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('CREATE POLICY "public read active %1$s" ON public.%1$I FOR SELECT TO anon, authenticated USING (is_active = true);', t);
    EXECUTE format('CREATE POLICY "admin manage %1$s" ON public.%1$I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());', t);
    EXECUTE format('CREATE TRIGGER set_updated_at_%1$s BEFORE UPDATE ON public.%1$I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();', t);
  END LOOP;
END $$;

GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can send a message" ON public.contact_messages FOR INSERT TO anon, authenticated
  WITH CHECK (length(name) BETWEEN 1 AND 100 AND length(email) BETWEEN 3 AND 255 AND length(message) BETWEEN 1 AND 2000 AND length(subject) <= 200);
CREATE POLICY "admin manage contact_messages" ON public.contact_messages FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER set_updated_at_contact_messages BEFORE UPDATE ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "public read portfolio media" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id IN ('profile-images','project-images','logos','certificates','resumes'));
CREATE POLICY "admin write portfolio media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('profile-images','project-images','logos','certificates','resumes') AND public.is_admin());
CREATE POLICY "admin update portfolio media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('profile-images','project-images','logos','certificates','resumes') AND public.is_admin());
CREATE POLICY "admin delete portfolio media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('profile-images','project-images','logos','certificates','resumes') AND public.is_admin());

INSERT INTO public.profiles (full_name, professional_title, tagline, summary, about_heading, biography, short_description, professional_focus, location, current_status, email, phone)
VALUES (
 'Rishesh Shukla',
 'AI/ML • Data Science • Software Engineering • Leadership',
 'Leading with Logic | Designing with Data | Building for Impact',
 'Versatile CS undergraduate with expertise in AI/ML, data-driven systems, and event leadership, combining technical excellence with strategic, creative, and collaborative impact.',
 'About',
 'Versatile CS undergraduate with expertise in AI/ML, data-driven systems, and event leadership, combining technical excellence with strategic, creative, and collaborative impact.',
 'AI/ML and data-driven systems, built with engineering rigour and led with people in mind.',
 'AI/ML, Data-driven systems, Software Development, Leadership, Event Management',
 'India',
 'Undergraduate — IIT Madras & KIET Group of Institutions',
 'risheshshukla12@gmail.com',
 '8931993353'
);

INSERT INTO public.site_settings (site_title, meta_title, meta_description, footer_text, contact_email, copyright)
VALUES ('Rishesh Shukla', 'Rishesh Shukla | AI/ML & Data Science',
 'Versatile CS undergraduate with expertise in AI/ML, data-driven systems, and event leadership, combining technical excellence with strategic, creative, and collaborative impact.',
 'Leading with Logic | Designing with Data | Building for Impact',
 'risheshshukla12@gmail.com',
 '© 2026 Rishesh Shukla');

INSERT INTO public.education (degree, field, institution, location, score, start_year, end_year, display_order) VALUES
 ('Bachelor of Science','Data Science and Applications','IIT Madras','Adyar, Chennai, India','CGPA: 7.79','2022','Present',1),
 ('Bachelor of Technology','Computer Science and Engineering','KIET Group of Institutions','Ghaziabad, India','CGPA: 8.5','2023','Present',2),
 ('Intermediate',NULL,'MV Convent Inter College','Prayagraj, India','Score: 93.83%',NULL,'2022',3);

INSERT INTO public.skill_categories (id, name, display_order) VALUES
 ('11111111-1111-4111-8111-111111111111','Programming Languages',1),
 ('22222222-2222-4222-8222-222222222222','Frameworks & Libraries',2),
 ('33333333-3333-4333-8333-333333333333','Tools & Platforms',3),
 ('44444444-4444-4444-8444-444444444444','Soft Skills',4);

INSERT INTO public.skills (category_id, name, display_order) VALUES
 ('11111111-1111-4111-8111-111111111111','Python',1),
 ('11111111-1111-4111-8111-111111111111','Java',2),
 ('11111111-1111-4111-8111-111111111111','C',3),
 ('11111111-1111-4111-8111-111111111111','Bash scripting',4),
 ('11111111-1111-4111-8111-111111111111','MySQL',5),
 ('22222222-2222-4222-8222-222222222222','scikit-learn',1),
 ('22222222-2222-4222-8222-222222222222','Pandas',2),
 ('22222222-2222-4222-8222-222222222222','NumPy',3),
 ('22222222-2222-4222-8222-222222222222','Matplotlib',4),
 ('22222222-2222-4222-8222-222222222222','OpenCV',5),
 ('22222222-2222-4222-8222-222222222222','Flask',6),
 ('33333333-3333-4333-8333-333333333333','Anaconda',1),
 ('33333333-3333-4333-8333-333333333333','Jupyter',2),
 ('33333333-3333-4333-8333-333333333333','Git',3),
 ('33333333-3333-4333-8333-333333333333','Canva',4),
 ('33333333-3333-4333-8333-333333333333','Google Workspace',5),
 ('33333333-3333-4333-8333-333333333333','Linux (Ubuntu)',6),
 ('44444444-4444-4444-8444-444444444444','Event Planning & Management',1),
 ('44444444-4444-4444-8444-444444444444','Public Speaking & Presentation',2),
 ('44444444-4444-4444-8444-444444444444','Professional Communication',3),
 ('44444444-4444-4444-8444-444444444444','Leadership & Team Coordination',4),
 ('44444444-4444-4444-8444-444444444444','Time Management & Deadline Handling',5),
 ('44444444-4444-4444-8444-444444444444','Critical Thinking & Problem Solving',6),
 ('44444444-4444-4444-8444-444444444444','Adaptability & Creative Thinking',7),
 ('44444444-4444-4444-8444-444444444444','Strategic Decision-Making',8),
 ('44444444-4444-4444-8444-444444444444','Collaboration & Interpersonal Skills',9);

INSERT INTO public.projects (title, slug, description, overview, contribution, features, technologies, metrics, is_featured, display_order) VALUES
 ('SkillHub – AI-Powered Exam Proctoring','skillhub-ai-exam-proctoring',
  'Patent-pending solution ensuring integrity in remote exams.',
  'Patent-pending solution ensuring integrity in remote exams.',
  'Handled model calibration & testing.',
  ARRAY['Iris tracking','Audio classification','Speech-to-text alerts'],
  ARRAY['React','MediaPipe','OpenCV','Python'],
  '[{"label":"Status","value":"Patent-pending"}]'::jsonb, true, 1),
 ('NIFTY 50 Stock Predictor','nifty-50-stock-predictor',
  'Real-time ML model using ensemble methods.',
  'Real-time ML model using ensemble methods. Currently integrating NLP-based news sentiment analysis.',
  NULL, ARRAY[]::text[], ARRAY['Random Forest','XGBoost'],
  '[{"label":"MSE","value":"108.66"},{"label":"Variance score","value":"0.98"}]'::jsonb, true, 2),
 ('Tools in Data Science Virtual Teaching Assistant','tds-virtual-teaching-assistant',
  'LLM-powered query assistant using FastAPI, Gemini API, and Discourse scraping.',
  'LLM-powered query assistant using FastAPI, Gemini API, and Discourse scraping.',
  NULL,
  ARRAY['JSON schema validation','Rubric scoring','Real-time deployment on Render'],
  ARRAY['FastAPI','Gemini API','JSON Schema','Discourse scraping','Render'],
  '[{"label":"Test pass rate","value":"87%"},{"label":"Queries covered","value":"10+"}]'::jsonb, false, 3),
 ('Real-Time Fraud Detection System','real-time-fraud-detection',
  'Streaming fraud detection service built on an ensemble model with sub-5ms latency.',
  'Streaming fraud detection service built on an ensemble model with sub-5ms latency.',
  NULL,
  ARRAY['FastAPI API','Kafka streaming','Redis caching','Ensemble model'],
  ARRAY['LightGBM','Random Forest','XGBoost','FastAPI','Kafka','Redis'],
  '[{"label":"Precision","value":"1.00"},{"label":"Recall","value":"0.935"},{"label":"F1-score","value":"0.966"},{"label":"Latency","value":"~3ms"}]'::jsonb, false, 4);

INSERT INTO public.leadership_experiences (title, organization, role, responsibilities, metrics, recognition, impact, display_order) VALUES
 ('Python Coding Challenge (2.0 – Online, 3.0 – Offline)','Paradox — IIT Madras','Core Organiser',
  ARRAY['Led PR','Question design','Documentation','Collaborated with CodeChef for 2.0','Collaborated with Coding Ninjas for 3.0'],
  '[{"value":"80+","label":"Recruitment interviews"},{"value":"10+","label":"Finalist rounds"}]'::jsonb,
  'Recognized as the fest''s most elite technical event by IIT Madras.', NULL, 1),
 ('Smart India Hackathon''24 (SIH)','Ministry of Power','Social Media Lead',
  ARRAY['Led 24/7 live social media coverage during a 5-day national event under Ministry of Power'],
  '[{"value":"8K–10K","label":"Average reach per post"},{"value":"100K+","label":"Reach on some posts"}]'::jsonb,
  NULL, NULL, 2),
 ('Innotech''24','Tech Fest','PR & Sponsorships Lead',
  ARRAY['Managed PR','Managed Sponsorships','Led outreach','Partner onboarding','Branding initiatives'],
  '[]'::jsonb, NULL, NULL, 3),
 ('Reminiscence''24','Alumni Meet','Co-Lead',
  ARRAY['Hospitality','Engagement','Logistics'],
  '[{"value":"50+","label":"Member team"},{"value":"250+","label":"Alumni hosted"}]'::jsonb, NULL, NULL, 4),
 ('International Education Awareness Week 2025 (IEAW)','International Relations Cell','Education Fair Lead',
  ARRAY['Coordinated 30+ international universities','Ran 15 sessions','Led the Education Fair'],
  '[{"value":"30+","label":"International universities"},{"value":"15","label":"Sessions"},{"value":"750+","label":"Participants"}]'::jsonb, NULL, NULL, 5),
 ('Epoque@Prastuti''25 & 26','Prastuti','Inter-Institute Vertical Lead',
  ARRAY['Guest management','Sponsorships','Judge coordination','Hospitality','Team motivation','Outreach'],
  '[{"value":"500+","label":"Participants"},{"value":"40+","label":"Colleges across India"}]'::jsonb,
  NULL, 'Drove team motivation, resulting in thousands of outreach calls and record-breaking participation.', 6);

INSERT INTO public.positions_of_responsibility (title, organization, date_range, display_order) VALUES
 ('President — Department of PR & IR','KIET Group of Institutions',NULL,1),
 ('President — CRPC Department','KIET Group of Institutions',NULL,2),
 ('Vice President — International Relations Cell','KIET Group of Institutions','November 2024 – November 2025',3);

INSERT INTO public.certifications (name, issuer, display_order) VALUES
 ('Machine Learning with Python','IBM',1),
 ('Data Science Foundation','IITM',2),
 ('Microsoft Learn Student Ambassador — Data Analysis Track','Microsoft',3),
 ('SQL 50','LeetCode',4);

INSERT INTO public.achievements (title, metric, description, context, display_order) VALUES
 ('Patent-pending proctoring solution',NULL,'SkillHub — AI-powered exam proctoring is a patent-pending solution.','Projects',1),
 ('NIFTY 50 predictor performance','0.98','MSE of 108.66 with a variance score of 0.98 using ensemble methods.','Projects',2),
 ('Virtual Teaching Assistant accuracy','87%','87% test pass rate across 10+ queries.','Projects',3),
 ('Fraud detection at ~3ms latency','0.966','Precision 1.00, recall 0.935, F1-score 0.966, latency ~3ms.','Projects',4),
 ('Smart India Hackathon social reach','100K+','8K–10K average reach per post, with 100K+ reach on some posts.','Leadership',5),
 ('Epoque@Prastuti participation','500+','500+ participants from 40+ colleges across India.','Leadership',6),
 ('IEAW 2025 participation','750+','750+ participants across 15 sessions with 30+ international universities.','Leadership',7),
 ('Reminiscence''24 alumni hosted','250+','250+ alumni hosted with a 50+ member team.','Leadership',8),
 ('Python Coding Challenge recruitment','80+','80+ recruitment interviews and 10+ finalist rounds.','Leadership',9);

INSERT INTO public.social_links (platform, label, url, display_order) VALUES
 ('email','Email','mailto:risheshshukla12@gmail.com',1);
