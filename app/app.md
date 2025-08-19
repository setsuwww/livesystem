fitur -> Auth -> :: Role(ADMIN, TEKNISI, MANAGER, USER) 

ADMIN(
  - Manage content secara keseluruhan dan efisien

  CRUD Akun User({
    Filter( Manager: Teknisi: User:) -> Tampilkan Akun sesuai role beserta Status(
        ACTIVE, HANDLING, UNACTIVE
    )
  }) 

  CRUD Schedule 2View::(Calendar | Table) {
    Calendar Grid(
      Tampilkan Shift + User yang active pada tanggal yang di click di grid(
        -> MORNING, AFTERNOON, NIGHT + username
    )
  )}

  CRUD Ticket(
    -> tiket dikirim dari teknisi
    -> punya Status_Pengerjaan(PENDING, PROCESS, DONE)
    -> punya Status_Seleseai(SUCCESS, FAILED)
    -> history daftar tiket + teknisi yang mengerjakan
  )

  Fitur(
    -> Delete selected item
    -> Delete All
    -> Filter
    -> Sort
    -> Export(PDF, Word, Excel)
    -> Paginate
    -> CRUD
  )
)

TEKNISI(
  Input ticket kendala / keluhan user -> tiket(
    Catch informasi
  ) -> PENDING

  Jadikan bentuk Tiket(
    Solving, & Komunikasi
  ) -> PROCESS

  Done (
    Berikan Solusi -> SUCCESS
    Berikan Alasan -> FAILED
  )
)

MANAGER(
  Mengatur User untuk schedule & shift
)

USER(
  Register -> Login -> Mengajukan kendala()
  Melihat history 
)

Theme Color(
  Night -> Violet
  Afternoon -> Sky
  Morning -> Yellow

  Another -> Gray
)


