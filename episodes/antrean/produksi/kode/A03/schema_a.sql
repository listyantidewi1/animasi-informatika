-- SiAntre: skema database

CREATE TABLE services (
  id          serial PRIMARY KEY,
  code        char(1) NOT NULL UNIQUE,
  name        text    NOT NULL,
  avg_minutes integer NOT NULL CHECK (avg_minutes > 0)
);
