import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useQueueSocket from '../hooks/useQueueSocket';
import api from '../api/axios';
import styles from './DoctorDetail.module.css';
import { toast } from 'react-toastify';
import { ChevronLeft, Trash2, Users, Clock, PlayCircle, Navigation, Building2, DoorOpen } from 'lucide-react';

const DoctorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [myApp, setMyApp] = useState(null);
    const [loading, setLoading] = useState(true);

    const queue = useQueueSocket(id); // har doim ulanadi

    useEffect(() => {
        const loadData = async () => {
            try {
                const [docRes, appRes] = await Promise.all([
                    api.get(`doctors/profile/${id}/`),
                    api.get('appointments/my-list/')
                ]);
                setDoctor(docRes.data);
                const active = appRes.data.find(a => a.doctor === parseInt(id) && a.status === 'waiting');
                setMyApp(active);
            } catch (err) {
                console.error("Xatolik:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleBooking = async () => {
        try {
            const res = await api.post('appointments/book/', { doctor: id });
            setMyApp(res.data);
            toast.success("Navbatga yozildingiz!");
        } catch (err) {
            toast.error(err.response?.data?.non_field_errors?.[0] || "Xato yuz berdi");
        }
    };

    const handleCancel = async () => {
        if (window.confirm("Navbatni bekor qilishni tasdiqlaysizmi?")) {
            try {
                await api.patch(`appointments/cancel/${myApp.id}/`);
                setMyApp(null);
                toast.info("Navbat bekor qilindi");
            } catch (err) {
                toast.error("Bekor qilishda xatolik");
            }
        }
    };

    if (loading) return <div className={styles.loading}>Yuklanmoqda...</div>;
    if (!doctor) return <div className={styles.loading}>Shifokor topilmadi.</div>;

    return (
        <div className={styles.container}>
            <div className={myApp ? styles.mainGrid : styles.centeredGrid}>
                {/* SHIFOKOR MA'LUMOTLARI */}
                <div className={styles.profileCard}>
                    <button onClick={() => navigate(-1)} className={styles.backBtn}>
                        <ChevronLeft size={20}/> Orqaga
                    </button>
                    <div className={styles.avatarWrapper}>
                        <img src={doctor.user_detail?.avatar || '/default.png'} className={styles.avatar} alt="Doctor" />
                    </div>
                    <h1 className={styles.docName}>{doctor.user_detail?.full_name}</h1>
                    <p className={styles.specialty}>{doctor.specialty}</p>
                    <div className={styles.routeCard}>
                        <div className={styles.routeTitle}><Navigation size={14} /> Manzil va Yo'nalish</div>
                        <div className={styles.routeDetail}>
                            <div className={styles.locationStep}>
                                <Building2 size={18} /> <span><strong>Shifoxona:</strong> {doctor.hospital_name}</span>
                            </div>
                            <div className={styles.locationStep}>
                                <DoorOpen size={18} /> <span><strong>Xona:</strong> {doctor.department_name}, {doctor.room_number}-xona</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4>Biografiya</h4>
                        <p>{doctor.user_detail?.bio || "Ma'lumot yo'q."}</p>
                    </div>

                    {!myApp && (
                        <button onClick={handleBooking} disabled={!doctor.is_aviable}>
                            {doctor.is_aviable ? "Navbatga yozilish" : "Qabul yopiq"}
                        </button>
                    )}
                </div>

                {/* JONLI NAVBAT */}
                {queue && (
                    <div className={styles.queueCard}>
                        <h3><Users /> Jonli Navbat</h3>
                        <div>HOZIR QABULDA: {queue.current_patient || "Hech kim yo'q"}</div>
                        <div>KUTILMOQDA: {queue.waiting_count} kishi</div>
                        <div>Taxminiy kutish: {queue.estimated_wait} daqiqa</div>
                        <div className={styles.scrollArea}>
                            {queue.waiting_list?.map((p, idx) => (
                                <div key={idx}>
                                    #{p.queue_number} - {p.full_name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDetail;