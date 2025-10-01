import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('investigaciones')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching investigaciones:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { investigacion, isUpdate } = body;

    if (isUpdate) {
      // Update existing
      const { data, error } = await supabase
        .from('investigaciones')
        .update({
          nombre: investigacion.nombre,
          edad: investigacion.edad,
          area: investigacion.area,
          antiguedad: investigacion.antiguedad,
          declaracion_accidente: investigacion.declaracionAccidente,
          fecha: investigacion.fecha,
          acciones: investigacion.acciones,
          firma_accidentado: investigacion.firmaAccidentado || null,
          firma_miembro_cphs: investigacion.firmaMiembroCPHS || null,
          firma_depto_ssoma: investigacion.firmaDeptoSSOMA || null,
          firma_encargado_area: investigacion.firmaEncargadoArea || null,
          firma_gerente_area: investigacion.firmaGerenteArea || null
        })
        .eq('folio_id', investigacion.id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('investigaciones')
        .insert({
          folio_id: investigacion.id,
          nombre: investigacion.nombre,
          edad: investigacion.edad,
          area: investigacion.area,
          antiguedad: investigacion.antiguedad,
          declaracion_accidente: investigacion.declaracionAccidente,
          fecha: investigacion.fecha,
          acciones: investigacion.acciones,
          firma_accidentado: investigacion.firmaAccidentado || null,
          firma_miembro_cphs: investigacion.firmaMiembroCPHS || null,
          firma_depto_ssoma: investigacion.firmaDeptoSSOMA || null,
          firma_encargado_area: investigacion.firmaEncargadoArea || null,
          firma_gerente_area: investigacion.firmaGerenteArea || null
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Error saving investigacion:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
