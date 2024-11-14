# Proje Hakkında

Bu proje, Keysop firması için hazırlanmış bir test case çalışmasıdır. Temel bir kitap yönetim API'si sunar.

Test case dökümanının Türkçe olması sebebiyle, dokümantasyon da Türkçe olarak hazırlanmıştır.

## Özellikler

- Kitap ekleme, listeleme, güncelleme ve silme işlemleri
- JWT tabanlı kimlik doğrulama sistemi  
- Kitapları türe göre filtreleme
- Puan sistemine göre sıralama
- Jest ile kapsamlı test senaryoları yazıldı
- Unit ve entegrasyon testleri eklendi
- %100 test coverage sağlandı

## Teknolojiler

- **Node.js**
- **TypeScript** - Programlama Dili
  - Güvenli tip sistemi ile derleme zamanında hataları yakalar
  - Interface ve jenerik tipler ile kod tekrarını azaltır
  - Modern JavaScript özelliklerini destekler ve geriye uyumludur
- **Hono** - Framework
  - Hafif ve hızlı
  - TypeScript desteği
  - Middleware sistemi
- **Jest** - Test framework
- **Zod** - Validation
- **JWT** - Kimlik doğrulama
- **Prisma** - ORM
  - Veritabanı şeması TypeScript ile senkronize
  - Otomatik migration yönetimi
  - İlişkisel veritabanı sorgularını kolaylaştırır


## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. .env.example dosyasını .env olarak değiştirin:
```bash
PORT=3000
DATABASE_URL="postgres://postgres:PASSWORD@IP:PORT/postgres"
AUTH_SECRET="dG9PMAhr3AwuBmhsf3C47urRNPELaW"
```

4. Database migration'ları çalıştırın:
```bash
npx prisma db push
```

5. Uygulamayı başlatın:
```bash
npm run dev
```

## API Endpoints

### Kimlik Doğrulama

- `POST /auth/sign-up` - Yeni kullanıcı kaydı
- `POST /auth/sign-in` - Kullanıcı girişi

### Kitaplar

- `GET /book` - Kitapları listele
- `PUT /book` - Yeni kitap ekle
- `GET /book/:id` - Kitap detaylarını görüntüle
- `PATCH /book/:id` - Kitap bilgilerini güncelle
- `DELETE /book/:id` - Kitap sil

### Puanlama

- `PUT /book/:id/rate` - Kitaba puan ver
- `PATCH /book/:id/rate` - Puanı güncelle
- `DELETE /book/:id/rate` - Puanı sil
- `GET /book/:id/rate` - Puanı görüntüle

Testleri çalıştırmak için:

```bash
npm test
```

## Mimari Kararlar

1. **Hono Framework**: Sektörde yeni ve güncel bir framework olması sebebiyle tercih ettim. Kaynakları ve örnekleri az olmasına rağmen, bu teknolojiyi kullanarak bilgimi ve yeteneklerimi firmanıza kanıtlayabileceğimi düşündüm.

2. **Prisma ORM**: Uzun süredir aktif olarak kullandığım bir ORM aracı. Hem raw SQL sorgularını desteklemesi hem de TypeScript tip desteği sayesinde veritabanı projelerini çok başarılı bir şekilde geliştirebilmemi sağlıyor.

3. **Zod**: Günümüzde TypeScript ile kullanılan en popüler validasyon kütüphanesi. Hem basit hem de kapsamlı validasyon işlemleri yapabilmesi sebebiyle tercih ediyorum.

4. **Katmanlı Mimari**: 
   CQRS yapısına benzer bir mimari kurdum. Tüm CRUD işlemleri için ayrı dosyalar oluşturarak kod okunabilirliğini ve proje düzenini kolayca yönetebiliyorum. Bu yapı sayesinde:
   - Routes: API endpoint'lerinin yönetimi
   - Middlewares: Kimlik doğrulama ve validasyon işlemleri
   - Database: Prisma client ile veritabanı işlemleri
   - Utils: Yardımcı fonksiyonlar
   
   Uzun vadede projenin ihtiyaçlarına yönelik değişiklik veya yenilikleri çok daha kolay bir şekilde entegre edebiliyorum.

## Lisans

MIT
