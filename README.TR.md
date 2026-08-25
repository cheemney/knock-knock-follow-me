# Knock Knock — Follow Me?

![Knock Knock Follow Me](https://github.com/alicangunduz/knock-knock-follow-me/assets/54004830/b0851250-8e03-437e-847f-c948f29a27f4)

> GitHub profillerini gezerken, ilgili profilin sizi takip edip etmediğini gösteren hafif ve kullanışlı bir Chrome eklentisi.

## Genel Bakış

**Knock Knock — Follow Me?**, ziyaret ettiğiniz GitHub profilinin sizin GitHub hesabınızı takip edip etmediğini doğrudan profil sayfasında gösteren bir Chrome eklentisidir.

Takipçi listelerini manuel olarak kontrol etmek yerine herhangi bir GitHub profilini ziyaret etmeniz yeterlidir. Eklenti, takip durumunu profil üzerinde gösterir.

### Öne Çıkan Özellikler

* GitHub Personal Access Token gerektirmez
* GitHub'ın public REST API'sini kullanır
* GitHub profil sayfalarında ve client-side navigation sırasında çalışır
* Birden fazla sekmede paylaşılan state'e bağlı kalmadan çalışır
* Çalışma zamanında dil seçimine izin verir
* İlk açılışta tarayıcı dilini otomatik algılar
* İngilizce, Türkçe, İspanyolca, Fransızca, Basitleştirilmiş Çince, Japonca, Korece ve Rusça desteği sunar
* Kullanıcı adı ve dil tercihini yerel olarak saklar
* Üçüncü taraf backend veya harici servis kullanmaz
* Hafif ve bağımlılıksızdır

## Nasıl Çalışır?

Eklenti, ziyaret ettiğiniz profil ile kendi hesabınız arasındaki takip ilişkisini kontrol etmek için GitHub'ın public following endpoint'ini kullanır.

Temel akış:

```text
GitHub Profili
      │
      ▼
Content Script
      │
      ▼
Extension Service Worker
      │
      ▼
GitHub REST API
      │
      ▼
Takip Durumu
      │
      ▼
Durum Rozeti
```

Eklenti **GitHub access token istemez ve saklamaz**.

## Kurulum

Eklenti şu anda Chrome'a unpacked extension olarak kurulabilir.

### 1. Repository'yi klonlayın

```bash
git clone https://github.com/alicangunduz/knock-knock-follow-me.git
cd knock-knock-follow-me
```

### 2. Chrome Extensions sayfasını açın

Tarayıcıda:

```text
chrome://extensions
```

adresine gidin.

Sağ üstten **Developer mode** seçeneğini etkinleştirin.

### 3. Eklentiyi yükleyin

**Load unpacked** seçeneğine tıklayın ve proje klasörünü seçin.

### 4. Kullanıcı adınızı ayarlayın

Eklentiyi açın ve GitHub kullanıcı adınızı girin.

Hepsi bu kadar. Access token oluşturmanıza veya GitHub hesabınızda ek bir ayar yapmanıza gerek yoktur.

## Kullanım

1. Eklenti popup'ını açın.
2. GitHub kullanıcı adınızı girin.
3. Kullanmak istediğiniz dili seçin.
4. Ayarları kaydedin.
5. Bir GitHub profilini ziyaret edin.
6. Eklenti takip durumunu profil üzerinde gösterecektir.

Eklenti, GitHub üzerindeki client-side profile navigation işlemlerini de otomatik olarak takip eder.

## Takip Durumları

Eklenti birden fazla durumu ayrı olarak ele alır:

| Durum                  | Açıklama                                                  |
| ---------------------- | --------------------------------------------------------- |
| **Seni takip ediyor**  | Ziyaret ettiğiniz profil GitHub hesabınızı takip ediyor.  |
| **Seni takip etmiyor** | Ziyaret ettiğiniz profil GitHub hesabınızı takip etmiyor. |
| **Bu senin profilin**  | Kendi profilinizi görüntülüyorsunuz.                      |
| **Rate limit aşıldı**  | GitHub geçici olarak API isteklerini sınırlandırdı.       |
| **Ağ hatası**          | GitHub'a ulaşılamadı.                                     |
| **API hatası**         | GitHub beklenmeyen bir response döndürdü.                 |

## Dil Desteği

Dil seçimi doğrudan eklenti popup'ı üzerinden yapılabilir.

### Desteklenen Diller

* 🇬🇧 English
* 🇹🇷 Türkçe
* 🇪🇸 Español
* 🇫🇷 Français
* 🇨🇳 简体中文
* 🇯🇵 日本語
* 🇰🇷 한국어
* 🇷🇺 Русский

İlk açılışta eklenti tarayıcının dilini algılamaya çalışır. Tarayıcı dili desteklenmiyorsa İngilizce varsayılan dil olarak kullanılır.

Kullanıcı tarafından seçilen dil yerel olarak saklanır ve sonraki kullanımlarda tarayıcı diline göre öncelikli olur.

## Gizlilik

Gizlilik, eklentinin tasarımındaki temel prensiplerden biridir.

Eklenti:

* GitHub Personal Access Token istemez.
* Verileri üçüncü taraf bir sunucuya göndermez.
* Özel bir backend kullanmaz.
* GitHub kullanıcı adını yerel olarak saklar.
* Dil tercihini yerel olarak saklar.
* Takip durumu isteklerini doğrudan GitHub'ın public REST API'sine gönderir.

Herhangi bir GitHub kimlik bilgisi gerekmemektedir.

## İzinler

Eklenti mümkün olduğunca minimum izinlerle çalışacak şekilde tasarlanmıştır.

Kullanıcı tercihleri için local storage ve takip durumu kontrolleri için GitHub API erişimi kullanılır.

Eklenti tüm sekmelere veya genel web navigation event'lerine erişim gibi geniş tarayıcı izinleri talep etmez.

## API

Takip ilişkileri GitHub'ın public REST API'si üzerinden kontrol edilir:

```http
GET /users/{username}/following/{target_user}
```

Response şu şekilde yorumlanır:

| HTTP Status      | Anlamı                                 |
| ---------------- | -------------------------------------- |
| `204 No Content` | Kullanıcı hedef profili takip ediyor.  |
| `404 Not Found`  | Kullanıcı hedef profili takip etmiyor. |

Kullanıcının kendi profili ayrıca kontrol edilir ve gereksiz bir API isteği gönderilmez.

## Proje Yapısı

```text
.
├── background.js       # Extension service worker
├── main.js             # GitHub sayfa entegrasyonu
├── manifest.json       # Chrome extension manifest
├── popup.html          # Eklenti popup'ı
├── popup.css           # Popup stilleri
├── popup.js            # Popup davranışı ve ayarlar
├── locales.json        # Çeviri metinleri
├── images/             # Eklenti ikonları ve asset'ler
├── CHANGELOG.md        # Proje değişiklik geçmişi
└── README.md
```

## Katkıda Bulunma

Katkılar, bug raporları ve geliştirmeler memnuniyetle karşılanır.

Pull request açmadan önce:

1. Değişikliğiniz için ayrı bir branch oluşturun.
2. Değişikliğin kapsamını mümkün olduğunca odaklı tutun.
3. Eklentiyi Chrome üzerinde **Load unpacked** ile test edin.
4. Mevcut özelliklerin çalışmaya devam ettiğinden emin olun.
5. Pull request açıklamasında yaptığınız değişikliği ve nedenini açıkça belirtin.

Bug bildirirken mümkünse:

* Tekrarlama adımlarını
* Beklenen davranışı
* Gerçekleşen davranışı
* Tarayıcı sürümünü
* İlgili ekran görüntülerini veya console hatalarını

ekleyin.

## Bilinen Sınırlamalar

Eklenti şu anda GitHub profil sayfalarını hedeflemektedir ve GitHub'ın public REST API'sine bağlıdır.

GitHub API rate limit'leri, belirli bir süre içerisinde yapılabilecek takip durumu kontrollerini sınırlayabilir.

## Lisans

Bu proje **GNU General Public License v3.0** ile lisanslanmıştır.

Lisansın tamamı için [`LICENSE`](LICENSE) dosyasına bakabilirsiniz.

## Teşekkür

GitHub üzerindeki takip ilişkilerini manuel olarak kontrol etme ihtiyacını biraz daha kolaylaştırmak için geliştirilmiştir.
