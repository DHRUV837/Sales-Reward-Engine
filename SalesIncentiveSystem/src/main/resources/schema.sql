-- Manually create the app_users table to resolve Render deployment issues
-- Hibernate 'update' strategy will add any missing columns automatically.

CREATE TABLE IF NOT EXISTS app_users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50),
    name VARCHAR(255),
    account_status VARCHAR(50) DEFAULT 'ACTIVE',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    
    -- Additional fields (Hibernate will sync these if they mismatch, preventing 'relation not found' error)
    mobile VARCHAR(255),
    profile_photo_url TEXT,
    department VARCHAR(255),
    organization_name VARCHAR(255),
    branch VARCHAR(255),
    job_title VARCHAR(255),
    manager_name VARCHAR(255),
    territory VARCHAR(255),
    product_category VARCHAR(255),
    experience_level VARCHAR(255),
    incentive_type VARCHAR(255),
    notifications_config TEXT,
    legal_accepted BOOLEAN DEFAULT FALSE,
    
    -- Progress flags
    first_target_created BOOLEAN DEFAULT FALSE,
    first_deal_created BOOLEAN DEFAULT FALSE,
    first_rule_configured BOOLEAN DEFAULT FALSE,
    first_user_invited BOOLEAN DEFAULT FALSE
);

-- Assign admin@test.com and original core salesmen (IDs 1-22) to 'Global' org
-- Only updates rows where organization_name is still NULL (safe to re-run on every deploy)
UPDATE app_users
SET organization_name = 'Global'
WHERE id IN (1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22)
  AND organization_name IS NULL;

