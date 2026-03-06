import { Link } from 'react-router-dom';
import { 
    Activity, Stethoscope, ArrowRight, ShieldCheck, Timer,
    MessageSquare, Facebook, Mail, Phone, Instagram, Send
} from 'lucide-react';
import styles from './Welcome.module.css';

const Welcome = () => {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className={styles.container}>
            {/* NAVBAR */}
            <nav className={styles.navbar}>
                <div className={styles.logo}>
                    <Stethoscope className={styles.logoIcon} />
                    <span>MedQueue</span>
                </div>
                
                <ul className={styles.navLinks}>
                    <li onClick={() => scrollToSection('about')}>Afzalliklar</li>
                    <li onClick={() => scrollToSection('process')}>Jarayon</li>
                </ul>

                <div className={styles.authBtns}>
                    <Link to="/login" className={styles.loginBtn}>Kirish</Link>
                    <Link to="/register" className={`${styles.registerBtn} ${styles.dblock}`}>Ro'yxatdan o'tish</Link>
                </div>
            </nav>

            {/* HERO SECTION */}
            <header className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.badge}>Yangi avlod tibbiyot tizimi</div>
                    <h1 className={styles.gradientText}>Sog'lig'ingizni <br/> Raqamli Boshqaring</h1>
                    <p>Navbat kutishdan charchadingizmi? Shifokor bilan masofaviy aloqa va onlayn navbat tizimi orqali vaqtingizni tejang.</p>
                    <div className={styles.heroAction}>
                        <Link to="/register" className={styles.ctaBtn}>
                            Boshlash <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
                <div className={styles.heroVisual}>
                    <div className={styles.blob}></div>
                    <div className={styles.floatingCard}>
                        <Timer color="#2563eb" /> <span>10 daqiqalik navbat</span>
                    </div>
                    <div className={`${styles.floatingCard} ${styles.secondCard}`}>
                        <Activity color="#ef4444" /> <span>Real-vaqt monitoring</span>
                    </div>
                </div>
            </header>

            {/* WHY US SECTION */}
            <section id="about" className={styles.section}>
                <h2 className={styles.sectionTitle}>Nega aynan MedQueue?</h2>
                <div className={styles.grid}>
                    <div className={styles.card}>
                        <div className={styles.iconCircle}><ShieldCheck size={30} /></div>
                        <h3>Ishonchli Shifokorlar</h3>
                        <p>Barcha shifokorlarimiz malakasi admin tomonidan tasdiqlangan va tekshirilgan.</p>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.iconCircle}><MessageSquare size={30} /></div>
                        <h3>Onlayn Konsultatsiya</h3>
                        <p>Shifokor bilan chat orqali tahlil natijalarini yuborish va xabar almashish imkoniyati.</p>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.iconCircle}><Timer size={30} /></div>
                        <h3>Aniq Vaqt</h3>
                        <p>Aqlli algoritm orqali navbatingiz kelish vaqtini sekundigacha hisoblab beramiz.</p>
                    </div>
                </div>
            </section>

            {/* PROCESS SECTION */}
            <section id="process" className={styles.processWrapper}>
                <h2 className={styles.sectionTitle}>Xizmatdan foydalanish</h2>
                <div className={styles.stepsGrid}>
                    {[
                        {s: 1, t: "Ro'yxatdan o'ting", d: "Bir necha soniyada shaxsiy hisobingizni yarating."},
                        {s: 2, t: "Hududni tanlang", d: "O'zingizga yaqin shifoxonalar ro'yxatini ko'ring."},
                        {s: 3, t: "Shifokorni tanlang", d: "Bo'lim va shifokor haqida ma'lumotlarni o'rganing."},
                        {s: 4, t: "Navbat oling", d: "Vaqtingizni rejalashtiring va ko'rikka boring."},
                        {s: 5, t: "Navbatingiz jonli kuzating", d: "Navbatlarni real vaqtda kuzating."},
                        {s: 6, t: "Online konsultatsiya oling", d: "Uyigizdan chiqmagan holda online konsultatsiya yoki maslahat oling."}
                    ].map(item => (
                        <div key={item.s} className={styles.stepCard}>
                            <div className={styles.stepNum}>{item.s}</div>
                            <h4>{item.t}</h4>
                            <p>{item.d}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* FOOTER */}
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerBrand}>
                        <div className={styles.logo}>
                            <Stethoscope className={styles.logoIcon} />
                            <span>MedQueue</span>
                        </div><br />
                        <p>Sifatli tibbiy xizmat endi yanada yaqinroq.</p>
                    </div>
                    
                    <div className={styles.footerLinks}>
                        <h4>Bo'limlar</h4>
                        <ul>
                            <li onClick={() => scrollToSection('about')}>Afzalliklar</li>
                            <li onClick={() => scrollToSection('process')}>Jarayon</li>
                        </ul>
                    </div>

                    <div className={styles.footerContact}>
                        <h4>Bog'lanish</h4>
                        <p><Mail size={16} /> info@medqueue.uz</p>
                        <p><Phone size={16} /> +998 90 123 45 67</p>
                        <div className={styles.socials}>
                            <Send size={20} />
                            <Instagram size={20} />
                            <Facebook size={20} />
                        </div>
                    </div>
                </div>
                <div className={styles.footerBottom}>
                    <p>&copy; 2026 MedQueue. Barcha huquqlar himoyalangan.</p>
                </div>
            </footer>
        </div>
    );
};

export default Welcome;
