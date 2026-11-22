
CREATE TABLE tickets (
  id           serial PRIMARY KEY,
  service_id   integer NOT NULL REFERENCES services,
  service_date date    NOT NULL DEFAULT current_date,
  number       integer NOT NULL,
  label        text    NOT NULL,
  status       text    NOT NULL DEFAULT 'waiting'
    CHECK (status IN ('waiting', 'called', 'serving',
                      'done', 'skipped', 'cancelled')),
