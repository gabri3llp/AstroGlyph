import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import StarField from '../components/StarField.jsx';
import { useAuth } from '../AuthContext.jsx';
import {encodeGlyphSequence,getSortedStarIds,isValidGlyphLength,sequencesMatch, } from '../components/glyphUtils.js';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [step, setStep] = useState(1);

  // Step 1 form fields
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');

  // Step 2: first glyph draw
  const [firstSequence, setFirstSequence] = useState([]);

  // Step 3: confirmation draw
  const [confirmSequence, setConfirmSequence] = useState([]);

  // Feedback
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  // confirmError: true if the confirmation draw didn't match the first.



  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !email.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;


    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setStep(2);

  };


  const handleFirstGlyphComplete = (sequence) => {
    if (!isValidGlyphLength(sequence)) {
      setError(`Please connect at least 4 stars.`);
      return;
    }
    setFirstSequence(sequence);
    setError('');
    setStep(3);
  };


  const handleConfirmGlyphComplete = async (sequence) => {
    setConfirmError(false);
    setError('');

    if (!isValidGlyphLength(sequence)) {
      setError('Please connect at least 4 stars to confirm.');
      return;
    }

    if (!sequencesMatch(firstSequence, sequence)) {
      setConfirmError(true);
      setError("Your glyph didn't match — try drawing it again.");

      setTimeout(() => {
        setConfirmError(false);
        setConfirmSequence([]);
      }, 800);
      return;
    }


    setLoading(true);

    try {
      const glyphSequence = encodeGlyphSequence(firstSequence);
      // "3-7-1-11-5" — the ordered sequence as a string.

      const glyphStarIds = getSortedStarIds(firstSequence);
      // [1,3,5,7,11] — sorted star IDs, no order information.

      await register(username, email, glyphSequence, glyphStarIds);

      navigate('/CheckedIn');

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
  
    } finally {
      setLoading(false);
      // "finally" runs whether the try succeeded OR the catch fired.
    }
  };

  const StepIndicator = () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0',
      marginBottom: '40px',
    }}>
      {[1, 2, 3].map((s) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
          {/* Step circle */}
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: '600',
            fontFamily: 'var(--font-body)',
            background: s < step
              ? 'var(--color-accent)'         
              : s === step
                ? 'rgba(124,58,237,0.3)'       
                : 'rgba(255,255,255,0.08)',     
            color: s <= step ? 'white' : 'var(--color-text-tertiary)',
            border: s === step ? '2px solid var(--color-accent)' : '2px solid transparent',
            transition: 'all 0.3s ease',
          }}>
            {s < step ? '✓' : s}
            {/* Show a checkmark for completed steps, number for current/future */}
          </div>

          {/* Connector line between steps */}
          {s < 3 && (
            <div style={{
              width: '60px',
              height: '1px',
              background: s < step
                ? 'var(--color-accent)'
                : 'rgba(255,255,255,0.1)',
              transition: 'background 0.3s ease',
            }} />
          )}
        </div>
      ))}
    </div>
  );

  // ---- RENDER ----------------------------------------------

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
        maxWidth: step === 1 ? '440px' : '700px',
        transition: 'max-width 0.4s ease',
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Create your account</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)', fontSize: '15px' }}>
            {step === 1 && 'First, tell us who you are.'}
            {step === 2 && 'Now draw your constellation glyph.'}
            {step === 3 && 'Draw it again to confirm your glyph.'}
          </p>
        </div>

        <StepIndicator />

        {/* Error display */}
        {error && (
          <div style={{
            background: 'rgba(248,113,113,0.1)',
            border: '1px solid rgba(248,113,113,0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            marginBottom: '24px',
            color: 'var(--color-error)',
            fontSize: '14px',
            fontFamily: 'var(--font-body)',
          }}>
            {error}
          </div>
        )}

        {/* ---- STEP 1: DETAILS FORM ---- */}
        {step === 1 && (
          <form onSubmit={handleDetailsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {[
              { label: 'Username', value: username, setter: setUsername, placeholder: 'e.g. StarGazer', type: 'text' },
              { label: 'Email address', value: email, setter: setEmail, placeholder: 'you@example.com', type: 'email' },
            ].map(({ label, value, setter, placeholder, type }) => (
              // Map over field config to avoid repeating input JSX twice.
              <div key={label}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '8px',
                  fontFamily: 'var(--font-body)',
                }}>
                  {label}
                </label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={placeholder}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text-primary)',
                    fontSize: '15px',
                    fontFamily: 'var(--font-body)',
                    transition: 'border-color var(--transition-fast)',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                />
              </div>
            ))}

            <button type="submit" style={{
              padding: '14px',
              background: 'var(--color-accent)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              transition: 'opacity var(--transition-fast)',
              marginTop: '8px',
            }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Continue to glyph creation →
            </button>

            <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--color-accent-light)' }}>Sign in</Link>
            </p>
          </form>
        )}

        {/* ---- STEP 2: DRAW GLYPH ---- */}
        {step === 2 && (
          <div>
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
            }}>
              <StarField
                onSequenceChange={setFirstSequence}
                onComplete={handleFirstGlyphComplete}
                width={640}
                height={340}
              />
            </div>
            <p style={{
              textAlign: 'center',
              marginTop: '20px',
              fontSize: '13px',
              color: 'var(--color-text-tertiary)',
              fontFamily: 'var(--font-body)',
            }}>
              Click and drag across stars to form your constellation. The ORDER matters!
            </p>
            <button
              onClick={() => setStep(1)}
              style={{
                marginTop: '16px',
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: 'var(--font-body)',
              }}
            >
              ← Back
            </button>
          </div>
        )}

        {/* ---- STEP 3: CONFIRM GLYPH ---- */}
        {step === 3 && (
          <div>
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${confirmError ? 'rgba(248,113,113,0.4)' : 'var(--color-border)'}`,
              // Red border when there's a confirmation error.
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              transition: 'border-color 0.3s ease',
            }}>
              <StarField
                onSequenceChange={setConfirmSequence}
                onComplete={handleConfirmGlyphComplete}
                errorState={confirmError}
                disabled={loading}
                width={640}
                height={340}
              />
            </div>

            {loading && (
              <p style={{
                textAlign: 'center',
                marginTop: '20px',
                color: 'var(--color-accent-light)',
                fontFamily: 'var(--font-body)',
                animation: 'pulse 1.5s ease infinite',
              }}>
                ✦ Creating your account...
              </p>
            )}

            <p style={{
              textAlign: 'center',
              marginTop: '16px',
              fontSize: '13px',
              color: 'var(--color-text-tertiary)',
              fontFamily: 'var(--font-body)',
            }}>
              Recreate the exact same constellation in the same order.
            </p>

            <button
              onClick={() => { setStep(2); setConfirmSequence([]); setError(''); }}
              style={{
                marginTop: '12px',
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: 'var(--font-body)',
              }}
            >
              ← Redraw my glyph
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;