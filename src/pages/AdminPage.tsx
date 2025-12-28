import { useEffect, useState } from 'react';
import { supabase, PricingItem, Package } from '../lib/supabase';
import { Settings, Plus, Trash2, Edit2, X, Save } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

type Tab = 'items' | 'packages';

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('items');
  const [items, setItems] = useState<PricingItem[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [itemForm, setItemForm] = useState({
    title: '',
    description: '',
    price: 0,
    category: 'Website',
    is_active: true,
  });

  const [packageForm, setPackageForm] = useState({
    title: '',
    description: '',
    badge: '',
    discount_percentage: 0,
    included_items: [] as string[],
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [itemsRes, packagesRes] = await Promise.all([
        supabase.from('pricing_items').select('*').order('created_at', { ascending: false }),
        supabase.from('packages').select('*').order('display_order'),
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

  const handleAddItem = async () => {
    try {
      const { error } = await supabase
        .from('pricing_items')
        .insert([itemForm]);

      if (error) throw error;

      setItemForm({ title: '', description: '', price: 0, category: 'Website', is_active: true });
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Error adding item:', error);
      alert('خطا در افزودن آیتم');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('آیا مطمئن هستید؟')) return;

    try {
      const { error } = await supabase
        .from('pricing_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('خطا در حذف آیتم');
    }
  };

  const handleAddPackage = async () => {
    try {
      const { error } = await supabase
        .from('packages')
        .insert([packageForm]);

      if (error) throw error;

      setPackageForm({
        title: '',
        description: '',
        badge: '',
        discount_percentage: 0,
        included_items: [],
        display_order: 0,
        is_active: true,
      });
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Error adding package:', error);
      alert('خطا در افزودن پکیج');
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm('آیا مطمئن هستید؟')) return;

    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error deleting package:', error);
      alert('خطا در حذف پکیج');
    }
  };

  const categories = ['Website', 'Mobile', 'Desktop', 'Enterprise', 'Admin', 'Design', 'Additional'];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl">
            <Settings size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">پنل ادمین</h1>
        </div>

        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setTab('items')}
            className={`px-6 py-3 font-bold transition-all ${
              tab === 'items'
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 border-b-4 border-gradient-to-r'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            آیتم‌های قیمت‌گذاری
          </button>
          <button
            onClick={() => setTab('packages')}
            className={`px-6 py-3 font-bold transition-all ${
              tab === 'packages'
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 border-b-4 border-teal-500'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            پکیج‌ها
          </button>
        </div>

        {tab === 'items' && (
          <div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="mb-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              <Plus size={20} />
              افزودن آیتم جدید
            </button>

            {showForm && (
              <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl border-2 border-blue-200 dark:border-blue-900">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="عنوان"
                    value={itemForm.title}
                    onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                    className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl"
                  />
                  <input
                    type="number"
                    placeholder="قیمت"
                    value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: parseInt(e.target.value) })}
                    className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl"
                  />
                  <select
                    value={itemForm.category}
                    onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                    className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <label className="flex items-center gap-3 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={itemForm.is_active}
                      onChange={(e) => setItemForm({ ...itemForm, is_active: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <span className="text-gray-700 dark:text-gray-300">فعال</span>
                  </label>
                </div>
                <textarea
                  placeholder="توضیح"
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  className="w-full mt-4 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl resize-none"
                  rows={3}
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleAddItem}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all"
                  >
                    <Save size={20} />
                    ذخیره
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-400 text-white rounded-xl font-bold hover:bg-gray-500 transition-all"
                  >
                    <X size={20} />
                    لغو
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-between items-start hover:shadow-lg transition-all"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                    <div className="flex gap-3 mt-3">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm">
                        {item.category}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm">
                        {formatPrice(item.price)} تومان
                      </span>
                      {!item.is_active && (
                        <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm">
                          غیرفعال
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'packages' && (
          <div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="mb-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              <Plus size={20} />
              افزودن پکیج جدید
            </button>

            {showForm && (
              <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl border-2 border-blue-200 dark:border-blue-900">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="عنوان پکیج"
                    value={packageForm.title}
                    onChange={(e) => setPackageForm({ ...packageForm, title: e.target.value })}
                    className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="نشان (مثلاً: پرفروش)"
                    value={packageForm.badge}
                    onChange={(e) => setPackageForm({ ...packageForm, badge: e.target.value })}
                    className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl"
                  />
                  <input
                    type="number"
                    placeholder="درصد تخفیف"
                    value={packageForm.discount_percentage}
                    onChange={(e) => setPackageForm({ ...packageForm, discount_percentage: parseInt(e.target.value) })}
                    className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl"
                  />
                  <input
                    type="number"
                    placeholder="ترتیب نمایش"
                    value={packageForm.display_order}
                    onChange={(e) => setPackageForm({ ...packageForm, display_order: parseInt(e.target.value) })}
                    className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl"
                  />
                </div>
                <textarea
                  placeholder="توضیح"
                  value={packageForm.description}
                  onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
                  className="w-full mt-4 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl resize-none"
                  rows={3}
                />
                <div className="mt-4">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    انتخاب آیتم‌ها:
                  </label>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {items.map((item) => (
                      <label key={item.id} className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <input
                          type="checkbox"
                          checked={packageForm.included_items.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPackageForm({
                                ...packageForm,
                                included_items: [...packageForm.included_items, item.id],
                              });
                            } else {
                              setPackageForm({
                                ...packageForm,
                                included_items: packageForm.included_items.filter((id) => id !== item.id),
                              });
                            }
                          }}
                          className="w-5 h-5"
                        />
                        <span className="text-gray-700 dark:text-gray-300">{item.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-3 px-4 py-3 mt-4">
                  <input
                    type="checkbox"
                    checked={packageForm.is_active}
                    onChange={(e) => setPackageForm({ ...packageForm, is_active: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span className="text-gray-700 dark:text-gray-300">فعال</span>
                </label>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleAddPackage}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all"
                  >
                    <Save size={20} />
                    ذخیره
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-400 text-white rounded-xl font-bold hover:bg-gray-500 transition-all"
                  >
                    <X size={20} />
                    لغو
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-between items-start hover:shadow-lg transition-all"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {pkg.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{pkg.description}</p>
                    <div className="flex gap-3 mt-3 flex-wrap">
                      {pkg.badge && (
                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full text-sm">
                          {pkg.badge}
                        </span>
                      )}
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm">
                        {pkg.discount_percentage}% تخفیف
                      </span>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm">
                        {pkg.included_items.length} آیتم
                      </span>
                      {!pkg.is_active && (
                        <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm">
                          غیرفعال
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeletePackage(pkg.id)}
                    className="p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
