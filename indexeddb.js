// ==============================
// Membuat atau membuka database bernama "ContactDB" versi 1
// ==============================
let db;
const request = indexedDB.open("ContactDB", 1);

// Jika gagal membuka database
request.onerror = function (event) {
  console.error("❌ Gagal membuka IndexedDB:", event.target.errorCode);
};

// Jika berhasil membuka database
request.onsuccess = function (event) {
  db = event.target.result;
  console.log("✅ IndexedDB berhasil dibuka");
};

// Jika database belum pernah dibuat atau perlu upgrade
request.onupgradeneeded = function (event) {
  db = event.target.result;

  // Membuat object store "contacts" dengan autoIncrement ID
  const objectStore = db.createObjectStore("contacts", {
    keyPath: "id", // Setiap data punya ID unik
    autoIncrement: true
  });

  // Menambahkan index pencarian berdasarkan nama, email, dan pesan
  objectStore.createIndex("name", "name", { unique: false });
  objectStore.createIndex("email", "email", { unique: false });
  objectStore.createIndex("message", "message", { unique: false });
};

// ==============================
// Setelah halaman selesai dimuat (DOMContentLoaded)
// ==============================
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form"); // Ambil elemen form

  // Saat form dikirim
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Mencegah reload halaman

    // Ambil nilai input dari form
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Jika semua input terisi
    if (name && email && message) {
      const contact = { name, email, message }; // Buat objek kontak
      simpanKeIndexedDB(contact); // Simpan ke IndexedDB
      form.reset(); // Reset form
      alert("✅ Pesan berhasil disimpan secara lokal (IndexedDB)");
    } else {
      alert("❗ Harap isi semua kolom"); // Validasi jika ada kolom kosong
    }
  });
});

// ==============================
// Fungsi untuk menyimpan data ke IndexedDB
// ==============================
function simpanKeIndexedDB(contact) {
  // Buat transaksi untuk menulis data
  const transaction = db.transaction(["contacts"], "readwrite");
  const objectStore = transaction.objectStore("contacts");

  // Tambahkan data ke object store
  const request = objectStore.add(contact);

  // Jika berhasil menyimpan
  request.onsuccess = function () {
    console.log("📥 Data berhasil disimpan ke IndexedDB:", contact);
  };

  // Jika gagal menyimpan
  request.onerror = function (event) {
    console.error("❌ Gagal menyimpan data:", event.target.error);
  };
}
