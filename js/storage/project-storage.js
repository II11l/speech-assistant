// project-storage.js
// Storage module for speech projects

import supabase from '../supabase-client.js';

/**
 * Get all speech projects for the current user
 * @returns {Promise} Array of speech projects
 */
export async function getAllProjects() {
  try {
    const { data, error } = await supabase
      .from('speech_projects')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    
    return { success: true, projects: data };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get a specific speech project with its requirements and drafts
 * @param {string} projectId - The project ID
 * @returns {Promise} Project data with requirements and drafts
 */
export async function getProject(projectId) {
  try {
    // Get the project
    const { data: project, error: projectError } = await supabase
      .from('speech_projects')
      .select('*')
      .eq('id', projectId)
      .single();
    
    if (projectError) throw projectError;
    
    // Get the requirements
    const { data: requirements, error: requirementsError } = await supabase
      .from('speech_requirements')
      .select('*')
      .eq('project_id', projectId)
      .single();
    
    // Get the drafts, ordered by version
    const { data: drafts, error: draftsError } = await supabase
      .from('speech_drafts')
      .select('*')
      .eq('project_id', projectId)
      .order('version', { ascending: false });
    
    if (draftsError) throw draftsError;
    
    return { 
      success: true, 
      project: {
        ...project,
        requirements: requirements || null,
        drafts: drafts || []
      }
    };
  } catch (error) {
    console.error('Error fetching project:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create a new speech project
 * @param {string} title - The project title
 * @returns {Promise} New project data
 */
export async function createProject(title) {
  try {
    const { data, error } = await supabase
      .from('speech_projects')
      .insert([{ title }])
      .select()
      .single();
    
    if (error) throw error;
    
    return { success: true, project: data };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update a speech project
 * @param {string} projectId - The project ID
 * @param {object} updates - The fields to update
 * @returns {Promise} Updated project data
 */
export async function updateProject(projectId, updates) {
  try {
    const { data, error } = await supabase
      .from('speech_projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();
    
    if (error) throw error;
    
    return { success: true, project: data };
  } catch (error) {
    console.error('Error updating project:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a speech project
 * @param {string} projectId - The project ID
 * @returns {Promise} Success status
 */
export async function deleteProject(projectId) {
  try {
    const { error } = await supabase
      .from('speech_projects')
      .delete()
      .eq('id', projectId);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Save speech requirements for a project
 * @param {string} projectId - The project ID
 * @param {object} requirements - The requirements data
 * @returns {Promise} Requirements data
 */
export async function saveRequirements(projectId, requirements) {
  try {
    // Check if requirements already exist
    const { data: existingData, error: existingError } = await supabase
      .from('speech_requirements')
      .select('id')
      .eq('project_id', projectId)
      .single();
    
    let result;
    
    if (existingData) {
      // Update existing requirements
      const { data, error } = await supabase
        .from('speech_requirements')
        .update({ ...requirements })
        .eq('project_id', projectId)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Insert new requirements
      const { data, error } = await supabase
        .from('speech_requirements')
        .insert([{ project_id: projectId, ...requirements }])
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }
    
    return { success: true, requirements: result };
  } catch (error) {
    console.error('Error saving requirements:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Save a speech draft
 * @param {string} projectId - The project ID
 * @param {string} content - The draft content
 * @param {boolean} userEdited - Whether this was edited by the user
 * @returns {Promise} Draft data
 */
export async function saveDraft(projectId, content, userEdited = false) {
  try {
    // Get the highest version number for this project
    const { data: versionData, error: versionError } = await supabase
      .from('speech_drafts')
      .select('version')
      .eq('project_id', projectId)
      .order('version', { ascending: false })
      .limit(1)
      .single();
    
    const version = versionData ? versionData.version + 1 : 1;
    
    // Insert the new draft
    const { data, error } = await supabase
      .from('speech_drafts')
      .insert([{ 
        project_id: projectId, 
        content, 
        version,
        user_edited: userEdited
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    // Update the project's updated_at timestamp
    await updateProject(projectId, {});
    
    return { success: true, draft: data };
  } catch (error) {
    console.error('Error saving draft:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update an existing draft
 * @param {string} draftId - The draft ID
 * @param {string} content - The updated content
 * @returns {Promise} Updated draft data
 */
export async function updateDraft(draftId, content) {
  try {
    const { data, error } = await supabase
      .from('speech_drafts')
      .update({ 
        content, 
        user_edited: true
      })
      .eq('id', draftId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Update the project's updated_at timestamp
    if (data && data.project_id) {
      await updateProject(data.project_id, {});
    }
    
    return { success: true, draft: data };
  } catch (error) {
    console.error('Error updating draft:', error);
    return { success: false, error: error.message };
  }
} 