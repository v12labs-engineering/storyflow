import styles from './Input.module.css';
import Icon from '@components/Icon';
import React from 'react';
interface InputProps {
    type?: string;
    icon?: string;
    placeholder?: string;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function Input({ type, icon, placeholder, value, onChange }: InputProps) {
    return (
        <div className={styles.input}>
            {icon && <Icon type={icon} />}
            <input
                className={styles.inputField}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    )
}
