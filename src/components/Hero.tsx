import { ArrowDown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThreeDScene from './ThreeDScene';

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-16 transition-colors duration-300 relative overflow-hidden">
      <div className="absolute inset-0 hidden lg:block">
        <ThreeDScene />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="space-y-8">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6 animate-float">
              <Sparkles size={20} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                راهکارهای نوآورانه دیجیتال
              </span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight animate-slide-up">
            ایده‌های شما را به
            <span className="block bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent animate-slide-up" style={{ animationDelay: '0.1s' }}>
              واقعیت تبدیل می‌کنیم
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            توسعه نرم‌افزار، طراحی وب‌سایت، اپلیکیشن موبایل و سیستم‌های سازمانی
          </p>

          <div className="flex flex-wrap gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link
              to="/calculator"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all relative overflow-hidden"
            >
              <span className="relative z-10">محاسبه قیمت پروژه</span>
              <div className="absolute inset-0 bg-gradient-to-l from-teal-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full text-lg font-semibold border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl transform hover:scale-105 transition-all"
            >
              مشاهده پروژه‌ها
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">۱۰۰+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">پروژه موفق</div>
            </div>
            <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl">
              <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-1">۵۰+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">مشتری راضی</div>
            </div>
            <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">۱۵+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">تیم متخصص</div>
            </div>
            <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">۲۴/۷</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">پشتیبانی</div>
            </div>
          </div>

          <div className="pt-12 animate-bounce">
            <ArrowDown className="mx-auto text-gray-400 dark:text-gray-600" size={32} />
          </div>
        </div>
      </div>
    </section>
  );
}
