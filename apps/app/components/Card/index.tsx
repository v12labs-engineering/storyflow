import styles from './Card.module.css';
import Icon from '@components/Icon';

interface CardProps {
    id?: string;
    title: string;
    type?: string;
    description: string;
    url: string;
    cardActions?: [{ name: string, action: () => Promise<void> }];
}

export default function Card({ id, title, type, description, url, cardActions }: CardProps) {
    const cardActionToggle = (id: string) => {
        const cardMenu = document.getElementById(`menu-card-${id}`);
        if (cardMenu) {
            if (cardMenu.style.display === 'block') {
                cardMenu.style.display = 'none';
                return;
            }
            cardMenu.style.display = 'block';
        }
    };

    return (
        <div className={styles.card} key={id}>
            <Icon onClick={() => cardActionToggle(id as string)} type='more-vertical' size={28} />
            <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardDescription}>{description}</p>
            </div>
            <div id={`menu-card-${id}`} className={styles.cardActions}>
                {id && cardActions && (
                    <ul >
                        {cardActions.map(({ name, action }) => (
                            <>
                                <li key={name} onClick={() => action()}>
                                    {name}
                                </li>
                            </>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}