import styles from './MenuIcon.module.css';
import { useState } from 'react';
import classnames from 'classnames';

interface MenuIconProps {
    className?: string;
    onClick?: () => void;
}

export default function MenuIcon({ className, onClick }: MenuIconProps) {
    const [toggle, setToggle] = useState<boolean>(false);

    const toggleClass = () => {
        onClick && onClick();
        setToggle(!toggle);
    }

    return (
        <div className={classnames(styles.container, className, { [styles.change]: toggle })} onClick={toggleClass}>
            <div className={styles.bar1}></div>
            <div className={styles.bar2}></div>
            <div className={styles.bar3}></div>
        </div>
    )
}