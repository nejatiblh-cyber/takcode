import { useEffect, useState } from 'react';
import { supabase, Service } from '../lib/supabase';
import * as Icons from 'lucide-react';

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    const Icon = Icons[iconName as keyof typeof Icons] as React.ComponentType<{ size?: number; className?: string }>;
    return Icon ? <Icon size={40} className="text-blue-600 dark:text-blue-400" /> : null;
  };

  if (loading) {
    return (
      <section id="services" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse text-gray-600 dark:text-gray-400">در حال بارگذاری...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">
            خدمات ما
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 animate-fade-in">
            ارائه خدمات حرفه‌ای در زمینه توسعه نرم‌افزار
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="group p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-scale-in"
            >
              <div className="mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                {getIcon(service.icon)}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
