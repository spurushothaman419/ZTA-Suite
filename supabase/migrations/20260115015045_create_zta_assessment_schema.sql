/*
  # Zero Trust Architecture Assessment Project Management Schema

  ## Overview
  Complete database schema for managing ZTA assessment engagements following CISA ZTMM methodology.
  Supports 24-week project lifecycle from mobilization through executive readout.

  ## New Tables

  ### Core Project Management
  - `projects` - Master project/engagement records
    - `id` (uuid, primary key)
    - `name` (text) - Project name
    - `client_name` (text) - e.g., "CDSS"
    - `start_date` (date)
    - `end_date` (date)
    - `status` (text) - active, completed, on-hold
    - `created_by` (uuid, references auth.users)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  - `phases` - Project phases (0-5)
    - `id` (uuid, primary key)
    - `project_id` (uuid, references projects)
    - `phase_number` (int) - 0-5
    - `name` (text)
    - `objective` (text)
    - `start_week` (int)
    - `end_week` (int)
    - `status` (text) - not-started, in-progress, completed
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  - `tasks` - Tasks within phases
    - `id` (uuid, primary key)
    - `phase_id` (uuid, references phases)
    - `title` (text)
    - `description` (text)
    - `assigned_to` (uuid, references auth.users)
    - `status` (text) - pending, in-progress, completed, blocked
    - `priority` (text) - low, medium, high, critical
    - `due_date` (date)
    - `completed_at` (timestamptz)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  - `deliverables` - Phase deliverables
    - `id` (uuid, primary key)
    - `phase_id` (uuid, references phases)
    - `name` (text)
    - `description` (text)
    - `status` (text) - not-started, draft, review, approved
    - `due_date` (date)
    - `owner` (uuid, references auth.users)
    - `acceptance_criteria` (text)
    - `approved_at` (timestamptz)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### RAID Log
  - `raid_items` - Risks, Assumptions, Issues, Dependencies
    - `id` (uuid, primary key)
    - `project_id` (uuid, references projects)
    - `type` (text) - risk, assumption, issue, dependency
    - `title` (text)
    - `description` (text)
    - `status` (text) - open, monitoring, mitigated, closed
    - `severity` (text) - low, medium, high, critical
    - `owner` (uuid, references auth.users)
    - `mitigation_plan` (text)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### Stakeholder Management
  - `stakeholders` - Project stakeholders
    - `id` (uuid, primary key)
    - `project_id` (uuid, references projects)
    - `name` (text)
    - `role` (text)
    - `organization` (text)
    - `email` (text)
    - `phone` (text)
    - `notes` (text)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  - `raci_matrix` - RACI assignments
    - `id` (uuid, primary key)
    - `project_id` (uuid, references projects)
    - `activity` (text)
    - `responsible` (uuid[], array of stakeholder ids)
    - `accountable` (uuid[], array of stakeholder ids)
    - `consulted` (uuid[], array of stakeholder ids)
    - `informed` (uuid[], array of stakeholder ids)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### Evidence & Documentation
  - `evidence` - Document and evidence tracking
    - `id` (uuid, primary key)
    - `project_id` (uuid, references projects)
    - `document_name` (text)
    - `document_type` (text) - policy, diagram, audit, config, etc.
    - `owner` (text)
    - `relevance` (text)
    - `received_date` (date)
    - `file_url` (text)
    - `notes` (text)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### ZTA Maturity Assessment
  - `zta_pillars` - CISA ZTA pillars
    - `id` (uuid, primary key)
    - `project_id` (uuid, references projects)
    - `pillar_name` (text) - Identity, Device, Network, App/Workload, Data, Visibility/Analytics, Automation/Orchestration
    - `description` (text)
    - `created_at` (timestamptz)

  - `zta_capabilities` - Capabilities within pillars
    - `id` (uuid, primary key)
    - `pillar_id` (uuid, references zta_pillars)
    - `capability_name` (text)
    - `current_control` (text)
    - `evidence` (text)
    - `maturity_level` (text) - Traditional, Initial, Advanced, Optimal
    - `gap_description` (text)
    - `risk_level` (text) - low, medium, high, critical
    - `recommendation` (text)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### Status Reporting
  - `weekly_status` - Weekly status reports
    - `id` (uuid, primary key)
    - `project_id` (uuid, references projects)
    - `week_number` (int)
    - `week_ending` (date)
    - `progress_summary` (text)
    - `blockers` (text)
    - `risks` (text)
    - `next_week_plan` (text)
    - `submitted_by` (uuid, references auth.users)
    - `created_at` (timestamptz)

  ### Roadmap
  - `roadmap_items` - Implementation roadmap items
    - `id` (uuid, primary key)
    - `project_id` (uuid, references projects)
    - `workstream` (text) - Identity, Device, Network, Apps/Workloads, Data, Visibility/Analytics, Governance
    - `initiative_name` (text)
    - `objective` (text)
    - `tasks` (text)
    - `owner_type` (text)
    - `dependencies` (text)
    - `timeline` (text) - 12-month, 24-month, 36-month
    - `success_metrics` (text)
    - `priority` (text) - quick-win, foundational, maturity-expansion, optimization
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Policies for authenticated users to access project data they're involved in
*/

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  client_name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text DEFAULT 'active',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view projects they created"
  ON projects FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete their projects"
  ON projects FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- Phases table
CREATE TABLE IF NOT EXISTS phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  phase_number int NOT NULL,
  name text NOT NULL,
  objective text NOT NULL,
  start_week int NOT NULL,
  end_week int NOT NULL,
  status text DEFAULT 'not-started',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE phases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view phases of their projects"
  ON phases FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = phases.project_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create phases for their projects"
  ON phases FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = phases.project_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update phases of their projects"
  ON phases FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = phases.project_id
      AND projects.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = phases.project_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete phases of their projects"
  ON phases FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = phases.project_id
      AND projects.created_by = auth.uid()
    )
  );

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id uuid REFERENCES phases(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  assigned_to uuid REFERENCES auth.users(id),
  status text DEFAULT 'pending',
  priority text DEFAULT 'medium',
  due_date date,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tasks of their projects"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM phases
      JOIN projects ON projects.id = phases.project_id
      WHERE phases.id = tasks.phase_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create tasks for their projects"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM phases
      JOIN projects ON projects.id = phases.project_id
      WHERE phases.id = tasks.phase_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update tasks of their projects"
  ON tasks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM phases
      JOIN projects ON projects.id = phases.project_id
      WHERE phases.id = tasks.phase_id
      AND projects.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM phases
      JOIN projects ON projects.id = phases.project_id
      WHERE phases.id = tasks.phase_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete tasks of their projects"
  ON tasks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM phases
      JOIN projects ON projects.id = phases.project_id
      WHERE phases.id = tasks.phase_id
      AND projects.created_by = auth.uid()
    )
  );

-- Deliverables table
CREATE TABLE IF NOT EXISTS deliverables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id uuid REFERENCES phases(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  status text DEFAULT 'not-started',
  due_date date,
  owner uuid REFERENCES auth.users(id),
  acceptance_criteria text,
  approved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view deliverables of their projects"
  ON deliverables FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM phases
      JOIN projects ON projects.id = phases.project_id
      WHERE phases.id = deliverables.phase_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create deliverables for their projects"
  ON deliverables FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM phases
      JOIN projects ON projects.id = phases.project_id
      WHERE phases.id = deliverables.phase_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update deliverables of their projects"
  ON deliverables FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM phases
      JOIN projects ON projects.id = phases.project_id
      WHERE phases.id = deliverables.phase_id
      AND projects.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM phases
      JOIN projects ON projects.id = phases.project_id
      WHERE phases.id = deliverables.phase_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete deliverables of their projects"
  ON deliverables FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM phases
      JOIN projects ON projects.id = phases.project_id
      WHERE phases.id = deliverables.phase_id
      AND projects.created_by = auth.uid()
    )
  );

-- RAID items table
CREATE TABLE IF NOT EXISTS raid_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  description text,
  status text DEFAULT 'open',
  severity text DEFAULT 'medium',
  owner uuid REFERENCES auth.users(id),
  mitigation_plan text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE raid_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view RAID items of their projects"
  ON raid_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = raid_items.project_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create RAID items for their projects"
  ON raid_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = raid_items.project_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update RAID items of their projects"
  ON raid_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = raid_items.project_id
      AND projects.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = raid_items.project_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete RAID items of their projects"
  ON raid_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = raid_items.project_id
      AND projects.created_by = auth.uid()
    )
  );

-- Stakeholders table
CREATE TABLE IF NOT EXISTS stakeholders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL,
  organization text,
  email text,
  phone text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE stakeholders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view stakeholders of their projects"
  ON stakeholders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = stakeholders.project_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create stakeholders for their projects"
  ON stakeholders FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = stakeholders.project_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update stakeholders of their projects"
  ON stakeholders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = stakeholders.project_id
      AND projects.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = stakeholders.project_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete stakeholders of their projects"
  ON stakeholders FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = stakeholders.project_id
      AND projects.created_by = auth.uid()
    )
  );

-- Evidence table
CREATE TABLE IF NOT EXISTS evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  document_name text NOT NULL,
  document_type text NOT NULL,
  owner text,
  relevance text,
  received_date date,
  file_url text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view evidence of their projects"
  ON evidence FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = evidence.project_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create evidence for their projects"
  ON evidence FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = evidence.project_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update evidence of their projects"
  ON evidence FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = evidence.project_id
      AND projects.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = evidence.project_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete evidence of their projects"
  ON evidence FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = evidence.project_id
      AND projects.created_by = auth.uid()
    )
  );

-- ZTA Pillars table
CREATE TABLE IF NOT EXISTS zta_pillars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  pillar_name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE zta_pillars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view ZTA pillars of their projects"
  ON zta_pillars FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = zta_pillars.project_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create ZTA pillars for their projects"
  ON zta_pillars FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = zta_pillars.project_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update ZTA pillars of their projects"
  ON zta_pillars FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = zta_pillars.project_id
      AND projects.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = zta_pillars.project_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete ZTA pillars of their projects"
  ON zta_pillars FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = zta_pillars.project_id
      AND projects.created_by = auth.uid()
    )
  );

-- ZTA Capabilities table
CREATE TABLE IF NOT EXISTS zta_capabilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar_id uuid REFERENCES zta_pillars(id) ON DELETE CASCADE,
  capability_name text NOT NULL,
  current_control text,
  evidence text,
  maturity_level text DEFAULT 'Traditional',
  gap_description text,
  risk_level text DEFAULT 'medium',
  recommendation text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE zta_capabilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view ZTA capabilities of their projects"
  ON zta_capabilities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM zta_pillars
      JOIN projects ON projects.id = zta_pillars.project_id
      WHERE zta_pillars.id = zta_capabilities.pillar_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create ZTA capabilities for their projects"
  ON zta_capabilities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM zta_pillars
      JOIN projects ON projects.id = zta_pillars.project_id
      WHERE zta_pillars.id = zta_capabilities.pillar_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update ZTA capabilities of their projects"
  ON zta_capabilities FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM zta_pillars
      JOIN projects ON projects.id = zta_pillars.project_id
      WHERE zta_pillars.id = zta_capabilities.pillar_id
      AND projects.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM zta_pillars
      JOIN projects ON projects.id = zta_pillars.project_id
      WHERE zta_pillars.id = zta_capabilities.pillar_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete ZTA capabilities of their projects"
  ON zta_capabilities FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM zta_pillars
      JOIN projects ON projects.id = zta_pillars.project_id
      WHERE zta_pillars.id = zta_capabilities.pillar_id
      AND projects.created_by = auth.uid()
    )
  );

-- Weekly status table
CREATE TABLE IF NOT EXISTS weekly_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  week_number int NOT NULL,
  week_ending date NOT NULL,
  progress_summary text,
  blockers text,
  risks text,
  next_week_plan text,
  submitted_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weekly_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view weekly status of their projects"
  ON weekly_status FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = weekly_status.project_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create weekly status for their projects"
  ON weekly_status FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = weekly_status.project_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update weekly status of their projects"
  ON weekly_status FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = weekly_status.project_id
      AND projects.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = weekly_status.project_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete weekly status of their projects"
  ON weekly_status FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = weekly_status.project_id
      AND projects.created_by = auth.uid()
    )
  );

-- Roadmap items table
CREATE TABLE IF NOT EXISTS roadmap_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  workstream text NOT NULL,
  initiative_name text NOT NULL,
  objective text,
  tasks text,
  owner_type text,
  dependencies text,
  timeline text NOT NULL,
  success_metrics text,
  priority text DEFAULT 'foundational',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE roadmap_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view roadmap items of their projects"
  ON roadmap_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = roadmap_items.project_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create roadmap items for their projects"
  ON roadmap_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = roadmap_items.project_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update roadmap items of their projects"
  ON roadmap_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = roadmap_items.project_id
      AND projects.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = roadmap_items.project_id
      AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete roadmap items of their projects"
  ON roadmap_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = roadmap_items.project_id
      AND projects.created_by = auth.uid()
    )
  );