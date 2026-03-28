import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL and SUPABASE_KEY must be set in .env')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// File upload service
export class FileUploadService {
    static async uploadFile(file, bucket = 'files') {
        try {
            const fileExt = file.originalname.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `uploads/${fileName}`;

            console.log('📤 Uploading file to Supabase:', fileName);

            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false
                });

            if (error) {
                console.error('❌ Supabase upload error:', error);
                throw error;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            console.log('✅ File uploaded successfully:', urlData.publicUrl);

            return {
                url: urlData.publicUrl,
                path: filePath,
                bucket: bucket,
                size: file.size,
                mimetype: file.mimetype
            };
        } catch (error) {
            console.error('❌ File upload service error:', error);
            throw error;
        }
    }

    static async deleteFile(filePath, bucket = 'files') {
        try {
            const { error } = await supabase.storage
                .from(bucket)
                .remove([filePath]);

            if (error) {
                console.error('❌ File delete error:', error);
                throw error;
            }

            console.log('🗑️ File deleted successfully:', filePath);
            return true;
        } catch (error) {
            console.error('❌ File delete service error:', error);
            throw error;
        }
    }
}
