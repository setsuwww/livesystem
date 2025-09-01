"use client";

import { useEffect, useState } from "react";
import { shiftBridgeDay } from "@/function/services/shiftBridgeDay";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Loader2 } from "lucide-react";

export default function CheckinForm({ shiftId, shiftStart, shiftEnd }) {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("ABSENT");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const now = new Date();
    const start = new Date(shiftStart); // ✅ parse ISO string ke Date
    const end = new Date(shiftEnd);     // ✅ parse ISO string ke Date

    if (shiftBridgeDay(now, start, end)) {
      setMode("PRESENT");
    } else {
      setMode("ABSENT");
    }
  }, [shiftStart, shiftEnd]);

  const handleCheckin = async () => {
    setLoading(true);
    const res = await fetch("/api/attendance/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shiftId }),
    });
    setLoading(false);
    setMessage(res.ok ? "Check-in berhasil ✅" : "Gagal check-in ❌");
  };

  const handleCheckout = async () => {
    setLoading(true);
    const res = await fetch("/api/attendance/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shiftId }),
    });
    setLoading(false);
    setMessage(res.ok ? "Check-out berhasil ✅" : "Gagal check-out ❌");
  };

  const handlePermission = async () => {
    if (!reason) return setMessage("Isi alasan izin terlebih dahulu ❌");
    setLoading(true);
    const res = await fetch("/api/attendance/permission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shiftId, reason }),
    });
    setLoading(false);
    setMessage(res.ok ? "Permission diajukan ✅" : "Gagal ajukan permission ❌");
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Absensi Shift #{shiftId}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Status sekarang: <b>{mode}</b>
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Isi alasan jika izin..."
          disabled={mode !== "ABSENT" || loading}
        />
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <Button
          onClick={handleCheckin}
          disabled={mode !== "PRESENT" || loading}
          className="w-full"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Check-in
        </Button>
        <Button
          onClick={handleCheckout}
          disabled={mode !== "PRESENT" || loading}
          variant="secondary"
          className="w-full"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Check-out
        </Button>
        <Button
          onClick={handlePermission}
          disabled={mode !== "ABSENT" || loading}
          variant="destructive"
          className="w-full"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Ajukan Permission
        </Button>
      </CardFooter>

      {message && (
        <p className="p-3 text-sm text-center text-muted-foreground">{message}</p>
      )}
    </Card>
  );
}
