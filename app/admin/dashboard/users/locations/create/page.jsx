import CreatePage from "./CreatePage";

export default async function Page() {
  // untuk office create kita belum butuh SSR data (beda sama user yg butuh shift list)
  return <CreatePage />;
}
