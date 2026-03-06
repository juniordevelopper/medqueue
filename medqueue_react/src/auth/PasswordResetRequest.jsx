import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Mail, Loader2, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import styles from './PasswordResetRequest.module.css';

const PasswordResetRequest = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Backend URL: /auth/password-reset/
            const response = await api.post('/auth/password-reset/', { email });
            
            if (response.status === 200) {
                if (response.data.message === 'Emailingizga parolni qayta tiklash uchun link yuborildi! Iltimos, Emailingizni tekshiring!') {
                    toast.success(response.data.message);
                } else if (response.data.message === 'Tizimda bunday email topilmadi. Iltimos, oldin ro\'yxatdan o\'ting!') {
                    toast.error(response.data.message);
                } else {
                    toast.error('Nimadir xato ketdi, Iltimos keyinroq yana urinib ko\'ring yoki yordam markaziga bog\'laning!')
                }
                setEmail(''); // Formani tozalash
            }
        } catch (error) {
            toast.error("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.mainContainer}>
            {/* Navbar - Boshqa Auth sahifalari bilan bir xil */}
            <nav className={styles.navbar}>
                <Link to="/" className={styles.navLink}><ChevronLeft size={20}/> Asosiy</Link>
                <Link to="/login" className={styles.navLink}>Login <ChevronRight size={20}/></Link>
            </nav>

            <div className={styles.wrapper}>
                <div className={styles.card}>
                    <h2 className={styles.title}>Parolni tiklash</h2>
                    <p className={styles.subtitle}>
                        Ro'yxatdan o'tgan email manzilingizni kiriting. Biz sizga parolni yangilash uchun maxsus link yuboramiz.
                    </p>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label>Email manzil</label>
                            <div className={styles.inputWrapper}>
                                <Mail className={styles.mailIcon} size={18} />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} 
                                    placeholder="example@mail.com"
                                    required 
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                            {isLoading ? <Loader2 className={styles.spinner} size={24} /> : (
                                <>LINK YUBORISH <Send size={18} /></>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PasswordResetRequest;
