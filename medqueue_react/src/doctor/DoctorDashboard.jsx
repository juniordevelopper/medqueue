import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import useQueueSocket from '../hooks/useQueueSocket';
import { toast } from 'react-toastify';
import { Play, CheckCircle, XCircle, Users, Clock } from 'lucide-react';
import styles from './DoctorDashboard.module.css';

const DoctorDashboard = () => {
    const [doctorId, setDoctorId] = useState(null);
    const queue = useQueueSocket(doctorId);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await api.get('doctors/profile/');
                if(res.data?.id) setDoctorId(res.data.id);
            } catch(err) {
                console.error(err);
            }
        };
        fetchDoctor();
    }, []);

    const handleAction = async (appId, action) => {
        try {
            await api.post(`appointments/doctor-action/${appId}/${action}/`);
            toast.success("Amal bajarildi");
        } catch(err){
            toast.error("Xatolik yuz berdi");
        }
    };

    const currentPatient = queue.waiting_list?.find(a => a.status === 'in_progress');
    const nextPatient = queue.waiting_list?.find(a => a.status === 'waiting');

    return (
        <div className={styles.container}>
            <div>
                <h2>Hozir qabulda: {currentPatient?.full_name || "Bo'sh"}</h2>
                {currentPatient && <p>Navbat raqami: #{currentPatient.queue_number}</p>}
                {currentPatient && <button onClick={() => handleAction(currentPatient.id, 'complete')}>Qabulni yakunlash</button>}
                {nextPatient && <button onClick={() => handleAction(nextPatient.id, 'start')}>Keyingi bemorni chaqirish</button>}
            </div>

            <div>
                <h3>Navbatdagilar</h3>
                {queue.waiting_list?.map(p => (
                    <div key={p.queue_number}>#{p.queue_number} - {p.full_name}</div>
                ))}
                <p>Jami bemorlar: {queue.total_today}</p>
                <p>Kutilmoqda: {queue.waiting_count}</p>
                <p>Taxminiy kutish: {queue.estimated_wait} min</p>
            </div>
        </div>
    );
};

export default DoctorDashboard;