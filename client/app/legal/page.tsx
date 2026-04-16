import React from 'react';
import NavBar from '../../component/navBar';
import Footer from '../../component/landing/footer';

export default function LegalPage() {
  return (
    <div className="min-h-screen font-sans bg-background text-foreground transition-colors duration-300">
      <NavBar />
      <div className="container mx-auto px-4 py-32 max-w-4xl">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-600 bg-clip-text text-transparent mb-8">Legal & Privacy Policy</h1>
      <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">1. Information We Collect</h2>
        <p className="text-muted-foreground leading-relaxed">
          We collect information you provide directly to us, such as when you create or modify your account, purchase tickets, contact customer support, or otherwise communicate with us. This log data may include your IP address, browser type, and operating system.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">2. How We Use Your Information</h2>
        <p className="text-muted-foreground leading-relaxed">
          We use the information we collect to operate and improve Eventra, facilitate your ticket purchases, communicate with you about products, services, offers, and events, and carry out any other purpose described to you at the time the information was collected.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">3. Sharing of Information</h2>
        <p className="text-muted-foreground leading-relaxed">
          We may share your information with third-party vendors and service providers that perform services on our behalf, including payment processing and data analytics. Event organizers also receive necessary information to manage attendance.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">4. Data Security</h2>
        <p className="text-muted-foreground leading-relaxed">
          We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no digital transmission is entirely secure.
        </p>
      </section>
      </div>
      <Footer />
    </div>
  );
}
