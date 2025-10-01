'use client';

import { useRef } from 'react';
import Tabs from '@/components/Tabs';
import InvestigacionesForm from '@/components/InvestigacionesForm';
import NotificationBell from '@/components/NotificationBell';
import { Investigacion } from '@/types/investigacion';

export default function Home() {
  const formRef = useRef<{ loadInvestigacion: (inv: Investigacion) => void }>(null);
  const bellRef = useRef<{ refreshReminders: () => void }>(null);

  const handleReminderClick = (investigacion: Investigacion) => {
    if (formRef.current) {
      formRef.current.loadInvestigacion(investigacion);
    }
  };

  const handleFormSaved = () => {
    if (bellRef.current) {
      bellRef.current.refreshReminders();
    }
  };

  const tabs = [
    {
      id: 'investigaciones',
      label: 'Investigaciones',
      component: <InvestigacionesForm ref={formRef} onSaved={handleFormSaved} />
    },
    // More tabs can be added here in the future
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Mamut CPHS</h1>
            <p className="text-sm text-blue-100">Sistema de Gestión de Investigaciones</p>
          </div>
          <NotificationBell ref={bellRef} onReminderClick={handleReminderClick} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs tabs={tabs} />
      </main>
    </div>
  );
}
