import { Shift } from "./Shift";

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  shift: Shift | null;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type UserTable = {
  id: number;
  name: string;
  email: string;
  role: string;
  shift: string; // ubah dari Shift ke string
  createdAt: string;
  updatedAt: string;
}