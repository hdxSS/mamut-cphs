import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('counter')
      .select('value')
      .eq('id', 'folio_counter')
      .single();

    if (error) {
      // If counter doesn't exist, create it
      if (error.code === 'PGRST116') {
        const { data: newCounter, error: insertError } = await supabase
          .from('counter')
          .insert({ id: 'folio_counter', value: 0 })
          .select()
          .single();

        if (insertError) throw insertError;
        return NextResponse.json({ nextId: '000001', counter: 0 });
      }
      throw error;
    }

    const nextValue = (data?.value || 0) + 1;
    return NextResponse.json({
      nextId: nextValue.toString().padStart(6, '0'),
      counter: data?.value || 0
    });
  } catch (error) {
    console.error('Error getting next ID:', error);
    return NextResponse.json({ error: 'Failed to get next ID' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const { data, error } = await supabase
      .from('counter')
      .select('value')
      .eq('id', 'folio_counter')
      .single();

    if (error) throw error;

    const newValue = (data?.value || 0) + 1;

    const { error: updateError } = await supabase
      .from('counter')
      .update({ value: newValue })
      .eq('id', 'folio_counter');

    if (updateError) throw updateError;

    return NextResponse.json({
      id: newValue.toString().padStart(6, '0'),
      counter: newValue
    });
  } catch (error) {
    console.error('Error incrementing counter:', error);
    return NextResponse.json({ error: 'Failed to increment counter' }, { status: 500 });
  }
}
