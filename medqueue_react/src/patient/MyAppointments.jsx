import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import styles from './MyAppointments.module.css';
import { toast } from 'react-toastify';
import { Calendar, User, Clock, Trash2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await api.get('appointments/my-list/');
            setAppointments(res.data);
        } catch (err) {
            toast.error("Navbatlarni yuklashda xatolik");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm("Navbatni bekor qilishni xohlaysizmi?")) {
            try {
                await api.patch(`appointments/cancel/${id}/`);
                toast.success("Navbat bekor qilindi");
                fetchAppointments(); // Ro'yxatni yangilash
            } catch (err) {
                toast.error("Bekor qilishda xato yuz berdi");
            }
        }
    };

    if (loading) return <div className={styles.container}>Yuklanmoqda...</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Mening navbatlarim</h1>

            <div className={styles.list}>
                {appointments.length > 0 ? appointments.map((app) => (
                    <div key={app.id} className={styles.appointmentCard}>
                        <div className={styles.doctorInfo}>
                            <User className={styles.avatar} size={40} color="#cbd5e0" />
                            <div className={styles.meta}>
                                <h4>{app.doctor_name}</h4>
                                <p>{app.doctor_specialty || "Shifokor"}</p>
                                <div style={{display:'flex', gap:'10px', marginTop:'5px', color:'#94a3b8', fontSize:'12px'}}>
                                    <span><Calendar size={12}/> {new Date(app.created_at).toLocaleDateString()}</span>
                                    <span><Clock size={12}/> {new Date(app.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.queueInfo}>
                            <small style={{color:'#94a3b8', fontWeight:700}}>NAVBT</small>
                            <h2>#{app.queue_number}</h2>
                        </div>

                        <div>
                            <span className={`${styles.statusBadge} ${styles[app.status]}`}>
                                {app.status === 'waiting' ? 'Kutilmoqda' : 
                                 app.status === 'completed' ? 'Tugallangan' : 'Bekor qilingan'}
                            </span>
                        </div>

                        <div style={{display:'flex', gap:'10px'}}>
                            {app.status === 'waiting' && (
                                <button className={styles.cancelBtn} onClick={() => handleCancel(app.id)}>
                                    <Trash2 size={16}/>
                                </button>
                            )}
                            <button 
                                onClick={() => navigate(`/patient/doctor-detail/${app.doctor}`)}
                                style={{background:'none', border:'none', color:'#94a3b8', cursor:'pointer'}}
                            >
                                <ChevronRight />
                            </button>
                        </div>
                    </div>
                )) : (
                    <div style={{textAlign:'center', padding:'50px', background:'#fff', borderRadius:'20px'}}>
                        <Calendar size={50} color="#e2e8f0" style={{marginBottom:'15px'}}/>
                        <p style={{color:'#94a3b8'}}>Sizda hali hech qanday navbat yo'q.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyAppointments;
