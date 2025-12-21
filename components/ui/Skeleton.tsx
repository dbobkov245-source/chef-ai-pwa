import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    lines?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'rectangular',
    width,
    height,
    lines = 1,
}) => {
    const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';

    const variantClasses = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-xl',
    };

    const style: React.CSSProperties = {
        width: width || '100%',
        height: height || (variant === 'text' ? '1em' : '100%'),
    };

    if (lines > 1 && variant === 'text') {
        return (
            <div className={`space-y-2 ${className}`}>
                {Array.from({ length: lines }).map((_, index) => (
                    <div
                        key={index}
                        className={`${baseClasses} ${variantClasses[variant]}`}
                        style={{
                            ...style,
                            width: index === lines - 1 ? '75%' : '100%',
                        }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        />
    );
};

// Recipe Card Skeleton
export const RecipeCardSkeleton: React.FC = () => (
    <div className="bg-surface-light rounded-2xl shadow-lg border border-gray-100 overflow-hidden p-6">
        <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
                <Skeleton variant="text" height="1.5rem" width="70%" className="mb-2" />
                <Skeleton variant="text" height="1rem" lines={2} />
            </div>
            <Skeleton variant="circular" width={40} height={40} />
        </div>

        <div className="flex gap-4 mb-6">
            <Skeleton variant="rectangular" width={80} height={32} />
            <Skeleton variant="rectangular" width={80} height={32} />
            <Skeleton variant="rectangular" width={80} height={32} />
        </div>

        <div className="space-y-4">
            <Skeleton variant="text" height="1.25rem" width="40%" />
            <div className="space-y-2">
                <Skeleton variant="text" height="1rem" />
                <Skeleton variant="text" height="1rem" />
                <Skeleton variant="text" height="1rem" width="80%" />
            </div>
        </div>
    </div>
);

export default Skeleton;
