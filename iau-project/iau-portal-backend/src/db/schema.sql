CREATE TABLE IF NOT EXISTS complaints (
  id                    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  crn                   VARCHAR(20)  NOT NULL UNIQUE,
  submission_type       ENUM('Named','Anonymous') NOT NULL DEFAULT 'Named',
  reporter_category     VARCHAR(60)  NOT NULL,
  full_name             VARCHAR(120) DEFAULT NULL,
  staff_id              VARCHAR(40)  DEFAULT NULL,
  division              VARCHAR(120) DEFAULT NULL,
  reporter_designation  VARCHAR(120) DEFAULT NULL,
  contact_email         VARCHAR(200) DEFAULT NULL,
  contact_tel           VARCHAR(30)  DEFAULT NULL,
  preferred_contact     VARCHAR(30)  DEFAULT NULL,
  complaint_category    VARCHAR(80)  NOT NULL,
  incident_date_from    DATE         NOT NULL,
  incident_date_to      DATE         DEFAULT NULL,
  incident_location     VARCHAR(255) NOT NULL,
  frequency             VARCHAR(40)  NOT NULL,
  description           TEXT         NOT NULL,
  awareness_method      VARCHAR(60)  NOT NULL,
  previously_reported   ENUM('Yes','No') NOT NULL,
  previous_report_details TEXT       DEFAULT NULL,
  subject_names         VARCHAR(500) DEFAULT NULL,
  subject_designation   VARCHAR(120) DEFAULT NULL,
  subject_org           VARCHAR(40)  DEFAULT NULL,
  subject_relationship  VARCHAR(40)  DEFAULT NULL,
  involves_senior_mgmt  ENUM('Yes','No','Unsure') NOT NULL,
  senior_names          VARCHAR(500) DEFAULT NULL,
  ciaboc_escalation     TINYINT(1)   NOT NULL DEFAULT 0,
  has_evidence          ENUM('Yes','No') NOT NULL,
  evidence_types        VARCHAR(500) DEFAULT NULL,
  witness_names         VARCHAR(500) DEFAULT NULL,
  additional_info       TEXT         DEFAULT NULL,
  status                ENUM('Submitted','Under Review','Escalated','Closed','Rejected') NOT NULL DEFAULT 'Submitted',
  submitted_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ip_address            VARCHAR(45)  DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX idx_crn (crn),
  INDEX idx_status (status),
  INDEX idx_submitted_at (submitted_at),
  INDEX idx_ciaboc (ciaboc_escalation)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS complaint_files (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  complaint_id  INT UNSIGNED NOT NULL,
  crn           VARCHAR(20)  NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  stored_name   VARCHAR(255) NOT NULL,
  mime_type     VARCHAR(100) NOT NULL,
  file_size     INT UNSIGNED NOT NULL,
  uploaded_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_complaint_id (complaint_id),
  INDEX idx_crn (crn),
  CONSTRAINT fk_files_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audit_log (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  event_type  VARCHAR(60)     NOT NULL,
  crn         VARCHAR(20)     DEFAULT NULL,
  actor       VARCHAR(120)    DEFAULT NULL,
  description TEXT            DEFAULT NULL,
  ip_address  VARCHAR(45)     DEFAULT NULL,
  occurred_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_crn (crn),
  INDEX idx_event_type (event_type),
  INDEX idx_occurred (occurred_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS crn_sequence (
  year     SMALLINT UNSIGNED NOT NULL,
  last_seq INT UNSIGNED      NOT NULL DEFAULT 0,
  PRIMARY KEY (year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS admin_users (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username      VARCHAR(60)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name     VARCHAR(120) DEFAULT NULL,
  role          ENUM('admin','super_admin') NOT NULL DEFAULT 'admin',
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  last_login    DATETIME     DEFAULT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default admin account: username=admin  password=Admin12345
INSERT IGNORE INTO admin_users (username, password_hash, full_name, role)
VALUES (
  'admin',
  '$2b$12$XdlDwXW5.I2yvWhXiiIrBOjU4IPQle3C6PDCnCeObZ8zFkJji5sj6',
  'IAU Administrator',
  'super_admin'
);
