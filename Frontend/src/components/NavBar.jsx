import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      background: 'rgba(3, 0, 20, 0.85)',
      backdropFilter: 'blur(12px)',
      // backdropFilter: blurs the content BEHIND the element. Creates the "frosted glass" effect
      borderBottom: '1px solid var(--color-border)',
    }}>

      <Link to="/" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
      }}>

        <span style={{ fontSize: '20px', color: 'var(--color-accent-light)' }}>✦</span>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '16px',
          fontWeight: '700',
          color: 'var(--color-text-primary)',
          letterSpacing: '0.05em',
        }}>

          ASTROGLYPH
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {isAuthenticated ? (

          // LOGGED IN STATE
          <>
            <span style={{
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-body)',
            }}>
              ✦ {user?.username}
            </span>

            <Link to="/dashboard" style={{
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              transition: 'color var(--transition-fast)',
            }}
              onMouseEnter={(e) => e.target.style.color = 'var(--color-text-primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
            >
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
              style={{
                padding: '6px 16px',
                background: 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text-secondary)',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-error)';
                e.currentTarget.style.color = 'var(--color-error)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
            >
              Sign out
            </button>
          </>
        ) : (
          
          <> {/* LOGGED OUT STATE */}
            <Link to="/login" style={{
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              transition: 'color var(--transition-fast)',
            }}>
              Sign in
            </Link>

            <Link to="/register" style={{
              padding: '7px 18px',
              background: 'var(--color-accent)',
              borderRadius: 'var(--radius-sm)',
              color: 'white',
              fontSize: '13px',
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'opacity var(--transition-fast)',
            }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Get started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;