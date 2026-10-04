import { forwardRef } from 'react';

const Card = forwardRef(function Card({ children, className = '', hover = false, padding = 'p-6', ...props }, ref) {
  return (
    <div
      ref={ref}
      className={`
        bg-white rounded-2xl border border-slate-200 shadow-sm
        ${hover ? 'transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer' : ''}
        ${padding} ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`mb-4 pb-4 border-b border-slate-100 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '', ...props }) {
  return <div className={className} {...props}>{children}</div>;
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={`mt-4 pt-4 border-t border-slate-100 ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Card;