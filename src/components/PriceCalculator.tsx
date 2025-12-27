import { useEffect, useState } from 'react';
import { supabase, PricingItem } from '../lib/supabase';
import { Check, Calculator as CalcIcon, Send } from 'lucide-react';

export default function PriceCalculator() {
  const [items, setItems] = useState<PricingItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
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
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_items')
        .select('*')
        .eq('is_active', true)
        .order('price');

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading pricing items:', error);
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
  };

  const totalPrice = items
    .filter(item => selectedItems.has(item.id))
    .reduce((sum, item) => sum + item.price, 0);

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
      <section id="calculator" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse">در حال بارگذاری...</div>
        </div>
      </section>
    );
  }

  const categories = [...new Set(items.map(item => item.category))];

  return (
    <section id="calculator" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            محاسبه تخمینی هزینه
          </h2>
          <p className="text-xl text-gray-600">
            خدمات مورد نیاز خود را انتخاب کنید و هزینه تقریبی را مشاهده کنید
          </p>
        </div>

        {submitted && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-green-800 font-medium">
              درخواست شما با موفقیت ثبت شد. به زودی با شما تماس خواهیم گرفت.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {categories.map(category => {
              const categoryItems = items.filter(item => item.category === category);
              return (
                <div key={category} className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {category === 'Website' && 'وب‌سایت'}
                    {category === 'Mobile' && 'موبایل'}
                    {category === 'Desktop' && 'دسکتاپ'}
                    {category === 'Enterprise' && 'سازمانی'}
                    {category === 'Admin' && 'ادمین'}
                    {category === 'Design' && 'طراحی'}
                  </h3>
                  <div className="space-y-3">
                    {categoryItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`w-full text-right p-4 rounded-xl border-2 transition-all ${
                          selectedItems.has(item.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                selectedItems.has(item.id)
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300'
                              }`}>
                                {selectedItems.has(item.id) && <Check size={16} className="text-white" />}
                              </div>
                              <h4 className="font-bold text-gray-900">{item.title}</h4>
                            </div>
                            <p className="text-sm text-gray-600 mr-9">{item.description}</p>
                          </div>
                          <div className="text-left mr-4">
                            <span className="text-lg font-bold text-blue-600">
                              {formatPrice(item.price)}
                            </span>
                            <span className="text-sm text-gray-500 mr-1">تومان</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl p-8 text-white shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <CalcIcon size={32} />
                <h3 className="text-2xl font-bold">جمع کل</h3>
              </div>

              <div className="bg-white/10 rounded-xl p-6 mb-6 backdrop-blur-sm">
                <div className="text-sm mb-2 opacity-90">تعداد موارد انتخاب شده</div>
                <div className="text-3xl font-bold">{selectedItems.size}</div>
              </div>

              <div className="bg-white/10 rounded-xl p-6 mb-6 backdrop-blur-sm">
                <div className="text-sm mb-2 opacity-90">هزینه تقریبی</div>
                <div className="text-4xl font-bold">{formatPrice(totalPrice)}</div>
                <div className="text-sm opacity-90 mt-1">تومان</div>
              </div>

              {selectedItems.size > 0 && !showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-white text-blue-600 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105"
                >
                  ثبت درخواست
                </button>
              )}

              {showForm && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="نام و نام خانوادگی"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl text-gray-900"
                  />
                  <input
                    type="email"
                    placeholder="ایمیل"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl text-gray-900"
                  />
                  <input
                    type="tel"
                    placeholder="شماره تماس"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl text-gray-900"
                  />
                  <textarea
                    placeholder="توضیحات (اختیاری)"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl text-gray-900 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-white text-blue-600 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send size={20} />
                    {submitting ? 'در حال ارسال...' : 'ارسال درخواست'}
                  </button>
                </form>
              )}

              <p className="text-xs mt-4 opacity-75 text-center">
                * قیمت‌های نمایش داده شده تقریبی بوده و بر اساس نیازمندی‌های دقیق پروژه قابل تغییر است
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
