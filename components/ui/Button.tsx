interface ButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'custom';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'primary', size = 'md', disabled = false, loading = false, className = '' }) => {
  const baseStyles = 'inline-flex items-center justify-center gap-x-2 rounded-md font-semibold transition duration-200 ease-in-out cursor-pointer';

  const variantStyles = {
    primary: 'bg-indigo-500 text-white border hover:bg-indigo-400',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizeStyles = {
    sm: 'text-sm px-3 py-2',
    md: 'text-base px-4 py-3',
    lg: 'text-lg px-5 py-4',
  };

  const finalClassName =
    variant === 'custom'
      ? className
      : `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} ${
          disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
        }`;

  return (
    <button onClick={onClick} disabled={disabled || loading} className={finalClassName}>
      {loading ? (
        <div className="flex items-center justify-center">
          <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8h-8z" />
          </svg>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;