const variants = {
  critique: 'bg-red-100 text-red-800 border-red-200 animate-pulse-subtle',
  haute: 'bg-orange-100 text-orange-800 border-orange-200',
  normale: 'bg-green-100 text-green-800 border-green-200',
  ouvert: 'bg-blue-100 text-blue-800 border-blue-200',
  partiel: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  resolu: 'bg-green-100 text-green-800 border-green-200',
  machine: 'bg-purple-100 text-purple-800 border-purple-200',
  sang: 'bg-red-100 text-red-800 border-red-200',
  medicament: 'bg-blue-100 text-blue-800 border-blue-200',
  consommable: 'bg-amber-100 text-amber-800 border-amber-200',
  default: 'bg-slate-100 text-slate-800 border-slate-200',
};

const typeColors = {
  MACHINE: 'machine',
  SANG: 'sang',
  MEDICAMENT: 'medicament',
  CONSOMMABLE: 'consommable',
};

const statusColors = {
  OUVERT: 'ouvert',
  PARTIEL: 'partiel',
  RESOLU: 'resolu',
};

const urgencyColors = {
  CRITIQUE: 'critique',
  HAUTE: 'haute',
  NORMALE: 'normale',
};

export function Badge({ children, variant = 'default', dot = false, className = '' }) {
  const baseClass = variants[variant] || variants.default;
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium
        border ${baseClass} ${className}
      `}
    >
      {dot && (
        <span
          className={`
            w-1.5 h-1.5 rounded-full ${dot === true ? 'bg-current' : ''}
            ${variant === 'critique' && 'animate-pulse'}
          `}
        />
      )}
      {children}
    </span>
  );
}

export function UrgencyBadge({ urgency, className = '' }) {
  const variant = urgencyColors[urgency] || 'default';
  return (
    <Badge variant={variant} dot={urgency === 'CRITIQUE'} className={className}>
      {urgency}
    </Badge>
  );
}

export function TypeBadge({ type, className = '' }) {
  const variant = typeColors[type] || 'default';
  const label = type === 'SANG' ? 'Sang' : type === 'MEDICAMENT' ? 'Médicament' : type === 'CONSOMMABLE' ? 'Consommable' : 'Machine';
  return <Badge variant={variant} className={className}>{label}</Badge>;
}

export function StatusBadge({ status, className = '' }) {
  const variant = statusColors[status] || 'default';
  return <Badge variant={variant} className={className}>{status}</Badge>;
}

export default Badge;