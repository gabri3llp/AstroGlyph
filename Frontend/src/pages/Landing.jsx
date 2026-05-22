import { Link } from 'react-router-dom';
import StarField from '../components/StarField.jsx';
import { useState } from 'react';

const Landing = () => {
  const [demoSequence, setDemoSequence] = useState([]);

  return (
    <div style={{ minHeight: '100vh', paddingTop: '60px' }}>

      <section style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '80px 24px 40px',
        maxWidth: '900px',
        margin: '0 auto',
        animation: 'fadeInUp 0.7s ease',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          background: 'rgba(124, 58, 237, 0.15)',
          border: '1px solid rgba(124, 58, 237, 0.3)',
          borderRadius: 'var(--radius-full)',
          marginBottom: '32px',
          fontSize: '12px',
          color: 'var(--color-accent-light)',
          letterSpacing: '0.06em',
          fontFamily: 'var(--font-body)',
        }}>
          <span>✦</span>
          <span>CONSTELLATION AUTH</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 6vw, 4rem)',
          marginBottom: '20px',
          lineHeight: '1.15',
          background: 'linear-gradient(135deg, #ffffff 0%, #a78bfa 60%, #7c3aed 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Your password is<br />a constellation
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
          color: 'var(--color-text-secondary)',
          maxWidth: '560px',
          marginBottom: '40px',
          lineHeight: '1.7',
          fontFamily: 'var(--font-body)',
        }}>
          Draw your unique glyph across the stars. No words. No numbers.
          Just your pattern — written in the cosmos.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/register" style={{
            padding: '14px 32px',
            background: 'var(--color-accent)',
            color: 'white',
            borderRadius: 'var(--radius-md)',
            fontWeight: '600',
            fontSize: '15px',
            textDecoration: 'none',
            transition: 'all var(--transition-normal)',
            boxShadow: '0 0 30px rgba(124, 58, 237, 0.4)',
            fontFamily: 'var(--font-body)',
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 0 40px rgba(124, 58, 237, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(124, 58, 237, 0.4)';
            }}
          >
            Create your glyph
          </Link>

          <Link to="/login" style={{
            padding: '14px 32px',
            background: 'transparent',
            color: 'var(--color-text-primary)',
            borderRadius: 'var(--radius-md)',
            fontWeight: '500',
            fontSize: '15px',
            textDecoration: 'none',
            border: '1px solid var(--color-border)',
            transition: 'all var(--transition-normal)',
            fontFamily: 'var(--font-body)',
          }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-border-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
          >
            Sign in
          </Link>
        </div>
      </section>

      <section style={{
        maxWidth: '740px',
        margin: '0 auto 80px',
        padding: '0 24px',
        animation: 'fadeInUp 0.9s ease',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          position: 'relative',
        }}>
          <p style={{
            textAlign: 'center',
            fontSize: '12px',
            color: 'var(--color-text-tertiary)',
            marginBottom: '16px',
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.05em',
          }}>
            ✦ TRY DRAWING A GLYPH BELOW ✦
          </p>

          <StarField
            onSequenceChange={setDemoSequence}
            width={680}
            height={300}
          />

          {demoSequence.length >= 4 && (
            <p style={{
              textAlign: 'center',
              marginTop: '16px',
              fontSize: '14px',
              color: 'var(--color-accent-light)',
              fontFamily: 'var(--font-body)',
              animation: 'fadeInUp 0.3s ease',
            }}>
              Beautiful! <Link to="/register" style={{ color: 'white', textDecoration: 'underline' }}>
                Create your account
              </Link> to save this as your glyph password.
            </p>
          )}
        </div>
      </section>

      <section style={{
        maxWidth: '900px',
        margin: '0 auto 100px',
        padding: '0 24px',
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '1.6rem',
          marginBottom: '48px',
          color: 'var(--color-text-primary)',
        }}>
          How it works
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
        }}>
          {[
            {
              emoji: '✦',
              title: 'Draw your constellation',
              desc: 'Connect at least 4 stars in any order to create your unique glyph pattern.',
            },
            {
              emoji: '🔒',
              title: 'Securely hashed',
              desc: 'Your star sequence is hashed with bcrypt before storage. We never store the raw pattern.',
            },
            {
              emoji: '⚡',
              title: 'Instant authentication',
              desc: 'On login, redraw your glyph. The sequence is compared against your stored hash.',
            },
          ].map((step, i) => (
            <div key={i} style={{
              padding: '28px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              transition: 'border-color var(--transition-normal)',
            }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
            >
              <div style={{ fontSize: '28px', marginBottom: '16px' }}>{step.icon}</div>
              <h3 style={{
                fontSize: '1rem',
                marginBottom: '10px',
                fontFamily: 'var(--font-body)',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
              }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;