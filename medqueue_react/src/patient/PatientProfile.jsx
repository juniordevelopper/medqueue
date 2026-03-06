import React, { useState, useEffect } from 'react';
import api from '../api/axios'; // Siz ko'rsatgan yo'l
import styles from './PatientProfile.module.css';
import { toast } from 'react-toastify';
import { 
    User, Mail, Phone, Calendar, 
    Droplets, Camera, Save, Edit3, 
    X, Info, Users, ShieldCheck 
} from 'lucide-react';

const PatientProfile = () => {
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [profile, setProfile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({});

    // 1. Ma'lumotlarni olish
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('auth/user/me/');
            setProfile(res.data);
            setFormData(res.data);
            setLoading(false);
        } catch (err) {
            toast.error("Profil ma'lumotlarini yuklab bo'lmadi");
            setLoading(false);
        }
    };

    // 2. Inputlarni o'zgartirish
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 3. Rasm tanlash (Preview)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, avatar_file: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    // 4. Ma'lumotlarni saqlash (PATCH)
    const handleSave = async () => {
        const data = new FormData();
        // Serializerda e'lon qilingan maydonlar
        data.append('full_name', formData.full_name || '');
        data.append('phone', formData.phone || '');
        data.append('bio', formData.bio || '');
        data.append('gender', formData.gender || '');
        data.append('blood_group', formData.blood_group || '');
        data.append('birth_date', formData.birth_date || '');

        if (formData.avatar_file instanceof File) {
            data.append('avatar', formData.avatar_file);
        }

        try {
            // Backend endpointimiz: auth/user/me/
            const res = await api.patch('auth/user/me/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProfile(res.data);
            setEditMode(false);
            setPreview(null);
            toast.success("Ma'lumotlar saqlandi! ✨");
        } catch (err) {
            toast.error("Xatolik: Ma'lumotlarni saqlashda muammo yuz berdi");
        }
    };

    if (loading || !profile) return <div className={styles.profileContainer}>Yuklanmoqda...</div>;

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileCard}>
                <div className={styles.header}>
                    <h2 style={{margin: 0, display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <ShieldCheck color="#10b981" size={28} /> Shaxsiy Profil
                    </h2>
                    <div style={{display: 'flex', gap: '12px'}}>
                        {!editMode ? (
                            <button className={`${styles.btn} ${styles.btnEdit}`} onClick={() => setEditMode(true)}>
                                <Edit3 size={18}/> Tahrirlash
                            </button>
                        ) : (
                            <>
                                <button className={`${styles.btn} ${styles.btnCancel}`} onClick={() => {setEditMode(false); setPreview(null); setFormData(profile);}}>
                                    <X size={18}/> Bekor qilish
                                </button>
                                <button className={`${styles.btn} ${styles.btnSave}`} onClick={handleSave}>
                                    <Save size={18}/> Saqlash
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className={styles.avatarSection}>
                    <div className={styles.avatarWrapper}>
                        {preview || profile.avatar ? (
                            <img src={preview || profile.avatar} className={styles.avatarImage} alt="Avatar" />
                        ) : (
                            <User size={80} color="#cbd5e0" />
                        )}
                        {editMode && (
                            <label className={styles.cameraOverlay}>
                                <Camera size={32} />
                                <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                            </label>
                        )}
                    </div>
                </div>

                <div className={styles.grid}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}><User size={14}/> To'liq ism-familiya</label>
                        <input className={styles.input} name="full_name" value={formData.full_name || ''} onChange={handleChange} disabled={!editMode} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}><Mail size={14}/> Email (Login)</label>
                        <input className={styles.input} value={profile.email} disabled />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}><Phone size={14}/> Telefon raqami</label>
                        <input className={styles.input} name="phone" value={formData.phone || ''} onChange={handleChange} disabled={!editMode} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}><Calendar size={14}/> Tug'ilgan sana</label>
                        <input className={styles.input} type="date" name="birth_date" value={formData.birth_date || ''} onChange={handleChange} disabled={!editMode} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}><Users size={14}/> Jins</label>
                        <select className={styles.input} name="gender" value={formData.gender || ''} onChange={handleChange} disabled={!editMode}>
                            <option value="">Tanlang</option>
                            <option value="M">Erkak</option>
                            <option value="F">Ayol</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}><Droplets size={14}/> Qon guruhi</label>
                        <select className={styles.input} name="blood_group" value={formData.blood_group || ''} onChange={handleChange} disabled={!editMode}>
                            <option value="">Tanlang</option>
                            <option value="1+">I (Rh+)</option><option value="1-">I (Rh-)</option>
                            <option value="2+">II (Rh+)</option><option value="2-">II (Rh-)</option>
                            <option value="3+">III (Rh+)</option><option value="3-">III (Rh-)</option>
                            <option value="4+">IV (Rh+)</option><option value="4-">IV (Rh-)</option>
                        </select>
                    </div>

                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                        <label className={styles.label}><Info size={14}/> Men haqimda (Biografiya)</label>
                        <textarea 
                            className={styles.input} 
                            style={{minHeight: '100px', resize: 'none'}} 
                            name="bio" 
                            value={formData.bio || ''} 
                            onChange={handleChange} 
                            disabled={!editMode} 
                            placeholder="Sog'lig'ingiz yoki o'zingiz haqingizda qo'shimcha ma'lumot..."
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>A'zo bo'lgan vaqt</label>
                        <input className={styles.input} value={new Date(profile.created_at).toLocaleDateString()} disabled />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientProfile;
