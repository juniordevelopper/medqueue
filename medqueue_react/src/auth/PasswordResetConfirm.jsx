import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import styles from './PasswordResetConfirm.module.css';

const PasswordResetConfirm = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({ password: '', confirm_password: '' });
    const [errors, setErrors] = useState({});
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validate = (name, value) => {
        let error = "";
        if (name === 'password') {
            if (value.length < 8) error = "Kamida 8 ta belgi kerak";
        }
        if (name === 'confirm_password' && value !== formData.password) {
            error = "Parollar mos kelmadi";
        }
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        validate(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (errors.password || errors.confirm_password || !formData.password) {
            toast.error("Iltimos, parolni to'g'ri kiriting!");
            return;
        }

        setIsLoading(true);
        try {
            // Backend URL: /auth/password-reset-confirm/UID/TOKEN/
            const response = await api.post(`/auth/password-reset-confirm/${uid}/${token}/`, {
                new_password: formData.password
            });
            
            navigate('/password-update-success');
        } catch (error) {
            toast.error(error.response?.data?.error || "Link yaroqsiz yoki muddati o'tgan!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.wrapper}>
                <div className={styles.card}>
                    <div className={styles.headerIcon}>
                        <ShieldCheck size={50} color="#1a2a6c" />
                    </div>
                    <h2 className={styles.title}>Yangi parol</h2>
                    <p className={styles.subtitle}>Iltimos, eslab qolish oson bo'lgan, ammo kuchli parol tanlang.</p>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {/* Yangi parol */}
                        <div className={styles.inputGroup}>
                            <label>Yangi parol</label>
                            <div className={styles.passwordWrapper}>
                                <input 
                                    type={showPass ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    className={errors.password ? styles.errorInput : formData.password ? styles.successInput : ''}
                                    onChange={handleChange}
                                    placeholder="********"
                                    required 
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className={styles.eyeBtn}>
                                    {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                                </button>
                            </div>
                            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                        </div>

                        {/* Tasdiqlash */}
                        <div className={styles.inputGroup}>
                            <label>Parolni tasdiqlash</label>
                            <div className={styles.passwordWrapper}>
                                <input 
                                    type={showConfirmPass ? "text" : "password"}
                                    name="confirm_password"
                                    value={formData.confirm_password}
                                    className={errors.confirm_password ? styles.errorInput : formData.confirm_password ? styles.successInput : ''}
                                    onChange={handleChange}
                                    placeholder="********"
                                    required 
                                />
                                <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className={styles.eyeBtn}>
                                    {showConfirmPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                                </button>
                            </div>
                            {errors.confirm_password && <span className={styles.errorText}>{errors.confirm_password}</span>}
                        </div>

                        <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                            {isLoading ? <Loader2 className={styles.spinner} size={24} /> : "PAROLNI SAQLASH"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PasswordResetConfirm;
