import { ArrowDown } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
            ایده‌های شما را به
            <span className="block bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              واقعیت تبدیل می‌کنیم
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            توسعه نرم‌افزار، طراحی وب‌سایت، اپلیکیشن موبایل و سیستم‌های سازمانی
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              تخمین قیمت پروژه
            </button>
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white text-gray-700 rounded-full text-lg font-semibold border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transform hover:scale-105 transition-all"
            >
              مشاهده پروژه‌ها
            </button>
          </div>

          <div className="pt-12 animate-bounce">
            <ArrowDown className="mx-auto text-gray-400" size={32} />
          </div>
        </div>
      </div>
    </section>
  );
}
