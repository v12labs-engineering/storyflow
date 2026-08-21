import styles from './TextArea.module.css';
import React from 'react';

interface TextAreaProps {
    placeholder?: string;
    value?: string;
    rows?: number;
    cols?: number;
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
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
