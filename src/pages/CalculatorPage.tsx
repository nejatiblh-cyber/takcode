import { useEffect, useState } from 'react';
import { supabase, PricingItem, Package } from '../lib/supabase';
import { Check, Calculator as CalcIcon, Send, Sparkles, Package as PackageIcon, X } from 'lucide-react';
import Footer from '../components/Footer';

export default function CalculatorPage() {
  const [items, setItems] = useState<PricingItem[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [itemsRes, packagesRes] = await Promise.all([
        supabase.from('pricing_items').select('*').eq('is_active', true).order('price'),
        supabase.from('packages').select('*').eq('is_active', true).order('display_order')
      ]);

      if (itemsRes.error) throw itemsRes.error;
      if (packagesRes.error) throw packagesRes.error;

      setItems(itemsRes.data || []);
      setPackages(packagesRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
    setSelectedPackage(null);
  };

  const selectPackage = (pkg: Package) => {
    if (selectedPackage === pkg.id) {
      setSelectedPackage(null);
      setSelectedItems(new Set());
    } else {
      setSelectedPackage(pkg.id);
      setSelectedItems(new Set(pkg.included_items));
    }
  };

  const calculatePrice = () => {
    const basePrice = items
      .filter(item => selectedItems.has(item.id))
      .reduce((sum, item) => sum + item.price, 0);

    if (selectedPackage) {
      const pkg = packages.find(p => p.id === selectedPackage);
      if (pkg) {
        return basePrice - (basePrice * pkg.discount_percentage / 100);
      }
    }
    return basePrice;
  };

  const totalPrice = calculatePrice();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.size === 0) {
      alert('لطفاً حداقل یک مورد انتخاب کنید');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('price_estimates')
        .insert({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          selected_items: Array.from(selectedItems),
          total_price: totalPrice,
          notes: formData.notes
        });

      if (error) throw error;

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', notes: '' });
      setSelectedItems(new Set());
      setSelectedPackage(null);
      setShowForm(false);

      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting estimate:', error);
      alert('خطا در ارسال درخواست. لطفاً دوباره تلاش کنید.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  const categories = [...new Set(items.map(item => item.category))];
  const selectedPkg = packages.find(p => p.id === selectedPackage);

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      'Website': 'وب‌سایت',
      'Mobile': 'موبایل',
      'Desktop': 'دسکتاپ',
      'Enterprise': 'سازمانی',
      'Admin': 'پنل ادمین',
      'Design': 'طراحی',
      'Additional': 'خدمات اضافی'
    };
    return labels[cat] || cat;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-teal-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl shadow-xl animate-float">
              <CalcIcon size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent animate-slide-up">
            محاسبه تخمینی هزینه
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 animate-slide-up">
            پکیج یا خدمات مورد نیاز خود را انتخاب کنید و هزینه را مشاهده کنید
          </p>
        </div>

        {submitted && (
          <div className="mb-8 p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 rounded-2xl text-center animate-scale-in">
            <Check size={48} className="text-green-600 dark:text-green-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">
              درخواست شما با موفقیت ثبت شد!
            </h3>
            <p className="text-green-700 dark:text-green-400">
              به زودی با شما تماس خواهیم گرفت.
            </p>
          </div>
        )}

        {packages.length > 0 && (
          <div className="mb-12 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <PackageIcon className="text-purple-600 dark:text-purple-400" size={28} />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">پکیج‌های پیشنهادی</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((pkg, index) => {
                const isSelected = selectedPackage === pkg.id;
                const pkgPrice = items
                  .filter(item => pkg.included_items.includes(item.id))
                  .reduce((sum, item) => sum + item.price, 0);
                const discountedPrice = pkgPrice - (pkgPrice * pkg.discount_percentage / 100);

                return (
                  <button
                    key={pkg.id}
                    onClick={() => selectPackage(pkg)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    className={`group relative p-8 rounded-3xl border-3 transition-all duration-300 text-right animate-scale-in ${
                      isSelected
                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 shadow-2xl scale-105'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-xl hover:scale-105'
                    }`}
                  >
                    {pkg.badge && (
                      <div className="absolute -top-3 -right-3">
                        <div className="flex items-center gap-1 px-4 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-bold shadow-lg">
                          <Sparkles size={16} />
                          {pkg.badge}
                        </div>
                      </div>
                    )}

                    {pkg.discount_percentage > 0 && (
                      <div className="absolute -top-3 -left-3">
                        <div className="px-4 py-1 bg-red-500 text-white rounded-full text-sm font-bold shadow-lg">
                          {pkg.discount_percentage}% تخفیف
                        </div>
                      </div>
                    )}

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {pkg.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {pkg.description}
                    </p>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        {pkg.discount_percentage > 0 && (
                          <span className="text-lg text-gray-400 line-through">
                            {formatPrice(pkgPrice)}
                          </span>
                        )}
                        <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                          {formatPrice(discountedPrice)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">تومان</span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      شامل {pkg.included_items.length} آیتم
                    </div>

                    <div className={`w-8 h-8 mx-auto rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300 dark:border-gray-600 group-hover:border-purple-400'
                    }`}>
                      {isSelected && <Check size={20} className="text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6 animate-slide-up">
            {categories.map((category, catIndex) => {
              const categoryItems = items.filter(item => item.category === category);
              return (
                <div
                  key={category}
                  style={{ animationDelay: `${catIndex * 0.1}s` }}
                  className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 animate-scale-in"
                >
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-teal-500 rounded-full"></div>
                    {getCategoryLabel(category)}
                  </h3>
                  <div className="space-y-3">
                    {categoryItems.map((item) => {
                      const isSelected = selectedItems.has(item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleItem(item.id)}
                          className={`w-full text-right p-5 rounded-2xl border-2 transition-all duration-300 group ${
                            isSelected
                              ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/30 dark:to-teal-900/30 shadow-lg scale-[1.02]'
                              : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                  isSelected
                                    ? 'border-blue-500 bg-blue-500 scale-110'
                                    : 'border-gray-300 dark:border-gray-600 group-hover:border-blue-400'
                                }`}>
                                  {isSelected && <Check size={16} className="text-white" />}
                                </div>
                                <h4 className="font-bold text-gray-900 dark:text-white">{item.title}</h4>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mr-9 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                            <div className="text-left">
                              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                {formatPrice(item.price)}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1">تومان</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 animate-slide-up">
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 rounded-3xl p-8 text-white shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <CalcIcon size={32} />
                  <h3 className="text-2xl font-bold">خلاصه سفارش</h3>
                </div>

                {selectedPkg && (
                  <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 mb-6 animate-scale-in">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold">پکیج انتخابی:</span>
                      <button
                        onClick={() => {
                          setSelectedPackage(null);
                          setSelectedItems(new Set());
                        }}
                        className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="text-lg font-bold">{selectedPkg.title}</div>
                    <div className="text-sm opacity-90 mt-1">
                      {selectedPkg.discount_percentage}% تخفیف
                    </div>
                  </div>
                )}

                <div className="bg-white/10 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                  <div className="text-sm mb-2 opacity-90">تعداد موارد انتخاب شده</div>
                  <div className="text-4xl font-bold">{selectedItems.size}</div>
                </div>

                <div className="bg-white/10 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                  <div className="text-sm mb-2 opacity-90">هزینه نهایی</div>
                  <div className="text-4xl font-bold">{formatPrice(totalPrice)}</div>
                  <div className="text-sm opacity-90 mt-1">تومان</div>
                </div>

                {selectedItems.size > 0 && !showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full bg-white text-purple-600 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
                  >
                    ثبت درخواست
                  </button>
                )}

                {showForm && (
                  <form onSubmit={handleSubmit} className="space-y-4 animate-scale-in">
                    <input
                      type="text"
                      placeholder="نام و نام خانوادگی"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-white"
                    />
                    <input
                      type="email"
                      placeholder="ایمیل"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-white"
                    />
                    <input
                      type="tel"
                      placeholder="شماره تماس"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-white"
                    />
                    <textarea
                      placeholder="توضیحات (اختیاری)"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl text-gray-900 resize-none focus:ring-2 focus:ring-white"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-white text-purple-600 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600" />
                          در حال ارسال...
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          ارسال درخواست
                        </>
                      )}
                    </button>
                  </form>
                )}

                <p className="text-xs mt-6 opacity-75 text-center leading-relaxed">
                  قیمت‌های نمایش داده شده تقریبی بوده و بر اساس نیازمندی‌های دقیق پروژه قابل تغییر است
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
