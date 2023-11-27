import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function LineChart({ dataChart }) {
    const labels = Object.keys(dataChart);
    const values = Object.values(dataChart);
    const originalData = {
        labels: labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'New subscriptions',
                data: values || [0, 0, 0, 0, 0, 0, 0],
                fill: false,
                backgroundColor: 'transparent',
                borderColor: '#323232',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0,
            },
        ],
    };

    // Cắt dữ liệu để chỉ hiển thị số phần tử cuối cùng
    const data = {
        labels: originalData.labels,
        datasets: originalData.datasets.map((dataset) => ({
            ...dataset,
            data: dataset.data,
        })),
    };

    const options = {
        scales: {
            y: {
                display: false, // Ẩn trục y
            },
            x: {
                display: false, // Ẩn trục x
            },
        },
        plugins: {
            legend: {
                display: false, // Ẩn legend
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    const chartContainerStyle = '2xl:w-36 w-28';

    return (
        <div className={`h-20 2xl:h-28 ${chartContainerStyle} filter-line-chart`}>
            <Line data={data} options={options} />
        </div>
    );
}
