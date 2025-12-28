import { Mail, Phone, MapPin, Instagram, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-black text-white border-t border-gray-800 dark:border-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent drop-shadow-md">
              تک‌کد
            </h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              ما متخصص در توسعه نرم‌افزار، طراحی وب‌سایت، اپلیکیشن موبایل و سیستم‌های سازمانی هستیم.
              با تیمی حرفه‌ای و با تجربه، پروژه‌های شما را از ایده تا اجرا همراهی می‌کنیم.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 dark:bg-gray-900 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-110">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 dark:bg-gray-900 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-110">
                <Linkedin size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 dark:bg-gray-900 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-110">
                <Github size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">دسترسی سریع</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  خانه
                </Link>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-white transition-colors">
                  خدمات
                </a>
              </li>
              <li>
                <a href="#projects" className="text-gray-400 hover:text-white transition-colors">
                  پروژه‌ها
                </a>
              </li>
              <li>
                <Link to="/calculator" className="text-gray-400 hover:text-white transition-colors">
                  محاسبه قیمت
                </Link>
              </li>
              <li>
                <a href="#careers" className="text-gray-400 hover:text-white transition-colors">
                  همکاری با ما
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">تماس با ما</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Mail size={18} className="flex-shrink-0" />
                <span className="text-sm">info@techcode.ir</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Phone size={18} className="flex-shrink-0" />
                <span className="text-sm" dir="ltr">021-1234-5678</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors">
                <MapPin size={18} className="flex-shrink-0 mt-1" />
                <span className="text-sm">تهران، خیابان ولیعصر، پلاک ۱۲۳</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} تک‌کد. تمامی حقوق محفوظ است.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              قوانین و مقررات
            </a>
            <a href="#" className="hover:text-white transition-colors">
              حریم خصوصی
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
