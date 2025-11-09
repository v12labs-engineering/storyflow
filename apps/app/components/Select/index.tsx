import { default as ReactSelect, Props } from 'react-select';
import styles from './Select.module.css';

export default function Select(props: Props) {
    return (
        <ReactSelect
            className={styles.select}
            classNamePrefix="storyflow-select"
            {...props} />
    );
}