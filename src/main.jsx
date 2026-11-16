import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { isSupabaseConfigured, syncWithSupabase, fetchFromSupabase } from './lib/supabase';
import './styles.css';

const services = [
  { id: 'plumbing', label: 'السباكة', icon: '💧', color: '#2563eb' },
  { id: 'electrical', label: 'الكهرباء', icon: '⚡', color: '#f59e0b' },
  { id: 'ac', label: 'التكييف', icon: '❄️', color: '#06b6d4' },
  { id: 'painting', label: 'الدهانات', icon: '🎨', color: '#d97706' },
  { id: 'furniture', label: 'النجارة', icon: '🪵', color: '#8b5cf6' },
  { id: 'cleaning', label: 'النظافة', icon: '🧼', color: '#10b981' },
  { id: 'move', label: 'نقل الأثاث', icon: '📦', color: '#ef4444' },
  { id: 'project', label: 'مشاريع كبيرة', icon: '🏗️', color: '#14b8a6' },
];

const providers = [
  { id: 1, name: 'مؤسسة الخليج للنجارة', specialty: 'نجارة ومتابعة تجهيزات المنزل', city: 'الرياض', jobs: 283, rating: 4.9 },
  { id: 2, name: 'إسكان برو', specialty: 'سباكة وكهرباء وديكور', city: 'جدة', jobs: 421, rating: 4.8 },
  { id: 3, name: 'خدمات نضارة', specialty: 'تنظيف منزلي وصيانة', city: 'الدمام', jobs: 315, rating: 4.7 },
  { id: 4, name: 'بيت الحرف', specialty: 'تشطيب ودهانات ومشاريع', city: 'مكة', jobs: 197, rating: 4.9 },
  { id: 5, name: 'المدى للتكييف', specialty: 'تركيب وصيانة أنظمة التكييف', city: 'الرياض', jobs: 188, rating: 4.8 },
];

const seedRequests = [
  { id: 1, title: 'طلب سباكة عاجل', city: 'الرياض', status: 'قيد المراجعة', price: '350 ر.س', service: 'السباكة' },
  { id: 2, title: 'مشروع بناء غرفة نوم', city: 'جدة', status: 'تمت الموافقة', price: '6800 ر.س', service: 'مشاريع كبيرة' },
  { id: 3, title: 'تثبيت مكيف ستاندرد', city: 'الدمام', status: 'قيد التنفيذ', price: '1200 ر.س', service: 'التكييف' },
  { id: 4, title: 'تنظيف منزل بعد تشطيب', city: 'مكة', status: 'جاهز للتسليم', price: '800 ر.س', service: 'النظافة' },
];

const seedChat = [
  { sender: 'assistant', text: 'مرحباً، أنا مساعد فزعتك. ما الخدمة التي تحتاجها اليوم؟' },
  { sender: 'user', text: 'أحتاج تركيب مكيف في غرفة النوم' },
  { sender: 'assistant', text: 'مفيد، هل تريد تركيبًا جديدًا أم صيانة؟ وما المدينة؟ أستطيع تنظيم الطلب لك بسرعة.' },
];

const providerActiveJobs = [
  { id: 101, title: 'تركيب مكيف شقّة', city: 'الرياض', status: 'قيد التنفيذ', price: '1200 ر.س' },
  { id: 102, title: 'إصلاح تسريب مطبخ', city: 'جدة', status: 'جاهز للزيارة', price: '850 ر.س' },
  { id: 103, title: 'دهان غرفة أطفال', city: 'الدمام', status: 'مؤكد', price: '1500 ر.س' },
  { id: 104, title: 'تركيب باب خشبي', city: 'مكة', status: 'قيد المراجعة', price: '980 ر.س' },
];

const providerQuotes = [
  { id: 201, title: 'عروض غسيل بلاط', city: 'مكة', budget: '1400 ر.س', state: 'قيد الرد' },
  { id: 202, title: 'تركيب ستاندرد مكيف', city: 'الرياض', budget: '2200 ر.س', state: 'تم قبولها' },
  { id: 203, title: 'تجهيز غرفة إضافية', city: 'جدة', budget: '9800 ر.س', state: 'قيد المراجعة' },
  { id: 204, title: 'إصلاح شبكة مياه', city: 'الدمام', budget: '760 ر.س', state: 'قيد المتابعة' },
];

const aiReply = (text) => {
  const t = text.toLowerCase();
  if (t.includes('بناء') || t.includes('غرفة') || t.includes('إضافة') || t.includes('ملحق')) {
    return 'أفهم أنك تحتاج مشروع بناء أو ملحق. أحتاج المساحة التقريبية، المدينة، وهل هو بناء جديد أم إضافة إلى مبنى قائم. سأصوغ لك طلبًا قابلاً للعروض.';
  }
  if (t.includes('مكيف') || t.includes('تكييف')) {
    return 'هناك عدة خيارات: تركيب جديد، صيانة، أو فحص كامل. أخبرني المدينة، عدد الوحدات، وهل تريد خدمة عاجلة أم مناسبة للجدول.';
  }
  if (t.includes('سباكة') || t.includes('تسرب') || t.includes('ماء')) {
    return 'حسناً، أحتاج نوع المشكلة: تسريب، تركيب جديد، أو إصلاح تجهيز. أضيف تفاصيل الموقع، ومقدار السرعة المطلوبة.';
  }
  if (t.includes('دهان') || t.includes('تشطيب') || t.includes('ديكور')) {
    return 'ممتاز. أحتاج مساحة المكان، عدد الغرف، وهل الدهان داخلي أو خارجي، وما نوع التشطيب المطلوب.';
  }
  if (t.includes('نظافة') || t.includes('تنظيف')) {
    return 'تم. ما نوع التنظيف: منزلي، بعد تشطيب، أو دوري؟ وأين يقع الموقع؟';
  }
  return 'تم تسجيل طلبك في محرك طلبات فزعتك. أحتاج تحديد الخدمة، المدينة، والمواعيد المناسبة لتجهيز العروض المناسبة.';
};

const servicesMap = Object.fromEntries(services.map((s) => [s.id, s]));

function App() {
  const [role, setRole] = useState(() => {
    const saved = localStorage.getItem('faz3tka-role');
    return saved || 'client';
  });
  const [showAuth, setShowAuth] = useState(() => {
    const saved = localStorage.getItem('faz3tka-role');
    return !saved;
  });
  const [selectedService, setSelectedService] = useState('plumbing');
  const [city, setCity] = useState('الرياض');
  const [customTitle, setCustomTitle] = useState('');
  const [details, setDetails] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState(seedChat);
  const [requests, setRequests] = useState(seedRequests);
  const [quoteForm, setQuoteForm] = useState({ title: '', city: 'الرياض', price: '', note: '' });
  const [quotes, setQuotes] = useState(providerQuotes);

  useEffect(() => {
    localStorage.setItem('faz3tka-role', role);
  }, [role]);

  useEffect(() => {
    const loadPersistent = async () => {
      const savedChat = await fetchFromSupabase('faz3tka-chat', seedChat);
      if (savedChat && savedChat.length) setChatMessages(savedChat);

      const savedRequests = await fetchFromSupabase('faz3tka-requests', seedRequests);
      if (savedRequests && savedRequests.length) setRequests(savedRequests);

      const savedQuotes = await fetchFromSupabase('faz3tka-quotes', providerQuotes);
      if (savedQuotes && savedQuotes.length) setQuotes(savedQuotes);

      const localChat = localStorage.getItem('faz3tka-chat');
      if (localChat) {
        try { setChatMessages(JSON.parse(localChat)); } catch {}
      }

      const localRequests = localStorage.getItem('faz3tka-requests');
      if (localRequests) {
        try { setRequests(JSON.parse(localRequests)); } catch {}
      }

      const localQuotes = localStorage.getItem('faz3tka-quotes');
      if (localQuotes) {
        try { setQuotes(JSON.parse(localQuotes)); } catch {}
      }
    };

    loadPersistent();
  }, []);

  useEffect(() => {
    localStorage.setItem('faz3tka-chat', JSON.stringify(chatMessages));
    if (isSupabaseConfigured) {
      syncWithSupabase('faz3tka-chat', chatMessages).catch(() => {});
    }
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('faz3tka-requests', JSON.stringify(requests));
    if (isSupabaseConfigured) {
      syncWithSupabase('faz3tka-requests', requests).catch(() => {});
    }
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('faz3tka-quotes', JSON.stringify(quotes));
    if (isSupabaseConfigured) {
      syncWithSupabase('faz3tka-quotes', quotes).catch(() => {});
    }
  }, [quotes]);

  const stats = useMemo(() => ({
    requests: requests.length + 18,
    providers: 124,
    online: 37,
    conversion: '78%',
  }), [requests]);

  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
    setShowAuth(false);
  };

  const createRequest = () => {
    const title = customTitle.trim() || servicesMap[selectedService]?.label || 'خدمة جديدة';
    const next = {
      id: Date.now(),
      title,
      city,
      status: 'تم إنشاء الطلب',
      price: 'قيد التقييم',
      service: servicesMap[selectedService]?.label || 'خدمة',
    };

    setRequests((prev) => [next, ...prev]);
    setChatMessages((prev) => [
      ...prev,
      { sender: 'assistant', text: `تم إنشاء الطلب: ${title} في ${city}. جاري تجهيز العروض من مقدمي الخدمة.` },
    ]);
    setCustomTitle('');
    setDetails('');
  };

  const sendChat = () => {
    const text = chatInput.trim();
    if (!text) return;
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text },
      { sender: 'assistant', text: aiReply(text) },
    ]);
    setChatInput('');
  };

  const submitQuote = () => {
    const title = quoteForm.title.trim();
    const price = quoteForm.price.trim();
    if (!title || !price) return;

    const newQuote = {
      id: Date.now(),
      title,
      city: quoteForm.city,
      budget: `${price} ر.س`,
      state: 'قيد المراجعة',
    };

    setQuotes((prev) => [newQuote, ...prev]);
    setQuoteForm({ title: '', city: 'الرياض', price: '', note: '' });
  };

  return (
    <>
      {showAuth && (
        <div className="auth-overlay">
          <div className="auth-card">
            <span className="eyebrow">تسجيل الدخول إلى فزعتك</span>
            <h3>اختر نوع الحساب</h3>
            <div className="role-grid">
              <button className="role-option" onClick={() => handleLogin('client')}>
                <span>👤</span>
                <strong>عميل</strong>
                <small>طلب الخدمات وبدء المشاريع</small>
              </button>
              <button className="role-option" onClick={() => handleLogin('provider')}>
                <span>🛠️</span>
                <strong>مقدم خدمة</strong>
                <small>استقبال الطلبات وإرسال العروض</small>
              </button>
              <button className="role-option" onClick={() => handleLogin('manager')}>
                <span>📊</span>
                <strong>مدير النظام</strong>
                <small>مراقبة الطلبات والعمليات</small>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="app-shell">
        <header className="topbar">
          <div className="brand-wrap">
            <div className="brand-mark">ف</div>
            <div>
              <h1>فزعتك</h1>
              <small>خدمات المنازل والمشاريع</small>
            </div>
          </div>

          <nav className="nav">
            <button className="nav-item active">الرئيسية</button>
            <button className="nav-item">الطلبات</button>
            <button className="nav-item">المشاريع</button>
            <button className="nav-item">المزودون</button>
          </nav>

          <button className="primary-btn" onClick={() => setShowAuth(true)}>
            {role === 'client' ? 'حساب العميل' : role === 'provider' ? 'حساب المزود' : 'حساب المدير'}
          </button>
        </header>

        <main className="main-grid">
          <section className="hero-panel">
            <div className="hero-copy">
              <span className="eyebrow">منصة ذكية في السعودية</span>
              <h2>خدمة منزلية ومشاريع ميدانية بسرعة وثقة</h2>
              <p>
                منصة تجمع العميل ومقدم الخدمة في مكان واحد، مع مساعد ذكي يحدد الطلب ويقارن العروض
                قبل الحجز، مع دعم المشاريع الكبيرة والتخطيط الذكي للأثاث.
              </p>

              <div className="cta-row">
                <button className="primary-btn">اطلب الخدمة الآن</button>
                <button className="secondary-btn">استكشف المشاريع</button>
              </div>

              <div className="stat-row">
                <div>
                  <strong>{stats.providers}</strong>
                  <span>مقدم خدمة</span>
                </div>
                <div>
                  <strong>{stats.requests}</strong>
                  <span>طلبات نشطة</span>
                </div>
                <div>
                  <strong>{stats.conversion}</strong>
                  <span>نسبة الحجز</span>
                </div>
              </div>
            </div>

            <div className="ai-card">
              <div className="ai-card-header">
                <div>
                  <span className="dot green" />
                  <strong>مساعد فزعتك</strong>
                </div>
                <small>جاهز الآن</small>
              </div>

              <div className="chat-box">
                {chatMessages.map((message, index) => (
                  <div key={`${message.sender}-${index}`} className={`bubble ${message.sender}`}>
                    {message.text}
                  </div>
                ))}
              </div>

              <div className="chat-input-row">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="اكتب طلبك أو تحدث مع المساعد..."
                />
                <button onClick={sendChat}>إرسال</button>
              </div>
            </div>
          </section>

          <section className="section-block">
            <div className="section-head">
              <h3>الخدمات السريعة</h3>
              <a href="#">عرض الكل</a>
            </div>

            <div className="service-grid">
              {services.map((service) => (
                <button
                  key={service.id}
                  className={`service-card ${selectedService === service.id ? 'active' : ''}`}
                  onClick={() => setSelectedService(service.id)}
                  style={{ '--service-accent': service.color }}
                >
                  <span className="service-icon">{service.icon}</span>
                  <strong>{service.label}</strong>
                </button>
              ))}
            </div>
          </section>

          <section className="request-layout">
            <div className="request-card">
              <div className="section-head">
                <h3>إنشاء طلب جديد</h3>
              </div>

              <div className="field-group">
                <label>الخدمة</label>
                <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>{service.label}</option>
                  ))}
                </select>
              </div>

              <div className="field-group">
                <label>المدينة</label>
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="الرياض">الرياض</option>
                  <option value="جدة">جدة</option>
                  <option value="الدمام">الدمام</option>
                  <option value="مكة">مكة</option>
                  <option value="تبوك">تبوك</option>
                </select>
              </div>

              <div className="field-group">
                <label>اسم الطلب</label>
                <input
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="مثال: تركيب مكيف، دهان غرفتين، بناء غرفة"
                />
              </div>

              <div className="field-group">
                <label>تفاصيل الطلب</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows="4"
                  placeholder="أدخل تفاصيل المشروع: المساحة، عدد النقاط، نوع المشكلة، وتاريخ التوفر المطلوب"
                />
              </div>

              <button className="primary-btn full" onClick={createRequest}>إنشاء الطلب</button>
            </div>

            <div className="request-card">
              <div className="section-head">
                <h3>أحدث العروض</h3>
                <a href="#">عرض الجميع</a>
              </div>

              <div className="task-list">
                {requests.slice(0, 4).map((item) => (
                  <div key={item.id} className="task-item">
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.city}</span>
                    </div>
                    <div className="task-state">
                      <small>{item.status}</small>
                      <b>{item.price}</b>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="section-block">
            <div className="section-head">
              <h3>أفضل مقدمي الخدمة</h3>
              <a href="#">عرض المزيد</a>
            </div>

            <div className="provider-grid">
              {providers.map((provider) => (
                <article key={provider.id} className="provider-card">
                  <div className="provider-top">
                    <div className="provider-avatar">{provider.name.slice(0, 2)}</div>
                    <div>
                      <strong>{provider.name}</strong>
                      <small>{provider.city}</small>
                    </div>
                  </div>

                  <p>{provider.specialty}</p>

                  <div className="provider-meta">
                    <span>⭐ {provider.rating}</span>
                    <span>{provider.jobs} عملاً</span>
                  </div>

                  <button className="secondary-btn">عرض العروض</button>
                </article>
              ))}
            </div>
          </section>

          <section className="dashboard-block">
            <div className="section-head">
              <h3>لوحة التحكم</h3>
            </div>

            <div className="tabs">
              <button className={role === 'client' ? 'tab active' : 'tab'} onClick={() => setRole('client')}>عميل</button>
              <button className={role === 'provider' ? 'tab active' : 'tab'} onClick={() => setRole('provider')}>مقدم خدمة</button>
              <button className={role === 'manager' ? 'tab active' : 'tab'} onClick={() => setRole('manager')}>مدير النظام</button>
            </div>

            <div className="dashboard-grid">
              <div className="metric-box">
                <span>الطلبات</span>
                <strong>{stats.requests}</strong>
              </div>
              <div className="metric-box">
                <span>العروض</span>
                <strong>74</strong>
              </div>
              <div className="metric-box">
                <span>متصلون الآن</span>
                <strong>{stats.online}</strong>
              </div>
              <div className="metric-box">
                <span>معدل الإنجاز</span>
                <strong>{stats.conversion}</strong>
              </div>
            </div>

            <div className="dashboard-note">
              {role === 'client' && 'العميل يستطيع إنشاء الطلب، مقارنة العروض، ومتابعة حالة الخدمة حتى التنفيذ.'}
              {role === 'provider' && 'مقدم الخدمة يرى الطلبات المناسبة، يرسل عروض الأسعار، ويحدث حالة التنفيذ مباشرة.'}
              {role === 'manager' && 'مدير النظام يراجع الطلبات والبلاغات، ويتابع سجلات التشغيل والتنبيهات الأمنية.'}
            </div>

            {role === 'provider' && (
              <div className="provider-panel">
                <div className="provider-overview">
                  <div className="mini-box">
                    <span>الطلبات النشطة</span>
                    <strong>{providerActiveJobs.length}</strong>
                  </div>
                  <div className="mini-box">
                    <span>العروض الحالية</span>
                    <strong>{quotes.length}</strong>
                  </div>
                  <div className="mini-box">
                    <span>إيراد الشهر</span>
                    <strong>18,400 ر.س</strong>
                  </div>
                  <div className="mini-box">
                    <span>التقييم</span>
                    <strong>4.9/5</strong>
                  </div>
                </div>

                <div className="quote-builder">
                  <h4>إرسال عرض سعر</h4>
                  <div className="quote-form">
                    <input
                      value={quoteForm.title}
                      onChange={(e) => setQuoteForm({ ...quoteForm, title: e.target.value })}
                      placeholder="عنوان العرض"
                    />
                    <select
                      value={quoteForm.city}
                      onChange={(e) => setQuoteForm({ ...quoteForm, city: e.target.value })}
                    >
                      <option value="الرياض">الرياض</option>
                      <option value="جدة">جدة</option>
                      <option value="الدمام">الدمام</option>
                      <option value="مكة">مكة</option>
                    </select>
                    <input
                      value={quoteForm.price}
                      onChange={(e) => setQuoteForm({ ...quoteForm, price: e.target.value })}
                      placeholder="السعر بالريال"
                    />
                    <textarea
                      value={quoteForm.note}
                      onChange={(e) => setQuoteForm({ ...quoteForm, note: e.target.value })}
                      rows="3"
                      placeholder="ملاحظات العرض"
                    />
                    <button className="primary-btn" onClick={submitQuote}>إرسال العرض</button>
                  </div>
                </div>

                <div className="provider-grid-two">
                  <div className="provider-list">
                    <h4>الطلبات النشطة</h4>
                    {providerActiveJobs.map((job) => (
                      <div key={job.id} className="list-row">
                        <div>
                          <strong>{job.title}</strong>
                          <small>{job.city}</small>
                        </div>
                        <div className="right-align">
                          <span>{job.status}</span>
                          <b>{job.price}</b>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="provider-list">
                    <h4>عروض الأسعار</h4>
                    {quotes.map((quote) => (
                      <div key={quote.id} className="list-row">
                        <div>
                          <strong>{quote.title}</strong>
                          <small>{quote.city}</small>
                        </div>
                        <div className="right-align">
                          <span>{quote.state}</span>
                          <b>{quote.budget}</b>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="project-panel">
            <div className="section-head">
              <h3>مشروع كبير — محاكاة الطلب</h3>
            </div>

            <div className="project-box">
              <div className="project-metadata">
                <div>
                  <span>اسم المشروع</span>
                  <strong>بناء غرفة إضافية</strong>
                </div>
                <div>
                  <span>المدينة</span>
                  <strong>جدة</strong>
                </div>
                <div>
                  <span>الميزانية</span>
                  <strong>12,000 ر.س</strong>
                </div>
              </div>

              <div className="project-steps">
                <div className="step done">
                  <span>1</span>
                  <p>إدخال الطلب</p>
                </div>
                <div className="step done">
                  <span>2</span>
                  <p>تحليل الفكرة</p>
                </div>
                <div className="step active">
                  <span>3</span>
                  <p>مقارنة العروض</p>
                </div>
                <div className="step">
                  <span>4</span>
                  <p>تأكيد التنفيذ</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
