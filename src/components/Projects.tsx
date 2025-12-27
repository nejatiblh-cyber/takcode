import { useEffect, useState } from 'react';
import { supabase, Project } from '../lib/supabase';
import { ExternalLink } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(projects.map(p => p.category))];
  const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      'all': 'همه',
      'Website': 'وب‌سایت',
      'Mobile App': 'اپلیکیشن موبایل',
      'Desktop App': 'نرم‌افزار دسکتاپ'
    };
    return labels[cat] || cat;
  };

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse text-gray-600 dark:text-gray-400">در حال بارگذاری...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">
            پروژه‌های ما
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 animate-fade-in">
            نمونه‌ای از کارهای انجام شده
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-medium transition-all hover:scale-105 ${
                filter === cat
                  ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-scale-in"
            >
              <div className="relative h-64 overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img
                  src={project.image_url || 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg'}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                  <div className="flex items-center gap-2 text-white animate-slide-up">
                    <ExternalLink size={20} />
                    <span className="font-medium">مشاهده جزئیات</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                  <span className="text-sm px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                    {getCategoryLabel(project.category)}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
