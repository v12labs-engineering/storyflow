import { icons, } from 'feather-icons';

interface IconProps {
    type: string;
    size?: number;
    strokeWidth?: number;
    onClick?: () => void;
}

export default function Icon({ type, size = 24, strokeWidth = 2, onClick }: IconProps) {
    return (
        <svg
            className="icon"
            onClick={onClick}
            viewBox="0 0 24 24"
            width={size}
            height={size}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            shapeRendering="geometricPrecision"
            dangerouslySetInnerHTML={{ __html: icons[type].toString() }}>
        </svg>
    );
}