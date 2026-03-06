import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import styles from './FindDoctor.module.css';
import { Search, MapPin, Users, ArrowLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';

const FindDoctor = () => {
    const navigate = useNavigate();
    const [hospitals, setHospitals] = useState([]);
    const [regions, setRegions] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [search, setSearch] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedDept, setSelectedDept] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRegions();
        fetchHospitals();
    }, [selectedRegion, search]);

    useEffect(() => {
        if (selectedHospital) fetchDoctors();
    }, [selectedHospital, selectedDept, search]);

    const fetchRegions = async () => {
        try {
            const res = await api.get('regions/list/');
            setRegions(res.data.results || res.data);
        } catch (e) { console.error(e); }
    };

    const fetchHospitals = async () => {
        if (selectedHospital) return; // Shifokorlar ro'yxatida bo'lsak shifoxonani qidirmaymiz
        setLoading(true);
        try {
            const res = await api.get(`hospitals/list/?search=${search}&region=${selectedRegion}`);
            setHospitals(res.data.results || res.data);
        } catch (e) { toast.error("Xatolik!"); }
        setLoading(false);
    };

    const fetchDoctors = async () => {
        try {
            // MUHIM: Endi 'doctors/profile/' ishlatiladi
            const res = await api.get(`doctors/profile/?hospital=${selectedHospital.id}&department=${selectedDept}&search=${search}`);
            setDoctors(res.data.results || res.data);
        } catch (e) { console.error(e); }
    };

    return (
        <div className={styles.container}>
            <div style={{marginBottom: '20px'}}>
                {selectedHospital ? (
                    <button className={styles.backBtn} onClick={() => {setSelectedHospital(null); setSearch('');}}>
                        <ArrowLeft size={20} /> Shifoxonalarga qaytish
                    </button>
                ) : (
                    <h2 style={{color: '#1e293b'}}>Shifoxona tanlang</h2>
                )}
            </div>

            <div className={styles.filterBar}>
                <div className={styles.searchWrapper}>
                    <Search className={styles.searchIcon} size={20} />
                    <input 
                        className={styles.input}
                        placeholder={selectedHospital ? "Shifokor qidirish..." : "Shifoxona qidirish..."}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {!selectedHospital ? (
                    <select className={styles.input} style={{width: '200px'}} value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
                        <option value="">Barcha hududlar</option>
                        {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                ) : (
                    <select className={styles.input} style={{width: '200px'}} value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
                        <option value="">Barcha bo'limlar</option>
                        {selectedHospital.departments_detail?.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                )}
            </div>

            {selectedHospital ? (
                <div>
                    <h3 style={{marginBottom: '15px'}}>{selectedHospital.name} shifokorlari</h3>
                    {doctors.map(doc => (
                        <div key={doc.id} className={styles.doctorCard}>
                            <img src={doc.user_detail?.avatar || '/default.png'} className={styles.doctorAvatar} alt="doc" />
                            <div style={{flex: 1}}>
                                <h4 style={{margin: 0}}>{doc.user_detail?.full_name}</h4>
                                <p style={{color: '#10b981', fontWeight: 600, margin: '5px 0'}}>{doc.specialty}</p>
                                <div>
                                    <span className={`${styles.status} ${doc.is_aviable ? styles.online : styles.offline}`}></span>
                                    <span style={{fontSize: '13px', color: '#64748b'}}>{doc.is_aviable ? "Online" : "Offline"} • {doc.experience_years} yil tajriba</span>
                                </div>
                            </div>
                            <button className={styles.viewBtn} onClick={() => navigate(`/patient/doctor-detail/${doc.id}`)}>
                                Ko'rish
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.hospitalGrid}>
                    {hospitals.map(h => (
                        <div key={h.id} className={styles.card} onClick={() => setSelectedHospital(h)}>
                            <img src={h.image} className={styles.cardImage} alt={h.name} />
                            <div className={styles.cardContent}>
                                <h3 style={{margin: '0 0 10px 0'}}>{h.name}</h3>
                                <div style={{display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '13px'}}>
                                    <MapPin size={14} /> {h.address}
                                </div>
                                <div style={{marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <span style={{fontSize: '12px', color: '#10b981', fontWeight: 700}}>{h.region_name}</span>
                                    <ChevronRight size={18} color="#10b981" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FindDoctor;
