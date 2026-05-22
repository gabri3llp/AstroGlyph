import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import StarField from '../components/StarField.jsx';
import { useAuth } from '../AuthContext.jsx';
import { encodeGlyphSequence, isValidGlyphLength } from '../components/glyphUtils.js';

const Login = () => {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [email, setEmail]               = useState('');
  const [glyphSequence, setGlyphSequence] = useState([]);


  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [errorState, setErrorState] = useState(false);

  const [attempts, setAttempts] = useState(0);

  const MAX_ATTEMPTS = 5;

  const handleGlyphComplete = async (sequence) => {
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address first.');
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!isValidGlyphLength(sequence)) {
      setError('Please connect at least 4 stars.');
      return;
    }

    if (attempts >= MAX_ATTEMPTS) {
      setError('Too many attempts. Please wait before trying again.');
      return;
    }

    setLoading(true);

    try {
      const encoded = encodeGlyphSequence(sequence);
      // Convert [3,7,1,11,5] → "3-7-1-11-5"
      await login(email.trim(), encoded);
      navigate('/CheckedIn');


    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setAttempts((prev) => prev + 1);
      setErrorState(true);

      setError(
        attempts + 1 >= MAX_ATTEMPTS
          ? 'Too many failed attempts.'
          : `${msg} (${MAX_ATTEMPTS - attempts - 1} attempt${MAX_ATTEMPTS - attempts - 1 !== 1 ? 's' : ''} remaining)`
      );

      setTimeout(() => setErrorState(false), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px 40px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '800px',
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '24px',
        alignItems: 'start',
      }}>

        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
        }}>
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Welcome back</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
              Enter your email, then cast your constellation.
            </p>
          </div>

          {/* Email input */}
          <label style={{
            display: 'block',
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            marginBottom: '8px',
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.04em',
          }}>
            EMAIL
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={loading}
            style={{
              width: '100%',
              padding: '11px 14px',
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-primary)',
              fontSize: '14px',
              fontFamily: 'var(--font-body)',
              marginBottom: '24px',
              transition: 'border-color var(--transition-fast)',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
          />

          {/* Divider with instruction */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
          }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
            <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
              then draw →
            </span>
          </div>

          {/* Error display */}
          {error && (
            <div style={{
              background: 'rgba(248,113,113,0.1)',
              border: '1px solid rgba(248,113,113,0.25)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 12px',
              marginBottom: '16px',
              color: 'var(--color-error)',
              fontSize: '13px',
              fontFamily: 'var(--font-body)',
              lineHeight: '1.5',
            }}>
              {error}
            </div>
          )}

          {/* Loading indicator */}
          {loading && (
            <div style={{
              textAlign: 'center',
              padding: '12px',
              color: 'var(--color-accent-light)',
              fontSize: '13px',
              fontFamily: 'var(--font-body)',
              animation: 'pulse 1.5s ease infinite',
            }}>
              ✦ Verifying your glyph...
            </div>
          )}

          {/* Footer links */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-body)', marginBottom: '8px' }}>
              No account?{' '}
              <Link to="/register" style={{ color: 'var(--color-accent-light)' }}>Create one</Link>
            </p>
          </div>
        </div>

        {/* ---- RIGHT PANEL: STARFIELD ---- */}
        <div>
          <p style={{
            fontSize: '12px',
            color: 'var(--color-text-tertiary)',
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.04em',
            marginBottom: '12px',
            textAlign: 'center',
          }}>
            CAST YOUR CONSTELLATION GLYPH
          </p>

          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${errorState ? 'rgba(248,113,113,0.4)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            transition: 'border-color 0.3s ease',
          }}>
            <StarField
              onSequenceChange={setGlyphSequence}
              onComplete={handleGlyphComplete}
              errorState={errorState}
              disabled={loading || attempts >= MAX_ATTEMPTS}
              width={460}
              height={340}
            />
          </div>

          <p style={{
            textAlign: 'center',
            marginTop: '12px',
            fontSize: '12px',
            color: 'var(--color-text-tertiary)',
            fontFamily: 'var(--font-body)',
          }}>
            Draw the same constellation you created during registration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;