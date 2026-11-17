  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (service_id, service_date, number)
);
