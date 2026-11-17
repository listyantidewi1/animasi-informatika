-- SiAntre: skema database

CREATE TABLE services (
  id          serial PRIMARY KEY,
  code        char(1) NOT NULL UNIQUE,
  name        text    NOT NULL,
  avg_minutes integer NOT NULL CHECK (avg_minutes > 0)
);CREATE TABLE tickets (
  id           serial PRIMARY KEY,
  service_id   integer NOT NULL REFERENCES services,
  service_date date    NOT NULL DEFAULT current_date,
  number       integer NOT NULL,
  label        text    NOT NULL,
  status       text    NOT NULL DEFAULT 'waiting'
    CHECK (status IN ('waiting', 'called', 'serving',
                      'done', 'skipped', 'cancelled')),  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (service_id, service_date, number)
);CREATE TABLE counters (
  id   serial PRIMARY KEY,
  name text NOT NULL UNIQUE
);

CREATE TABLE counter_services (
  counter_id integer NOT NULL REFERENCES counters,
  service_id integer NOT NULL REFERENCES services,
  PRIMARY KEY (counter_id, service_id)
);

CREATE TABLE users (
  id            serial PRIMARY KEY,
  username      text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role          text NOT NULL CHECK (role IN ('admin', 'petugas')),
  counter_id    integer REFERENCES counters
);

CREATE TABLE ticket_events (
  id         serial PRIMARY KEY,
  ticket_id  integer NOT NULL REFERENCES tickets,
  status     text    NOT NULL,
  user_id    integer REFERENCES users,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE slots (
  id         serial PRIMARY KEY,
  service_id integer NOT NULL REFERENCES services,
  starts_at  timestamptz NOT NULL,
  quota      integer NOT NULL CHECK (quota > 0),
  UNIQUE (service_id, starts_at)
);

CREATE TABLE bookings (
  id         serial PRIMARY KEY,
  slot_id    integer NOT NULL REFERENCES slots,
  name       text    NOT NULL,
  phone      text    NOT NULL,
  status     text    NOT NULL DEFAULT 'booked',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Kolom yang kita tambahkan di bab 5 sampai 7
ALTER TABLE tickets  ADD COLUMN code text UNIQUE;
ALTER TABLE tickets  ADD COLUMN counter_id integer REFERENCES counters;
ALTER TABLE bookings ADD COLUMN code text UNIQUE;