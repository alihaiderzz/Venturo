import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-side only
);

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json(); // fields from your modal
    console.log('Saving profile for user:', userId, 'with data:', body);
    
    // upsert by clerk_user_id – adjust table/columns to your schema
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({ 
        clerk_user_id: userId, 
        ...body,
        updated_at: new Date().toISOString()
      }, { onConflict: 'clerk_user_id' })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Profile saved successfully:', data);
    return NextResponse.json({ ok: true, profile: data });
  } catch (err: any) {
    console.error('API error saving profile:', err);
    return NextResponse.json({ error: err.message ?? 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('API error fetching profile:', err);
    return NextResponse.json({ error: err.message ?? 'Server error' }, { status: 500 });
  }
}
