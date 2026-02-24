import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class GuestbookService {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
  );

  async findAll() {
    const { data, error } = await this.supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async create(name: string, comment: string) {
    const { data, error } = await this.supabase
      .from('guestbook')
      .insert([{ name, comment }])
      .select();
    if (error) throw error;
    return data;
  }
}