import styles from './TextArea.module.css';

interface TextAreaProps {
    placeholder?: string;
    value?: string;
    rows?: number;
    cols?: number;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function TextArea({ placeholder, value, rows = 5, cols, onChange }: TextAreaProps) {
    return (
        <div className={styles.input}>
            <textarea
                className={styles.inputField}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                rows={rows}
                cols={cols}
            />
        </div>
    )
}