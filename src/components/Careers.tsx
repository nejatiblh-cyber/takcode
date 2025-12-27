import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Briefcase, Upload, Send, CheckCircle } from 'lucide-react';

export default function Careers() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    position: '',
    experience_years: 0,
    cover_letter: ''
  });
  const [resume, setResume] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const positions = [
    'برنامه‌نویس React',
    'برنامه‌نویس React Native',
    'برنامه‌نویس Backend',
    'طراح UI/UX',
    'برنامه‌نویس Android',
    'برنامه‌نویس .NET',
    'مدیر پروژه',
    'سایر'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم فایل نباید بیشتر از ۵ مگابایت باشد');
        return;
      }
      setResume(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resume) {
      alert('لطفاً فایل رزومه را انتخاب کنید');
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);

    try {
      const fileExt = resume.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      setUploadProgress(30);

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, resume);

      if (uploadError) throw uploadError;

      setUploadProgress(60);

      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      setUploadProgress(80);

      const { error: insertError } = await supabase
        .from('job_applications')
        .insert({
          ...formData,
          resume_url: publicUrl
        });

      if (insertError) throw insertError;

      setUploadProgress(100);
      setSubmitted(true);
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        position: '',
        experience_years: 0,
        cover_letter: ''
      });
      setResume(null);

      setTimeout(() => {
        setSubmitted(false);
        setUploadProgress(0);
      }, 5000);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('خطا در ارسال درخواست. لطفاً دوباره تلاش کنید.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="careers" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
            <Briefcase size={48} className="text-blue-600" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            همکاری با ما
          </h2>
          <p className="text-xl text-gray-600">
            به تیم ما بپیوندید و در پروژه‌های چالش‌برانگیز شرکت کنید
          </p>
        </div>

        {submitted && (
          <div className="mb-8 p-6 bg-green-50 border-2 border-green-200 rounded-2xl text-center">
            <CheckCircle size={48} className="text-green-600 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-green-800 mb-2">
              درخواست شما با موفقیت ثبت شد!
            </h3>
            <p className="text-green-700">
              رزومه شما در دست بررسی است. در صورت تایید، با شما تماس خواهیم گرفت.
            </p>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  نام و نام خانوادگی *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="علی احمدی"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  ایمیل *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  شماره تماس *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="09123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  موقعیت شغلی مورد نظر *
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">انتخاب کنید</option>
                  {positions.map((pos) => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  سابقه کار (سال) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) })}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  رزومه (حداکثر ۵ مگابایت) *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    required
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="flex items-center justify-center gap-3 w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 cursor-pointer transition-colors bg-gray-50 hover:bg-blue-50"
                  >
                    <Upload size={24} className="text-gray-400" />
                    <span className="text-gray-600">
                      {resume ? resume.name : 'انتخاب فایل رزومه'}
                    </span>
                  </label>
                </div>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1 text-center">
                      در حال آپلود... {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  معرفی خود (اختیاری)
                </label>
                <textarea
                  value={formData.cover_letter}
                  onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none"
                  placeholder="چرا میخواهید با ما همکاری کنید؟"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  در حال ارسال...
                </>
              ) : (
                <>
                  <Send size={20} />
                  ارسال درخواست همکاری
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-2xl shadow-md">
            <div className="text-3xl font-bold text-blue-600 mb-2">محیط دوستانه</div>
            <p className="text-gray-600">فضای کاری صمیمی و حرفه‌ای</p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-md">
            <div className="text-3xl font-bold text-blue-600 mb-2">رشد مهارت</div>
            <p className="text-gray-600">یادگیری تکنولوژی‌های جدید</p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-md">
            <div className="text-3xl font-bold text-blue-600 mb-2">دورکاری</div>
            <p className="text-gray-600">امکان کار از راه دور</p>
          </div>
        </div>
      </div>
    </section>
  );
}
