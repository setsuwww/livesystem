"use server"

import { prisma } from "@/_lib/prisma"
import { getCurrentUser } from "@/_lib/auth"
import dayjs from "dayjs"

export async function userSendCheckIn() {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const today = dayjs().startOf("day").toDate()

  await prisma.attendance.upsert({
    where: {
      userId_shiftId_date: {
        userId: user.id,
        shiftId: user.shiftId ?? 0,
        date: today,
      },
    },
    update: {
      checkInTime: new Date(),
      status: "PRESENT",
    },
    create: {
      userId: user.id,
      shiftId: user.shiftId ?? 0,
      date: today,
      status: "PRESENT",
      checkInTime: new Date(),
    },
  })

  return { success: true }
}

/**
-- Buat fitur checkin ini bisa mendeteksi telat, dan absensi
-- lupa checking -> surat dispensasi -> hadir
-- lewat 10 menit setelah jam masuk statusnya Telat, kalau lewat 20 menit statusnya absent
-- user yang divisinya wfo harus ada didalam jangkauan dimana divisinya ditempatkan
-- user yang divisinya wfa bisa absen dimana saja
-- checkout tidak bisa diclick sebelum jam berakhir shift
-- checkout bisa diclick 5menit sebelum jam berakhir shift
-- jika ada keperluan bisa ajukan permintaan pulang cepat, bisa di acc/rejc, jika tidak ada kabar maka mau g mau checkout manual
-- lupa checkout akan diberi waktu 20 menit, dan ada notif di dashboard employee sebagai reminder

(user yang mengajukan tukar shift(request) - user yang menerima(target))
-- pertukaran shift direset secara sistem 2 minggu 1x
-- pertukaran shift via user, mengajukan permintaan ke target, dengan periode,(verf 1)
-- target to admin,(verf 2)
-- pertukaran shift via admin
-- request ke target akan mengajukan periode dan alasan
-- periode mulai dan berakhir berfungsi sebagai meteran mulai dan berakhir kapan si request tukar posisi dengan target
-- jika deadline berakhir, shift request tidak di shift target, melainkan kembali ke shift pertama kali request di buat
*/

export async function userSendCheckOut() {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const today = dayjs().startOf("day").toDate()

  await prisma.attendance.updateMany({
    where: {
      userId: user.id,
      date: today,
    },
    data: {
      checkOutTime: new Date(),
    },
  })

  return { success: true }
}

export async function userSendPermissionRequest(reason) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const today = dayjs().startOf("day").toDate()

  await prisma.attendance.upsert({
    where: {
      userId_shiftId_date: {
        userId: user.id,
        shiftId: user.shiftId ?? 0,
        date: today,
      },
    },
    update: {
      status: "PERMISSION",
      approval: "PENDING",
      reason,
    },
    create: {
      userId: user.id,
      shiftId: user.shiftId ?? 0,
      date: today,
      status: "PERMISSION",
      approval: "PENDING",
      reason,
    },
  })

  return { success: true }
}
