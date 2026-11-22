
CREATE TABLE counters (
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
