import { useEffect, useState } from 'react';

const useQueueSocket = (doctorId) => {
    const [queue, setQueue] = useState({
        current_patient: null,
        waiting_count: 0,
        total_today: 0,
        estimated_wait: 0,
        waiting_list: []
    });

    useEffect(() => {
        if (!doctorId) return; // doctorId bo'lmasa ulanmang
        const ws = new WebSocket(`ws://${window.location.hostname}:8000/ws/queue/${doctorId}/`);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setQueue({
                current_patient: data.current_patient,
                waiting_count: data.waiting_count,
                total_today: data.total_today,
                estimated_wait: data.estimated_wait,
                waiting_list: data.waiting_list || []
            });
        };

        ws.onclose = () => console.log("WebSocket uzildi");

        return () => ws.close();
    }, [doctorId]);

    return queue;
};

export default useQueueSocket;