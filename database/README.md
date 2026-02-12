# Database Migrations

This directory contains SQL migration scripts for the CamBridge database.

## Running Migrations

### Prerequisites

- PostgreSQL database instance
- Database connection details (host, port, username, password, database name)

### Method 1: Using psql

```bash
# Connect to your database
psql -h your-host -U your-username -d your-database

# Run the migration
\i database/migrations/001_phase_2b_schema.sql
```

### Method 2: Using psql with file input

```bash
psql -h your-host -U your-username -d your-database -f database/migrations/001_phase_2b_schema.sql
```

### Method 3: Using Vercel Postgres

If you're using Vercel Postgres, you can run migrations via the Vercel dashboard:

1. Go to your project in Vercel
2. Navigate to Storage > Postgres
3. Click "Query" tab
4. Copy and paste the migration SQL
5. Click "Run Query"

## Migration Files

### 001_phase_2b_schema.sql

**Phase 2B Schema Migration**

Creates and updates tables for Phase 2B features:
- Creates `users` table
- Updates `creators` table with new columns
- Updates `join_requests` table with new columns
- Creates `access_tokens` table
- Sets up indexes for performance
- Creates triggers for automatic timestamp updates
- Inserts sample test data (optional)

**Tables Created/Updated:**
- `users` - User accounts
- `creators` - Creator profiles
- `join_requests` - Join request records
- `access_tokens` - Access token storage

**Run this migration before deploying Phase 2B code.**

## Rollback

If you need to rollback a migration, you can:

1. Drop the tables created:
```sql
DROP TABLE IF EXISTS access_tokens;
```

2. Remove added columns:
```sql
ALTER TABLE creators DROP COLUMN IF EXISTS display_name;
ALTER TABLE creators DROP COLUMN IF EXISTS bio;
ALTER TABLE creators DROP COLUMN IF EXISTS avatar_url;
ALTER TABLE creators DROP COLUMN IF EXISTS tier;
ALTER TABLE creators DROP COLUMN IF EXISTS is_active;

ALTER TABLE join_requests DROP COLUMN IF EXISTS rejection_reason;
ALTER TABLE join_requests DROP COLUMN IF EXISTS updated_at;
```

## Best Practices

1. **Always backup your database** before running migrations
2. **Test migrations** in a development environment first
3. **Run migrations** during low-traffic periods
4. **Review migration output** for any errors or warnings
5. **Keep track** of which migrations have been applied

## Future Migrations

As new features are added, additional migration files will be created with incrementing numbers:
- `002_feature_name.sql`
- `003_another_feature.sql`
- etc.

Always run migrations in order, from lowest to highest number.
