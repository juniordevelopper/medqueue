import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    ClipboardList, 
    MessageSquare, 
    Bell, 
    User, 
    LogOut, 
    ChevronDown 
} from 'lucide-react';
import styles from './DoctorLayout.module.css';

const DoctorLayout = () => {
    const navigate = useNavigate();
    const [showNotif, setShowNotif] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    // Tizimdan chiqish funksiyasi
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className={styles.layoutContainer}>
            {/* CHAP TOMONDAGI SIDEBAR */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logoBox}>MQ</div>
                    <h2 className={styles.brandName}>MedQueue</h2>
                </div>
                
                <hr className={styles.sidebarHr} />

                <nav className={styles.navigation}>
                    <Link to="/doctor" className={styles.navLink}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/doctor/appointments" className={styles.navLink}>
                        <ClipboardList size={20} />
                        <span>Navbatlar</span>
                    </Link>
                    <Link to="/doctor/chat" className={styles.navLink}>
                        <MessageSquare size={20} />
                        <span>Chat xabarlari</span>
                    </Link>
                </nav>
            </aside>

            {/* O'NG TOMONDAGI ASOSIY QISM */}
            <main className={styles.mainWrapper}>
                {/* YUQORI NAVBAR */}
                <header className={styles.topNavbar}>
                    <div className={styles.pageTitle}>
                        <h4>Shifokor boshqaruv paneli</h4>
                    </div>

                    <div className={styles.navbarActions}>
                        {/* Bildirishnomalar */}
                        <div className={styles.actionItem}>
                            <button 
                                className={styles.iconBtn} 
                                onClick={() => {setShowNotif(!showNotif); setShowProfile(false)}}
                            >
                                <Bell size={22} />
                                <span className={styles.notifBadge}>3</span>
                            </button>
                            
                            {showNotif && (
                                <div className={styles.dropdownMenu}>
                                    <div className={styles.dropdownHeader}>Bildirishnomalar</div>
                                    <div className={styles.dropdownContent}>
                                        <p>Yangi navbat: Sanjar Ali</p>
                                        <p>Tizim yangilandi</p>
                                        <p>Chat: 2 ta yangi xabar</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profil qismi */}
                        <div className={styles.actionItem}>
                            <button 
                                className={styles.profileTrigger}
                                onClick={() => {setShowProfile(!showProfile); setShowNotif(false)}}
                            >
                                <div className={styles.avatarCircle}>DR</div>
                                <div className={styles.doctorMeta}>
                                    <span className={styles.doctorName}>Dr. Alisher</span>
                                    <span className={styles.doctorSpecialty}>Kardiolog</span>
                                </div>
                                <ChevronDown size={16} className={showProfile ? styles.rotateIcon : ''} />
                            </button>

                            {showProfile && (
                                <div className={styles.dropdownMenu}>
                                    <Link to="/doctor/doctor-profile" className={styles.dropdownLink}>
                                        <User size={16} /> Profil sozlamalari
                                    </Link>
                                    <hr className={styles.menuHr} />
                                    <button onClick={handleLogout} className={styles.logoutBtn}>
                                        <LogOut size={16} /> Chiqish
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* SAHIFA MAZMUNI (OUTLET) */}
                <section className={styles.pageBody}>
                    <Outlet />
                </section>
            </main>
        </div>
    );
};

export default DoctorLayout;
