import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    Home, 
    Search, 
    CalendarCheck, 
    MessageCircle, 
    Bell, 
    User, 
    LogOut, 
    ChevronDown,
    History
} from 'lucide-react';
import api from '../api/axios';
import styles from './PatientLayout.module.css';

const PatientLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showNotif, setShowNotif] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [userData, setUserData] = useState({ full_name: 'Bemor', avatar: null });

    // Foydalanuvchi ma'lumotlarini yuklash (ixtiyoriy)
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await api.get('auth/user/me/'); // O'z endpointingizga moslang
                setUserData(res.data);
            } catch (err) {
                console.log("User yuklanmadi");
            }
        };
        getUser();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    // Aktiv linkni aniqlash
    const isActive = (path) => location.pathname === path ? styles.navLinkActive : '';

    return (
        <div className={styles.layoutContainer}>
            {/* CHAP TOMONDAGI SIDEBAR */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logoBox}>MQ</div>
                    <h2 className={styles.brandName}>MedQueue</h2>
                </div>
                
                <nav className={styles.navigation}>
                    <Link to="/patient" className={`${styles.navLink} ${isActive('/patient')}`}>
                        <Home size={20} />
                        <span>Asosiy sahifa</span>
                    </Link>
                    <Link to="/patient/find-doctor" className={`${styles.navLink} ${isActive('/patient/find-doctor')}`}>
                        <Search size={20} />
                        <span>Shifokor qidirish</span>
                    </Link>
                    <Link to="/patient/my-appointments" className={`${styles.navLink} ${isActive('/patient/my-appointments')}`}>
                        <CalendarCheck size={20} />
                        <span>Mening navbatlarim</span>
                    </Link>
                    <Link to="/patient/medical-history" className={`${styles.navLink} ${isActive('/patient/medical-history')}`}>
                        <History size={20} />
                        <span>Tibbiy tarix</span>
                    </Link>
                    <Link to="/patient/chat" className={`${styles.navLink} ${isActive('/patient/chat')}`}>
                        <MessageCircle size={20} />
                        <span>Xabarlar</span>
                    </Link>
                </nav>
            </aside>

            {/* O'NG TOMONDAGI ASOSIY QISM */}
            <main className={styles.mainWrapper}>
                <header className={styles.topNavbar}>
                    <div className={styles.pageTitle}>
                        <h4>Xush kelibsiz, {userData.full_name?.split(' ')[0]}!</h4>
                    </div>

                    <div className={styles.navbarActions}>
                        {/* Bildirishnomalar */}
                        <div style={{position: 'relative'}}>
                            <button 
                                className={styles.iconBtn} 
                                onClick={() => {setShowNotif(!showNotif); setShowProfile(false)}}
                            >
                                <Bell size={22} />
                                <span className={styles.notifBadge}>2</span>
                            </button>
                            
                            {showNotif && (
                                <div className={styles.dropdownMenu}>
                                    <div className={styles.dropdownHeader}>Yangi bildirishnomalar</div>
                                    <div className={styles.dropdownContent}>
                                        <p style={{fontSize: '13px', padding: '10px'}}>Navbatingizga 15 daqiqa qoldi</p>
                                        <p style={{fontSize: '13px', padding: '10px', borderTop: '1px solid #eee'}}>Doktor xabar yubordi</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profil qismi */}
                        <div style={{position: 'relative'}}>
                            <button 
                                className={styles.profileTrigger}
                                onClick={() => {setShowProfile(!showProfile); setShowNotif(false)}}
                            >
                                <div className={styles.avatarCircle}>
                                    {userData.avatar ? (
                                        <img src={userData.avatar} alt="P" style={{width: '100%', borderRadius: '50%'}} />
                                    ) : (
                                        userData.full_name?.charAt(0) || 'P'
                                    )}
                                </div>
                                <div className={styles.doctorMeta}>
                                    <span className={styles.doctorName}>{userData.full_name}</span>
                                    <span className={styles.doctorSpecialty}>Bemor</span>
                                </div>
                                <ChevronDown size={16} style={{transition: '0.3s', transform: showProfile ? 'rotate(180deg)' : ''}} />
                            </button>

                            {showProfile && (
                                <div className={styles.dropdownMenu}>
                                    <Link to="/patient/patient-profile" className={styles.dropdownLink} onClick={() => setShowProfile(false)}>
                                        <User size={16} /> Profilim
                                    </Link>
                                    <hr style={{margin: '8px 0', opacity: 0.1}} />
                                    <button onClick={handleLogout} className={styles.logoutBtn} style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '10px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                        <LogOut size={16} /> Chiqish
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <section className={styles.pageBody}>
                    <Outlet />
                </section>
            </main>
        </div>
    );
};

export default PatientLayout;
