'use client';

import Tabs from '@/components/Tabs';
import InvestigacionesForm from '@/components/InvestigacionesForm';

export default function Home() {
  const tabs = [
    {
      id: 'investigaciones',
      label: 'Investigaciones',
      component: <InvestigacionesForm />
    },
    // More tabs can be added here in the future
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Mamut CPHS</h1>
          <p className="text-sm text-blue-100">Sistema de Gestión de Investigaciones</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs tabs={tabs} />
      </main>
    </div>
  );
}
