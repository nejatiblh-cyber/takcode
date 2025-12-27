import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              تک‌کد
            </h1>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-8 space-x-reverse">
              <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-blue-600 transition-colors">
                خانه
              </button>
              <button onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-blue-600 transition-colors">
                خدمات
              </button>
              <button onClick={() => scrollToSection('projects')} className="text-gray-700 hover:text-blue-600 transition-colors">
                پروژه‌ها
              </button>
              <button onClick={() => scrollToSection('calculator')} className="text-gray-700 hover:text-blue-600 transition-colors">
                تخمین قیمت
              </button>
              <button onClick={() => scrollToSection('careers')} className="text-white bg-gradient-to-r from-blue-600 to-teal-500 px-6 py-2 rounded-full hover:shadow-lg transition-all">
                همکاری با ما
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button onClick={() => scrollToSection('home')} className="block w-full text-right px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
              خانه
            </button>
            <button onClick={() => scrollToSection('services')} className="block w-full text-right px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
              خدمات
            </button>
            <button onClick={() => scrollToSection('projects')} className="block w-full text-right px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
              پروژه‌ها
            </button>
            <button onClick={() => scrollToSection('calculator')} className="block w-full text-right px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
              تخمین قیمت
            </button>
            <button onClick={() => scrollToSection('careers')} className="block w-full text-right px-3 py-2 text-white bg-gradient-to-r from-blue-600 to-teal-500 rounded-md">
              همکاری با ما
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
