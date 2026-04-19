import React from 'react';
import NavBar from '../../component/navBar';
import Footer from '../../component/landing/footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen font-sans bg-background text-foreground transition-colors duration-300">
      <NavBar />
      <div className="container mx-auto px-4 py-32 max-w-4xl">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-600 bg-clip-text text-transparent mb-8">Terms and Conditions</h1>
      <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">1. Acceptance of Terms</h2>
        <p className="text-muted-foreground leading-relaxed">
          By accessing and using Eventra, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you are prohibited from using our service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">2. Ticket Purchases</h2>
        <p className="text-muted-foreground leading-relaxed">
          All ticket sales are final unless otherwise stated by the event organizer. Eventra serves as a platform connecting organizers with attendees and is not responsible for event cancellations or modifications.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">3. User Accounts</h2>
        <p className="text-muted-foreground leading-relaxed">
          You must maintain the confidentiality of your account credentials. You are responsible for all activities that occur under your account. We reserve the right to suspend or terminate accounts that violate our policies.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">4. Governing Law</h2>
        <p className="text-muted-foreground leading-relaxed">
          These terms shall be governed by and constructed in accordance with the laws of the jurisdiction in which Eventra operates, without regard to its conflict of law provisions.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">5. Payments, Pricing & Refunds</h2>
        <div className="text-muted-foreground leading-relaxed space-y-4">
          <p>
            <strong>Pricing & Fees:</strong> All prices are displayed in the applicable local currency (e.g., NPR). We reserve the right to charge service fees, convenience fees, and applicable taxes on ticket purchases, which will be fully disclosed during the checkout process.
          </p>
          <p>
            <strong>Payment Processing:</strong> Eventra uses third-party payment gateways (such as eSewa) to process transactions securely. We do not store your direct banking or PIN credentials. By purchasing a ticket, you also agree to the underlying terms and conditions of these payment providers.
          </p>
          <p>
            <strong>Cancellations & Refunds:</strong> All ticket sales are generally final. Refunds are only issued according to the specific event organizer's policy. If an event is entirely canceled, Eventra or the organizer will communicate the refund procedures. Any convenience fees charged by Eventra may be non-refundable. 
          </p>
        </div>
      </section>
      </div>
      <Footer />
    </div>
  );
}
