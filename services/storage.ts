
import { supabase } from '../lib/supabaseClient';

export const storageService = {
    async uploadImage(file: File): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('wardrobe_images')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            throw uploadError;
        }

        const { data, error: urlError } = await supabase.storage
            .from('wardrobe_images')
            .createSignedUrl(filePath, 315360000); // 10 years expiration

        if (urlError) {
            console.error('Error creating signed URL:', urlError);
            throw urlError;
        }

        return data.signedUrl;
    },
};
