import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ChevronLeft, ChevronRight, LogIn } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import styles from './Login.module.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Tokenlarni olish
            const response = await api.post('/auth/login/', formData);

            if (response.status === 200) {
                localStorage.setItem('access', response.data.access);
                localStorage.setItem('refresh', response.data.refresh);
                
                // 1. Foydalanuvchining kimligini aniqlash (Short info)
                const userRes = await api.get('/auth/user/me/'); 
                const user = userRes.data;

                toast.success(`Xush kelibsiz, ${user.full_name}!`);

                // 2. Roliga qarab yo'naltirish
                if (user.is_doctor) {
                    navigate('/doctor'); // Bu yerda keyin Doctor API ga so'rov yuboriladi
                } else {
                    navigate('/patient'); // Bu yerda keyin Profile API ga so'rov yuboriladi
                }
            }
        } catch (error) {
            // Xatolik bo'lsa tokenlarni tozalaymiz (chala qolmasligi uchun)
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');

            const errorMsg = error.response?.data?.detail || "Email yoki parol xato!";
            toast.error(errorMsg);
            console.error("Login xatoligi:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.mainContainer}>
            <nav className={styles.navbar}>
                <Link to="/" className={styles.navLink}><ChevronLeft size={20}/> Asosiy</Link>
                <Link to="/register" className={styles.navLink}>Ro'yxatdan o'tish <ChevronRight size={20}/></Link>
            </nav>

            <div className={styles.wrapper}>
                <div className={styles.card}>
                    <h2 className={styles.title}>Tizimga kirish</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        
                        <div className={styles.inputGroup}>
                            <label>Email manzil</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email}
                                onChange={handleChange} 
                                placeholder="example@mail.com"
                                required 
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <div className={styles.labelRow}>
                                <label>Parol</label>
                            </div>
                            <div className={styles.passwordWrapper}>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    name="password" 
                                    value={formData.password}
                                    onChange={handleChange} 
                                    placeholder="********"
                                    required 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)} 
                                    className={styles.eyeBtn}
                                >
                                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                            {isLoading ? <Loader2 className={styles.spinner} size={24} /> : (
                                <>KIRISH <LogIn size={20} /></>
                            )}
                        </button>
                    </form>

                    <div className={styles.footer}>
                        <p>Parolni unitdingizmi? <Link to="/pasword-reset">Parolni tiklash</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
