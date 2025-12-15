import React from 'react';
import './Home.css';

export default function Home() {
  return (
    <div className="home-hero-bg">
      <header className="home-navbar">
        <div className="home-logo">🏦 God Bank</div>
        <nav className="home-nav-links">
          <a href="/login">Log in</a>
          <a href="/register">Open Account</a>
        </nav>
      </header>
      <main className="home-hero-content">
        <h1 className="home-hero-title">Banking. Reinvented.</h1>
        <p className="home-hero-subtitle">Modern, secure, and lightning-fast digital banking for everyone.<br/>Open your account in minutes. Manage your finances with confidence.</p>
        <div className="home-cta-group">
          <a href="/register" className="home-cta-primary">Open Free Account</a>
          <a href="/login" className="home-cta-secondary">Log in</a>
        </div>
        <div className="home-hero-cards">
          <div className="home-feature-card">
            <div className="home-feature-icon">💳</div>
            <h3>Multi-currency Accounts</h3>
            <p>Hold and manage EUR, USD, GBP and more. Instant currency exchange at real rates.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">🔒</div>
            <h3>Top-tier Security</h3>
            <p>All data encrypted. 2FA, biometric login, and instant fraud alerts keep your money safe.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">⚡</div>
            <h3>Instant Transfers</h3>
            <p>Send and receive money in seconds. Free transfers between God Bank users.</p>
          </div>
        </div>
      </main>
      <footer className="home-footer">
        <div>© {new Date().getFullYear()} God Bank. All rights reserved.</div>
        <div className="home-footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
