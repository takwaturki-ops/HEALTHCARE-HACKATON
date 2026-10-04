import { forwardRef } from 'react';

const Avatar = forwardRef(function Avatar({ src, alt, name, size = 'md', className = '', ...props }, ref) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-lg',
  };

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const bgColors = [
    'bg-cyan-100 text-cyan-700',
    'bg-purple-100 text-purple-700',
    'bg-pink-100 text-pink-700',
    'bg-indigo-100 text-indigo-700',
    'bg-orange-100 text-orange-700',
    'bg-teal-100 text-teal-700',
  ];

  const colorIndex = name
    ? name.charCodeAt(0) % bgColors.length
    : 0;

  return (
    <div
      ref={ref}
      className={`
        inline-flex items-center justify-center rounded-full font-medium
        ${sizes[size]} ${bgColors[colorIndex]} ${className}
      `}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';
export default Avatar;