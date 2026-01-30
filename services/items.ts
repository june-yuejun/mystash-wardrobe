import { supabase } from '../lib/supabaseClient';
import { WardrobeItem } from '../types';

export const itemsService = {
    async getAll(): Promise<WardrobeItem[]> {
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching items:', error);
            throw error;
        }

        return data.map((item: any) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            colorway: item.colorway,
            season: item.season,
            tags: item.tags,
            imageUrl: item.image_url,
            createdAt: item.created_at,
        }));
    },

    async getById(id: string): Promise<WardrobeItem | null> {
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching item:', error);
            return null;
        }

        return {
            id: data.id,
            name: data.name,
            category: data.category,
            colorway: data.colorway,
            season: data.season,
            tags: data.tags,
            imageUrl: data.image_url,
            createdAt: data.created_at,
        };
    },

    async update(id: string, item: Partial<WardrobeItem>): Promise<WardrobeItem> {
        const { data, error } = await supabase
            .from('items')
            .update({
                name: item.name,
                category: item.category,
                colorway: item.colorway,
                season: item.season,
                tags: item.tags,
                image_url: item.imageUrl,
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating item:', error);
            throw error;
        }

        return {
            id: data.id,
            name: data.name,
            category: data.category,
            colorway: data.colorway,
            season: data.season,
            tags: data.tags,
            imageUrl: data.image_url,
            createdAt: data.created_at,
        };
    },

    async create(item: Omit<WardrobeItem, 'id' | 'createdAt'>): Promise<WardrobeItem> {
        const { data, error } = await supabase
            .from('items')
            .insert({
                name: item.name,
                category: item.category,
                colorway: item.colorway,
                season: item.season,
                tags: item.tags,
                image_url: item.imageUrl,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating item:', error);
            throw error;
        }

        return {
            id: data.id,
            name: data.name,
            category: data.category,
            colorway: data.colorway,
            season: data.season,
            tags: data.tags,
            imageUrl: data.image_url,
            createdAt: data.created_at,
        };
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('items')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting item:', error);
            throw error;
        }
    },
};
