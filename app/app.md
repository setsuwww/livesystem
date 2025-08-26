ada Grid Calender yang kalo kotak nya dipencet munculin Modal(
  => 3 Shifts[MORNING, AFTERNOON, NIGHT]
  => tampilin user user dari masing masing shift dengan status(
    -> Absent(merah)
    -> Late(kuning)
    -> Izin + acc(biru)
    -> Izin + ga di acc(merah)
    -> Present(hijau)
  ) ->tampilkan(User && Status != Present) 
)

User {      
  id                  
  nama                        
  email                       
  password                    
  role(USER, EMPLOYEE, ADMIN) 
  jabatan

  shifts[]
  offices[]
  schedules[]
  attendances[]
}

Shift {
  id
  type
  categories[]
  startTime
  endTime
  periode
  dueDate @default("FOREVER")

  users[]
  schedules[]
  attendances[]
  offices
}

Office {
  name
  location

  divisions[]
  users[]
  shifts[]
}