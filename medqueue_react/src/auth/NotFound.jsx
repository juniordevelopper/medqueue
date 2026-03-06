import React from 'react';
import { Link } from 'react-router-dom';
import { Ghost, Home, ArrowLeft, Search } from 'lucide-react';
import styles from './NotFound.module.css';

const NotFound = () => {
    return (
        <div className={styles.container}>
            <div className={styles.visualArea}>
                {/* Suzib yuruvchi ruh/astronavt belgisi */}
                <div className={styles.floatingGhost}>
                    <Ghost size={120} strokeWidth={1.5} color="#2563eb" />
                </div>
                
                {/* Atrofdagi mayda elementlar (adashgan piksellar) */}
                <div className={`${styles.dot} ${styles.dot1}`}></div>
                <div className={`${styles.dot} ${styles.dot2}`}></div>
                <div className={`${styles.dot} ${styles.dot3}`}></div>
                <div className={styles.searchIcon}>
                    <Search size={40} color="#94a3b8" />
                </div>
            </div>

            <div className={styles.textContent}>
                <h1 className={styles.errorCode}>404</h1>
                <h2 className={styles.title}>Sahifa topilmadi!</h2>
                <p className={styles.message}>
                    Afsuski, siz qidirayotgan sahifa koinot qa'rida g'oyib bo'lgan yoki 
                    manzil noto'g'ri kiritilgan.
                </p>

                <div className={styles.actions}>
                    <button onClick={() => window.history.back()} className={styles.backBtn}>
                        <ArrowLeft size={20} /> ORQAGA QAYTISH
                    </button>
                    <Link to="/" className={styles.homeBtn}>
                        <Home size={20} /> ASOSIY SAHIFA
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
