import styles from './Story.module.css';
import Icon from '@components/Icon';
import { useState, useEffect, useRef, ReactNode } from 'react';
import cn from 'classnames';

interface StoryProps {
    className?: string;
    children: React.ReactNode;
    showNavigation?: boolean;
}

function Story({ className, children, showNavigation = false }: StoryProps) {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const pages = useRef<HTMLLIElement[]>(Array.from(children as HTMLCollectionOf<HTMLLIElement>));

    const navigateTo = (direction: 'next' | 'prev' | number): void => {
        if (typeof direction === 'number') {
            setCurrentPage(direction);
        } else {
            if (direction === 'next') {
                pages.current.length - 1 > currentPage && setCurrentPage((prev) => prev + 1);
            } else {
                currentPage > 0 && setCurrentPage((prev) => prev - 1);
            }
        }
    }

    const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        const horizontalCenter = window.innerWidth / 2;
        const direction = e.pageX < horizontalCenter ? 'prev' : 'next';
        navigateTo(direction);
    }

    return (
        <div className={cn(styles.story, `${className}`)}>
            <ul className={styles.bars}>
                {pages.current && pages.current.map((_, i) => (
                    <li key={i} onClick={() => navigateTo(i)} className={cn(styles.bar, { [styles.active]: i === currentPage || (i >= 0 && i <= currentPage) })}>
                        <div className={cn(styles.barInner, { [styles.backgroundFill]: i < currentPage })} />
                    </li>
                ))}
            </ul>
            <div className={styles.content} onClick={handleClick}>
                {showNavigation && <Icon type="chevron-left" size={48} onClick={() => navigateTo('prev')} />}
                <ul className={styles.pages}>
                    {pages.current.filter((_, i) => i === currentPage) as ReactNode}
                </ul>
                {showNavigation && <Icon type="chevron-right" size={48} onClick={() => navigateTo('next')} />}
            </div>
        </div>
    );
}

interface PageProps {
    children: React.ReactNode;
}

function Page({ children }: PageProps) {
    return (
        <li className={styles.page}>
            {children}
        </li>
    );
}

export default Object.assign(Story, { Page });