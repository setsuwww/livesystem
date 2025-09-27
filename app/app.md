## PERFORMA

refactor ssr dengan isr + prisma query ke data yang akan ditampilkan saja
refactor csr dengan react hooks, clean code, reusable function & components
refactor file & folder
refactor statis ke constant & orefetch kalau tidak ada perubahan data
refactor schema

---

Add schedule { 
    - shifts[] // required 
    - users[] // required

    - tentukan tanggal di grid calender
    - isi shift di tanggal yang ditentukan secara select manual / massal di grid calender

    @ jika yang dipilih adalah user yang sudah memilik schedule : tampilkan shiftnya
    @ replace shift jika ada penginputan double atau lebih

}

UI schedule {
    ada 2 views

    fokus data Users
        - tampilkan tabel dengan data user sebagai data primary[ name, email, role ]
        - tampilkan jumlah schedule yang berkaitan dengan user
        - detail, edit, dan delete

        - detail() -> tampilkan shift di calendar grid milik user itu sendiri, bisa di update
        - edit() -> tukeran shift dengan user lain, edit secara select manual / massal
        - delete() -> hapus data user secara select manual / massal

    Users[] -> banyak row dalam satu tabel

    fokus data Schedules
        - tampilkan schedules dengan data user yang terkait [ tanggal, start, end, shift ]
        - detail, edit, delete

        - detail() -> tampilkan data user terkait dalam schedule berbentuk modal
        - edit() -> 

    Schedules -> satu card untuk banyak users

}

Attendance {
    schedule[]

    users[name, email]
    status({})
    shift[]
}

karyawan tanpa shift berarti di jam kerja 
