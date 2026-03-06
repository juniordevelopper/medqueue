import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import styles from './VerifyEmail.module.css'; // Stilni o'sha yerdan olamiz

const UpdatifyPassword = () => {
    
    useEffect(() => {
        // Sahifa ochilishi bilan bayramni boshlaymiz
        launchConfetti();
    }, []);

    const launchConfetti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
        }, 250);
    };

    return (
        <div className={styles.fullPage}>
            <div className={styles.card}>
                <div className={styles.centerContent}>
                    <div className={styles.iconWrapper}>
                        <CheckCircle className={styles.checkIcon} size={100} />
                    </div>
                    <h1 className={styles.successTitle}>Parol Yangilandi!</h1>
                    <p className={styles.message}>
                        Sizning yangi parolingiz muvaffaqiyatli saqlandi. <br />
                        Endi xavfsiz tarzda tizimga kirishingiz mumkin.
                    </p>
                    <Link to="/login" className={styles.loginBtn}>
                        LOGIN QILISH <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UpdatifyPassword;
