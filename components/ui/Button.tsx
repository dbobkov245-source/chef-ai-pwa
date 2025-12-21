import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    children,
    className = '',
    disabled,
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

    const variantClasses = {
        primary: 'bg-primary text-text-main hover:bg-primary-dark shadow-sm',
        secondary: 'bg-gray-100 text-text-main hover:bg-gray-200',
        ghost: 'bg-transparent text-text-main hover:bg-gray-100',
        danger: 'bg-red-500 text-white hover:bg-red-600',
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm rounded-lg',
        md: 'px-4 py-2.5 text-base rounded-xl',
        lg: 'px-6 py-3.5 text-lg rounded-2xl',
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <Loader2 className="animate-spin" size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
            ) : icon ? (
                icon
            ) : null}
            {children}
        </button>
    );
};

export default Button;
