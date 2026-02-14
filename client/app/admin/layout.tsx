import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Login | Eventra",
    description: "Secure administrator access to the Eventra management portal.",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
