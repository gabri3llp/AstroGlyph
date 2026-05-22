import { useAuth } from '../AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const CheckedIn = () => {
  const { user, logout } = useAuth();
  // logout: clears token from localStorage and resets state

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');

  };


  const formatDate = (dateString) => {
    if (!dateString) return 'First login!';
    return new Date(dateString).toLocaleString();
  };


  const glyphDisplay = user?.glyphStarIds
    ? user.glyphStarIds.join(' — ')
    : '???';

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '80px',
      paddingBottom: '60px',
      animation: 'fadeInUp 0.6s ease',
    }}>


      <div style={{
        maxWidth: '760px',
        margin: '0 auto',
        padding: '0 24px',
      }}>

        <div style={{ marginBottom: '48px', textAlign: 'center' }}>


          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-accent), #a78bfa)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontWeight: '700',
            color: 'white',
            margin: '0 auto 20px',
            boxShadow: '0 0 30px rgba(124, 58, 237, 0.4)',
          }}>
            {user?.username?.[0]?.toUpperCase() || '?'}
          </div>

          <h1 style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #ffffff 0%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Welcome back, {user?.username}
          </h1>

          <p style={{
            color: 'var(--color-text-secondary)',
            fontSize: '14px',
            fontFamily: 'var(--font-body)',
          }}>
            {user?.email}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}>

          <div style={cardStyle}>
            <p style={cardLabelStyle}>Total Logins</p>
            <p style={cardValueStyle}>{user?.loginCount ?? 0}</p>
          </div>

          <div style={cardStyle}>
            <p style={cardLabelStyle}>Last Login</p>
            <p style={{ ...cardValueStyle, fontSize: '14px' }}>
              {formatDate(user?.lastLogin)}
            </p>
          </div>

        </div>

        <div style={{
          ...cardStyle,
          marginBottom: '32px',
          padding: '28px',
        }}>
          <p style={cardLabelStyle}>Your Constellation Stars</p>
          <p style={{
            fontSize: '22px',
            fontWeight: '600',
            color: 'var(--color-accent-light)',
            letterSpacing: '0.08em',
            margin: '12px 0 8px',
            fontFamily: 'var(--font-body)',
          }}>
            ✦ {glyphDisplay} ✦
          </p>
          <p style={{
            fontSize: '12px',
            color: 'var(--color-text-tertiary)',
            fontFamily: 'var(--font-body)',
          }}>
            Star IDs in your glyph (order hidden for security)
          </p>
        </div>

        <div style={{
          padding: '16px 20px',
          background: 'rgba(124, 58, 237, 0.08)',
          border: '1px solid rgba(124, 58, 237, 0.2)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '40px',
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
          fontFamily: 'var(--font-body)',
          lineHeight: '1.6',
        }}>
          🔒 Your glyph sequence is hashed with bcrypt and never stored in plain text.
          The star IDs shown above are sorted — your draw order is never revealed.
        </div>

        {/* ---- LOGOUT BUTTON ---- */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleLogout}
            style={{
              padding: '12px 36px',
              background: 'transparent',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              transition: 'all var(--transition-normal)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
              e.currentTarget.style.color = 'rgb(239, 68, 68)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            Sign out
          </button>
        </div>

      </div>
    </div>
  );
};

//My cards

const cardStyle = {
  padding: '24px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
};

const cardLabelStyle = {
  fontSize: '11px',
  letterSpacing: '0.08em',
  color: 'var(--color-text-tertiary)',
  fontFamily: 'var(--font-body)',
  marginBottom: '8px',
  textTransform: 'uppercase',
};

const cardValueStyle = {
  fontSize: '28px',
  fontWeight: '700',
  color: 'var(--color-text-primary)',
  margin: 0,
};

export default CheckedIn;