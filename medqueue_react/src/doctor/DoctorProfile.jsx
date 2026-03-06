import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import styles from './DoctorProfile.module.css';
import { toast } from 'react-toastify';
import { 
    User, Mail, Phone, Award, Clock, MapPin, 
    Camera, Save, Edit3, X, Briefcase, Activity, Calendar, ShieldCheck
} from 'lucide-react';

const DoctorProfile = () => {
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [profile, setProfile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('doctors/profile/');
                const data = Array.isArray(res.data) ? res.data[0] : res.data;
                setProfile(data);
                setFormData(data);
                setLoading(false);
            } catch (err) {
                toast.error("Ma'lumotlarni yuklab bo'lmadi");
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, avatar_file: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        const data = new FormData();
        data.append('full_name', formData.user_detail?.full_name || '');
        data.append('bio', formData.user_detail?.bio || '');
        data.append('experience_years', formData.experience_years);
        data.append('is_aviable', formData.is_aviable);

        if (formData.avatar_file) {
            data.append('avatar', formData.avatar_file);
        }

        try {
            const res = await api.patch(`doctors/profile/${profile.id}/`, data);
            setProfile(res.data);
            setEditMode(false);
            setPreview(null);
            toast.success("Profil muvaffaqiyatli saqlandi!");
        } catch (err) {
            toast.error("Saqlashda xatolik yuz berdi");
        }
    };

    if (loading || !profile) return <div className={styles.profileContainer}><h2>Yuklanmoqda...</h2></div>;

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileCard}>
                <div className={styles.header}>
                    <h1 className={styles.title}><Activity color="#6366f1"/> Shifokor Shaxsiy Kabineti</h1>
                    <div style={{display: 'flex', gap: '10px'}}>
                        {editMode ? (
                            <>
                                <button className={`${styles.btn} ${styles.btnCancel}`} onClick={() => {setEditMode(false); setPreview(null); setFormData(profile);}}><X size={18}/> Bekor qilish</button>
                                <button className={`${styles.btn} ${styles.btnSave}`} onClick={handleSave}><Save size={18}/> Saqlash</button>
                            </>
                        ) : (
                            <button className={`${styles.btn} ${styles.btnEdit}`} onClick={() => setEditMode(true)}><Edit3 size={18}/> Tahrirlash</button>
                        )}
                    </div>
                </div>

                <div className={styles.avatarSection}>
                    <div className={styles.avatarWrapper}>
                        {preview || profile?.user_detail?.avatar ? (
                            <img src={preview || profile?.user_detail?.avatar} className={styles.avatarImage} alt="Profile" />
                        ) : (
                            <User size={70} color="#cbd5e0" />
                        )}
                        {editMode && (
                            <label className={styles.cameraOverlay}>
                                <Camera size={30} />
                                <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                            </label>
                        )}
                    </div>
                </div>

                <div className={styles.grid}>
                    {/* TAHRIRLANADIGAN MAYDONLAR */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}><User size={14}/> To'liq ism</label>
                        <input className={styles.input} name="user_detail.full_name" value={formData?.user_detail?.full_name || ''} onChange={handleInputChange} disabled={!editMode} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}><Briefcase size={14}/> Ish tajribasi (yil)</label>
                        <input className={styles.input} type="number" name="experience_years" value={formData?.experience_years || 0} onChange={handleInputChange} disabled={!editMode} min={0}/>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}><Activity size={14}/> Qabul holati</label>
                        <select className={styles.input} name="is_aviable" value={formData?.is_aviable} onChange={(e) => setFormData({...formData, is_aviable: e.target.value === 'true'})} disabled={!editMode}>
                            <option value={true}>Qabulga tayyor (Online)</option>
                            <option value={false}>Hozir band (Offline)</option>
                        </select>
                    </div>

                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                        <label className={styles.label}>Biografiya</label>
                        <textarea className={styles.input} style={{minHeight: '80px'}} name="user_detail.bio" value={formData?.user_detail?.bio || ''} onChange={handleInputChange} disabled={!editMode} placeholder="Ma'lumot yozilmagan..." />
                    </div>

                    {/* FAQAT KO'RISH UCHUN (TIZIM MA'LUMOTLARI) */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}><Mail size={14}/> Email (Login)</label>
                        <input className={styles.input} value={profile?.email || 'Noma\'lum'} disabled />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}><Award size={14}/> Mutaxassislik</label>
                        <input className={styles.input} value={profile?.specialty || ''} disabled />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}><Clock size={14}/> Ish vaqti</label>
                        <input className={styles.input} value={profile?.work_hours || ''} disabled />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}><MapPin size={14}/> Shifoxona</label>
                        <input className={styles.input} value={profile?.hospital_name || ''} disabled />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}><MapPin size={14}/> Bo'lim / Xona</label>
                        <input className={styles.input} value={`${profile?.department_name} / ${profile?.room_number}-xona`} disabled />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;
