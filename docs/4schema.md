# Data Schema Documentation

This document outlines the database schema for the Wedding Speech Assistant application, following Supabase best practices.

## User Table
- **id**: UUID (primary key)
- **email**: String (unique)
- **password_hash**: String
- **first_name**: String
- **created_at**: Timestamp
- **last_login**: Timestamp
- **payment_status**: Enum ('free', 'paid')

## Speech Projects Table
- **id**: UUID (primary key)
- **user_id**: UUID (foreign key → User.id)
- **title**: String
- **created_at**: Timestamp
- **updated_at**: Timestamp
- **generation_complete**: Boolean

## Speech Requirements Table
- **id**: UUID (primary key)
- **project_id**: UUID (foreign key → SpeechProjects.id)
- **role**: String (e.g., "Best Man", "Maid of Honor")
- **relationship_length**: String
- **tone_preference**: String
- **desired_length**: Integer (minutes)
- **key_anecdotes**: JSONB Array
- **who_to_mention**: JSONB Array
- **additional_context**: Text

## Speech Drafts Table
- **id**: UUID (primary key)
- **project_id**: UUID (foreign key → SpeechProjects.id)
- **version**: Integer
- **content**: Text
- **created_at**: Timestamp
- **user_edited**: Boolean

## Payment Records Table
- **id**: UUID (primary key)
- **user_id**: UUID (foreign key → User.id)
- **amount**: Decimal
- **created_at**: Timestamp
- **stripe_payment_id**: String

## Implementation Notes

### Primary Keys
- Using UUIDs (v4) for primary keys to enhance security and enable distributed systems
- Each table uses generated UUIDs rather than sequential IDs to prevent information leakage

### Foreign Keys
- All relationships use proper foreign key constraints with appropriate cascading behavior
- User deletion cascades to related projects and payments
- Project deletion cascades to related requirements and drafts

### Timestamps
- All tables include creation timestamps for audit purposes
- Tables with updatable content include updated_at timestamps that automatically update

### Security
- Row Level Security (RLS) policies will be implemented to ensure users can only access their own data
- Example policy for Speech Projects table:
  ```sql
  CREATE POLICY user_projects ON speech_projects 
    FOR ALL 
    TO authenticated 
    USING (user_id = auth.uid());
  ```

### Indexing Strategy
- Foreign key columns will be indexed to optimize JOIN operations
- Additional indexes on frequently queried fields like payment_status and generation_complete

### JSON Storage
- JSONB type used for flexible storage of arrays and structured data
- Allows for future extension without schema changes

### Authentication
- Leverages Supabase Auth with PostgreSQL integration
- User.id will correspond to auth.uid() from Supabase Auth 