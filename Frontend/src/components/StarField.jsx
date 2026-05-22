import { useState, useRef, useEffect } from 'react';
import { generateStars, getStarById } from './glyphUtils.js';

const SNAP_RADIUS = 40;

const StarField = ({
  onSequenceChange,
  onComplete,
  errorState,
  disabled,
  width = 580,
  height = 340,
}) => {

  const stars = generateStars(18, width, height);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mousePos, setMousePos] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const svgRef = useRef(null);

  const getCursorPos = (e) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const findNearestStar = (pos) => {
    let nearest = null;
    let nearestDist = SNAP_RADIUS;
    for (const star of stars) {
      const dx = pos.x - star.x;
      const dy = pos.y - star.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < nearestDist) {
        nearest = star;
        nearestDist = dist;
      }
    }
    return nearest;
  };

  const clearGlyph = () => {
    setSelectedIds([]);
    setIsDrawing(false);
    setMousePos(null);
    if (onSequenceChange) onSequenceChange([]);
  };

  const handleMouseDown = (e) => {
    if (disabled) return;
    e.preventDefault();
    const pos = getCursorPos(e);
    if (!pos) return;
    setIsDrawing(true);
    setSelectedIds([]);
    const nearStar = findNearestStar(pos);
    if (nearStar) {
      setSelectedIds([nearStar.id]);
      if (onSequenceChange) onSequenceChange([nearStar.id]);
    }
  };

  const handleMouseMove = (e) => {
    if (disabled) return;
    const pos = getCursorPos(e);
    if (!pos) return;
    setMousePos(pos);
    const nearStar = findNearestStar(pos);
    setHoveredId(nearStar ? nearStar.id : null);
    if (!isDrawing) return;
    if (nearStar && !selectedIds.includes(nearStar.id)) {
      const newIds = [...selectedIds, nearStar.id];
      setSelectedIds(newIds);
      if (onSequenceChange) onSequenceChange(newIds);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => {
      if (!isDrawing) return;
      setIsDrawing(false);
      setMousePos(null);
      if (onComplete && selectedIds.length >= 4) {
        onComplete(selectedIds);
      }
    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [isDrawing, selectedIds, onComplete]);

  const getLinePoints = () => {
    return selectedIds
      .map((id) => {
        const star = getStarById(stars, id);
        return star ? `${star.x},${star.y}` : null;
      })
      .filter(Boolean)
      .join(' ');
  };

  return (
    <div style={{
      position: 'relative',
      animation: errorState ? 'shake 0.4s ease' : 'none',
    }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          borderRadius: '12px',
          cursor: isDrawing ? 'crosshair' : 'default',
          background: 'radial-gradient(ellipse at center, #0d0720 0%, #030014 70%)',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        {Array.from({ length: 35 }, (_, i) => {
          const x = ((i * 137.5) % width);
          const y = ((i * 97.3) % height);
          return (
            <circle
              key={`bg-${i}`}
              cx={x}
              cy={y}
              r={0.8}
              fill="rgba(255,255,255,0.2)"
              style={{ animation: `twinkle ${2 + (i % 3)}s ease-in-out infinite` }}
            />
          );
        })}

        {selectedIds.length > 1 && (
          <polyline
            points={getLinePoints()}
            stroke={errorState ? '#f87171' : '#a78bfa'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.8"
            style={{ filter: errorState ? 'none' : 'drop-shadow(0 0 6px #7c3aed)' }}
          />
        )}

        {isDrawing && mousePos && selectedIds.length > 0 && (() => {
          const lastStar = getStarById(stars, selectedIds[selectedIds.length - 1]);
          if (!lastStar) return null;
          return (
            <line
              x1={lastStar.x}
              y1={lastStar.y}
              x2={mousePos.x}
              y2={mousePos.y}
              stroke="#a78bfa"
              strokeWidth="1.5"
              strokeDasharray="6 4"
              opacity="0.5"
              strokeLinecap="round"
            />
          );
        })()}

        {stars.map((star) => {
          const isSelected = selectedIds.includes(star.id);
          const isHovered = hoveredId === star.id;
          const orderNumber = selectedIds.indexOf(star.id);
          return (
            <g key={star.id}>
              {(isSelected || isHovered) && (
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={star.radius + 10}
                  fill={isSelected ? 'rgba(124, 58, 237, 0.2)' : 'rgba(167, 139, 250, 0.08)'}
                  style={{ animation: isSelected ? 'pulse 2s ease-in-out infinite' : 'none' }}
                />
              )}
              <circle
                cx={star.x}
                cy={star.y}
                r={isSelected ? star.radius + 3 : isHovered ? star.radius + 1 : star.radius}
                fill={isSelected ? '#a78bfa' : isHovered ? '#c4b5fd' : `rgba(255, 255, 255, ${star.brightness})`}
                style={{
                  cursor: 'pointer',
                  filter: isSelected ? 'drop-shadow(0 0 4px #a78bfa)' : 'none',
                  transition: 'r 0.1s ease, fill 0.1s ease',
                }}
              />
              {isSelected && (
                <text
                  x={star.x}
                  y={star.y + 4}
                  textAnchor="middle"
                  fill="white"
                  fontSize="9"
                  fontWeight="700"
                  style={{ pointerEvents: 'none' }}
                >
                  {orderNumber + 1}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {!disabled && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '12px',
          padding: '0 4px',
        }}>
          <span style={{
            fontSize: '13px',
            color: selectedIds.length >= 4 ? 'var(--color-accent-light)' : 'var(--color-text-secondary)',
          }}>
            {selectedIds.length === 0 && 'Click and drag to draw your glyph'}
            {selectedIds.length > 0 && selectedIds.length < 4 && `${selectedIds.length} stars — need ${4 - selectedIds.length} more`}
            {selectedIds.length >= 4 && `✦ ${selectedIds.length} stars connected`}
          </span>
          {selectedIds.length > 0 && (
            <button onClick={clearGlyph} style={{
              background: 'none',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              cursor: 'pointer',
            }}>
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default StarField;