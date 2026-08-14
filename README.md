# Azhar Study App - Supabase Integration

## خطوات التشغيل

### 1. تحديث قاعدة البيانات في Supabase
- ادخل على Supabase Dashboard
- روح على SQL Editor
- اعمل New Query
- انسخ محتوى ملف `supabase_schema.sql` والصقه
- اضغط Run

### 2. إنشاء Storage Bucket للملفات
- في Supabase Dashboard روح على Storage
- اعمل New Bucket اسمها `uploads`
- خليها Public

### 3. تحديث ملف .env
- افتح ملف `.env`
- حط الـ Anon Key الصحيح (اللي خدتيه من Supabase)

### 4. تثبيت المكتبة الجديدة
```bash
npm install @supabase/supabase-js
```

### 5. استبدال الملفات
استبدل الملفات دي في مشروعك:
- `src/api/*` (كل الملفات)
- `src/store/authStore.js`
- `src/lib/supabase.js` (جديد)
- `.env`
- `package.json`

### 6. تشغيل المشروع
```bash
npm run dev
```
