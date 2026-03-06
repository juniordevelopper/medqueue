import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Loader2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../api/axios';
import styles from './VerifyEmail.module.css';

const VerifyEmail = () => {
    const { uid, token } = useParams();
    const [status, setStatus] = useState('loading'); // loading, success, error

    useEffect(() => {
        const verify = async () => {
            try {
                // Backend manzilingiz: /auth/verify-email/UID/TOKEN/
                const response = await api.get(`/auth/verify-email/${uid}/${token}/`);
                if (response.status === 200) {
                    setStatus('success');
                    launchConfetti(); // Muvaffaqiyatli bo'lsa mushaklarni otamiz
                }
            } catch (error) {
                setStatus('error');
            }
        };
        verify();
    }, [uid, token]);

    // Mushaklar effekti funksiyasi
    const launchConfetti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    return (
        <div className={styles.fullPage}>
            <div className={styles.card}>
                {status === 'loading' && (
                    <div className={styles.centerContent}>
                        <Loader2 className={styles.spinner} size={60} />
                        <h2>Tasdiqlanmoqda...</h2>
                    </div>
                )}

                {status === 'success' && (
                    <div className={styles.centerContent}>
                        <div className={styles.iconWrapper}>
                            <CheckCircle className={styles.checkIcon} size={100} />
                        </div>
                        <h1 className={styles.successTitle}>Tabriklaymiz!</h1>
                        <p className={styles.message}>
                            Email manzilingiz muvaffaqiyatli tasdiqlandi. <br />
                            Endi MedQueue imkoniyatlaridan to'liq foydalanishingiz mumkin.
                        </p>
                        <Link to="/login" className={styles.loginBtn}>
                            LOGIN QILISH <ArrowRight size={20} />
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className={styles.centerContent}>
                        <XCircle className={styles.errorIcon} size={100} />
                        <h1 className={styles.errorTitle}>Xatolik!</h1>
                        <p className={styles.message}>
                            Tasdiqlash linki yaroqsiz yoki muddati o'tgan. <br />
                            Iltimos, qaytadan ro'yxatdan o'tishga urinib ko'ring.
                        </p>
                        <Link to="/register" className={styles.retryBtn}>
                            RO'YXATDAN O'TISHGA QAYTISH
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
