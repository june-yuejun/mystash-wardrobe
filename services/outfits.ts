
import { supabase } from '../lib/supabaseClient';
import { Outfit, WardrobeItem } from '../types';

export const outfitsService = {
    async getAll(): Promise<Outfit[]> {
        const { data, error } = await supabase
            .from('outfits')
            .select(`
        *,
        outfit_items (
          item:items (*)
        )
      `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching outfits:', error);
            throw error;
        }

        // Transform data to match Outfit interface
        return data.map((outfit: any) => ({
            id: outfit.id,
            name: outfit.name,
            season: outfit.season,
            year: outfit.year,
            tags: outfit.tags,
            isFavorite: outfit.is_favorite,
            items: outfit.outfit_items.map((oi: any) => ({
                id: oi.item.id,
                name: oi.item.name,
                category: oi.item.category,
                colorway: oi.item.colorway,
                season: oi.item.season,
                tags: oi.item.tags,
                imageUrl: oi.item.image_url,
                createdAt: oi.item.created_at,
            })),
        }));
    },

    async create(outfit: Omit<Outfit, 'id'>): Promise<Outfit> {
        // 1. Create the outfit
        const { data: newOutfit, error: outfitError } = await supabase
            .from('outfits')
            .insert({
                name: outfit.name,
                season: outfit.season,
                year: outfit.year,
                is_favorite: outfit.isFavorite,
                tags: outfit.tags,
            })
            .select()
            .single();

        if (outfitError) {
            console.error('Error creating outfit:', outfitError);
            throw outfitError;
        }

        // 2. Link items
        if (outfit.items.length > 0) {
            const outfitItems = outfit.items.map(item => ({
                outfit_id: newOutfit.id,
                item_id: item.id
            }));

            const { error: linksError } = await supabase
                .from('outfit_items')
                .insert(outfitItems);

            if (linksError) {
                console.error('Error linking items to outfit:', linksError);
                // Clean up checking? Or just throw.
                throw linksError;
            }
        }

        // Return the complete outfit object
        return {
            ...outfit,
            id: newOutfit.id,
        };
    }
    ,

    async update(id: string, updates: Partial<Outfit>): Promise<void> {
        const { error } = await supabase
            .from('outfits')
            .update({
                is_favorite: updates.isFavorite,
                name: updates.name,
                season: updates.season,
                year: updates.year,
                tags: updates.tags
            })
            .eq('id', id);

        if (error) {
            console.error('Error updating outfit:', error);
            throw error;
        }
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('outfits')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting outfit:', error);
            throw error;
        }
    }
};
