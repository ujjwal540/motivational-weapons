import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer/footer";
import { PageViewTracker } from "@/components/dashboard/page-view-tracker";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PageViewTracker />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
