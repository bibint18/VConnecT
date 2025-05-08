import React from 'react';
interface StatsCardProps {
    title: string;
    value: string | number;
    gradient?: boolean;
    gradientColors?: string;
}
declare const StatsCard: React.FC<StatsCardProps>;
export default StatsCard;
