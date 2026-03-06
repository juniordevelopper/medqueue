import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import styles from './Register.module.css';

const Register = () => {
    const [formData, setFormData] = useState({
        full_name: '', email: '', phone: '', password: '', confirm_password: ''
    });

    const [errors, setErrors] = useState({});
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validateField = (name, value) => {
        let error = "";
        if (name === 'full_name' && value.length < 3) error = "Ism kamida 3 ta harf bo'lishi kerak";
        if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) error = "Email formati noto'g'ri";
        if (name === 'phone' && !/^\+998\d{9}$/.test(value)) error = "Format: +998XXXXXXXXX";
        if (name === 'password') {
            if (value.length < 8) error = "Kamida 8 ta belgi";
        }
        if (name === 'confirm_password' && value !== formData.password) error = "Parollar mos kelmadi";
        
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.values(errors).some(x => x !== "") || formData.password !== formData.confirm_password) {
            toast.error("Xatoliklarni tekshiring!");
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post('/auth/register/', {
                full_name: formData.full_name, email: formData.email,
                phone: formData.phone, password: formData.password
            });
            toast.success(response.data.message);
            setFormData({ full_name: '', email: '', phone: '', password: '', confirm_password: '' });
        } catch (error) {
            toast.error(error.response?.data?.error || "Xatolik!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.mainContainer}>
            <nav className={styles.navbar}>
                <Link to="/" className={styles.navLink}><ChevronLeft size={20}/> Asosiy</Link>
                <Link to="/login" className={styles.navLink}>Kirish <ChevronRight size={20}/></Link>
            </nav>

            <div className={styles.wrapper}>
                <div className={styles.card}>
                    <h2 className={styles.title}>Ro'yxatdan o'tish</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        
                        {/* To'liq ism - Alohida qatorda */}
                        <div className={styles.rowFull}>
                            <div className={styles.inputGroup}>
                                <label>To'liq ism</label>
                                <input 
                                    type="text" name="full_name" value={formData.full_name}
                                    className={errors.full_name ? styles.errorInput : formData.full_name ? styles.successInput : ''}
                                    onChange={handleChange} required 
                                />
                                {errors.full_name && <span className={styles.errorText}>{errors.full_name}</span>}
                            </div>
                        </div>

                        {/* Email va Telefon - Noutbukda yonma-yon */}
                        <div className={styles.rowDouble}>
                            <div className={styles.inputGroup}>
                                <label>Email</label>
                                <input 
                                    type="email" name="email" value={formData.email}
                                    className={errors.email ? styles.errorInput : formData.email ? styles.successInput : ''}
                                    onChange={handleChange} required 
                                />
                                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Telefon (+998...)</label>
                                <input 
                                    type="text" name="phone" value={formData.phone}
                                    className={errors.phone ? styles.errorInput : formData.phone ? styles.successInput : ''}
                                    onChange={handleChange} required 
                                />
                                {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                            </div>
                        </div>

                        {/* Parollar - Noutbukda yonma-yon */}
                        <div className={styles.rowDouble}>
                            <div className={styles.inputGroup}>
                                <label>Parol</label>
                                <div className={styles.passwordWrapper}>
                                    <input 
                                        type={showPass ? "text" : "password"} 
                                        name="password" value={formData.password}
                                        className={errors.password ? styles.errorInput : formData.password ? styles.successInput : ''}
                                        onChange={handleChange} required 
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)} className={styles.eyeBtn}>
                                        {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                                    </button>
                                </div>
                                {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Parolni takrorlash</label>
                                <div className={styles.passwordWrapper}>
                                    <input 
                                        type={showConfirmPass ? "text" : "password"} 
                                        name="confirm_password" value={formData.confirm_password}
                                        className={errors.confirm_password ? styles.errorInput : formData.confirm_password ? styles.successInput : ''}
                                        onChange={handleChange} required 
                                    />
                                    <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className={styles.eyeBtn}>
                                        {showConfirmPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                                    </button>
                                </div>
                                {errors.confirm_password && <span className={styles.errorText}>{errors.confirm_password}</span>}
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                            {isLoading ? <Loader2 className={styles.spinner} size={24} /> : "HISOB YARATISH"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
