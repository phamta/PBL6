-- Script to fix MOU enum migration issue
-- Step 1: Update existing "active" status to "signed" 
UPDATE mous SET status = 'signed' WHERE status = 'active';

-- Step 2: Add missing enum values to existing enum before TypeORM migration
ALTER TYPE mous_status_enum ADD VALUE IF NOT EXISTS 'proposing';
ALTER TYPE mous_status_enum ADD VALUE IF NOT EXISTS 'reviewing'; 
ALTER TYPE mous_status_enum ADD VALUE IF NOT EXISTS 'pending_supplement';
ALTER TYPE mous_status_enum ADD VALUE IF NOT EXISTS 'approved';
ALTER TYPE mous_status_enum ADD VALUE IF NOT EXISTS 'rejected';
ALTER TYPE mous_status_enum ADD VALUE IF NOT EXISTS 'expired';
ALTER TYPE mous_status_enum ADD VALUE IF NOT EXISTS 'terminated';

-- Step 3: Update any other old status values if they exist
UPDATE mous SET status = 'signed' WHERE status NOT IN ('proposing', 'reviewing', 'pending_supplement', 'approved', 'signed', 'rejected', 'expired', 'terminated');
