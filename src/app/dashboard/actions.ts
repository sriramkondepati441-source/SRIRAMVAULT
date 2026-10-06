'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadFiles(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Unauthorized' }
  }

  const files = formData.getAll('files') as File[]
  if (!files || files.length === 0) {
    return { error: 'No files provided' }
  }

  for (const file of files) {
    if (file.size > 10 * 1024 * 1024) {
      return { error: `File ${file.name} exceeds 10MB limit` }
    }
  }

  for (const file of files) {
    const timestamp = Date.now()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filePath = `${user.id}/${timestamp}-${sanitizedFileName}`

    // Upload to Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('user-files')
      .upload(filePath, file)

    if (storageError) {
      console.error('Storage upload error:', storageError)
      return { error: `Failed to upload ${file.name}` }
    }

    // Insert into DB (documents table)
    const { data: docData, error: dbError } = await supabase
      .from('documents')
      .insert({
        owner_id: user.id,
        name: file.name,
        storage_path: filePath,
        file_size: file.size,
        file_type: file.type,
      })
      .select('id')
      .single()

    if (dbError) {
      console.error('DB insert error:', dbError)
      // Rollback: delete from storage
      await supabase.storage.from('user-files').remove([filePath])
      return { error: `Failed to save metadata for ${file.name}` }
    }
    
    // Create initial version record
    const { error: versionError } = await supabase
      .from('document_versions')
      .insert({
        document_id: docData.id,
        owner_id: user.id,
        version: 1,
        storage_path: filePath,
        integrity_hash: 'pending', // Placeholder until real hash is computed
      })

    if (versionError) {
       console.error('Version insert error:', versionError)
    }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteFile(id: string, path: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Unauthorized' }
  }

  // Delete from Storage first
  const { error: storageError } = await supabase.storage
    .from('user-files')
    .remove([path])

  if (storageError) {
    console.error('Storage delete error:', storageError)
    return { error: 'Failed to delete file from storage' }
  }

  // Delete from DB (document_versions cascade on delete)
  const { error: dbError } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)
    // RLS ensures they can only delete their own
    .eq('owner_id', user.id)

  if (dbError) {
    console.error('DB delete error:', dbError)
    return { error: 'Failed to delete document metadata' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function getSignedUrl(path: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Unauthorized' }
  }

  const { data, error } = await supabase.storage
    .from('user-files')
    .createSignedUrl(path, 60)

  if (error) {
    console.error('Signed URL error:', error)
    return { error: 'Failed to get download URL' }
  }

  return { url: data.signedUrl }
}
