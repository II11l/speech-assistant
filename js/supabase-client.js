// supabase-client.js
// Initialize Supabase client

// Import the required libraries
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.4/+esm';

// Supabase configuration
const supabaseUrl = 'https://pjtsixvbxzhqkvegfcoz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqdHNpeHZieHpocWt2ZWdmY296Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0OTk4MzksImV4cCI6MjA2MTA3NTgzOX0.eH1G_r_NreRxuHSo_HPgiXa7kliFI6phqL42y4d2fcc';

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase; 