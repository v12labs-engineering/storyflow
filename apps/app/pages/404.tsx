import Image from 'next/image';

export default function Custom404() {
    return (
        <div style={{ 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'marginTop': '3rem' }}>
            <Image src="/404.svg" alt="Storyflow illustration" width={650} height={400} />
        </div>
    );
}