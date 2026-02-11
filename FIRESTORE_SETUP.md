# Firestore Setup Guide

## Status
✅ Frontend integration selesai. Data RSVP & Ucapan akan otomatis menyimpan ke Firestore.

## Firebase Project Details
- **Project ID:** `undangan-f9f5c`
- **Database:** Firestore (Google Cloud Firestore)
- **Web App Name:** undangan-f9f5c

## Data Structure

### Collection: `entries`
Menyimpan semua RSVP dan guestbook entries dengan struktur berikut:

#### RSVP Entry
```json
{
  "type": "rsvp",
  "nama": "Nama Tamu",
  "whatsapp": "08123456789",
  "status": "Insya Allah Hadir", // or "Belum Pasti" / "Maaf Tidak Bisa Hadir"
  "jumlah": 2,
  "ucapan": "Selamat dan sukses...",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

#### Guestbook Entry
```json
{
  "type": "guestbook",
  "nama": "Nama Tamu",
  "hubungan": "Teman/Keluarga/Kolega",
  "ucapan": "Doa terindah untuk kalian...",
  "createdAt": "2024-01-15T10:35:00.000Z"
}
```

## Required Firebase Console Setup

### 1. Firestore Security Rules
✅ **PENTING:** Atur Firestore Rules untuk mengizinkan write dari frontend dengan batasan:

```firebase_rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /entries/{document=**} {
      // Allow public read (unlimited history)
      allow read: if true;
      
      // Allow write hanya untuk dokumen RSVP & guestbook dengan validasi dasar
      allow create: if 
        request.resource.data.type in ["rsvp", "guestbook"] &&
        request.resource.data.createdAt == request.time &&
        (
          (
            request.resource.data.type == "rsvp" &&
            request.resource.data.nama != null &&
            request.resource.data.whatsapp != null &&
            request.resource.data.status != null &&
            request.resource.data.jumlah != null
          ) ||
          (
            request.resource.data.type == "guestbook" &&
            request.resource.data.nama != null &&
            request.resource.data.ucapan != null
          )
        );
      
      // Tidak allow update/delete dari frontend
      allow update: if false;
      allow delete: if false;
    }
  }
}
```

### 2. Langkah Setup di Firebase Console

1. **Buka Firebase Console:** https://console.firebase.google.com/
2. **Select Project:** `undangan-f9f5c`
3. **Go to Firestore Database**
4. **Click "Rules" tab**
5. **Paste rules di atas**
6. **Click Publish**

### 3. Create Firestore Database (jika belum ada)
Jika database belum dibuat:
1. **Firestore → Create Database**
2. **Region:** asia-southeast1 (atau region terdekat)
3. **Mulai dari test mode → ubah ke production rules**
4. **Create**

## Frontend Implementation Details

### Modified Files
- ✅ `script.js` - Firebase SDK imports + Firestore queries
- ✅ `index.html` - Script tag updated ke `type="module"`

### Key Features
1. **Primary storage:** Firestore
2. **Fallback layers:**
   - Local Node.js API (jika development)
   - Google Apps Script (untuk backup redundancy)

3. **Data Flow:**
   - RSVP Submit → Save ke Firestore → Update UI → Fallback ke Apps Script
   - Load Summary → Query Firestore → Fallback ke Local API → Fallback ke Apps Script
   - Load Guestbook → Query Firestore (ordered by createdAt desc) → Fallback ke Local API → Fallback ke Apps Script

4. **Real-time capabilities:**
   - Data langsung tersimpan (tidak ada tunggu)
   - Guestbook ditampilkan dengan order terbaru dulu

## Testing

### Test RSVP Submit
1. Buka website di browser
2. Scroll ke RSVP section
3. Isi form (nama, WhatsApp, status, jumlah tamu, ucapan)
4. Klik "Submit"
5. **Cek Firestore Console:** Seharusnya ada document baru di collection `entries` dengan `type: "rsvp"`

### Test Guestbook Submit (jika form ada)
1. Isi form guestbook
2. Klik submit
3. **Cek Firestore Console:** Seharusnya ada document baru dengan `type: "guestbook"`
4. Refresh page → guestbook message muncul di list

### Monitor Firestore
- **Firebase Console → Firestore → Collection `entries`**
- Lihat realtime data masuk saat user submit RSVP/guestbook

## Troubleshooting

### Error: "Failed request to Firestore"
- **Penyebab:** Security rules belum setup atau database belum ada
- **Solusi:** Follow "Firebase Console Setup" section di atas

### Guestbook tidak muncul saat load page
- **Penyebab:** Query tidak sorted by createdAt
- **Solusi:** Already fixed di loadGuestbook() dengan `orderBy("createdAt", "desc")`

### Data tidak tersimpan tapi tidak ada error
- **Penyebab:** Browser mungkin block JavaScript modules (CORS)
- **Solusi:** Pastikan script tag punya `type="module"`

## Migrating Old Data (Optional)

Jika punya data lama dari local API atau Apps Script, gunakan Firebase Console untuk manual upload atau setup Cloud Functions untuk migrate.

## Production Notes

- ✅ Firestore free tier cukup untuk wedding invitation kecil (~1000 entries)
- ✅ Real-time listeners tidak aktif (query-based load saja)
- ⚠️ Security rules harus strict untuk prod (sudah disiapkan di atas)
- ✅ Automatic backups via Google Cloud (default)

## Support

Untuk issue/pertanyaan Firestore, cek:
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

---

**Dibuat untuk:** Undangan Pernikahan Dwi Unzila Putri & Ahmad Bakri  
**Tanggal:** 2024
