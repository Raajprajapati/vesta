import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";
// import data from './data.js';
import axios from 'axios';

const ChartComponent = () => {

    const [yaxisData, setyaxisData] = useState([]);
    const [totalRequests, setTotalRequests] = useState(0);
    const [seriesData, setSeriesData] = useState([]);


    const chartOptions = {
        chart: {
            id: "basic-bar",
            toolbar: {
                show: false
            }
        },
        xaxis: {
            categories: yaxisData,
        },
        yaxis: {
            min: 0,
            stepSize: 2
        },

        title: {
            text: 'Requests per Hotel',
            align: 'center',
            margin: 80,
            style: {
                fontSize: '20px',
                fontWeight: 'bold',
                fontFamily: 'Ubuntu',
                color: '#263238'
            },
        }
    }

    const series = [
        {
            name: "Requests",
            data: seriesData
        }
    ]

    const fetchData = async () => {
        const res = await axios.get('https://checkinn.co/api/v1/int/requests');
        const data = res.data;

        let objData = {};
        data.requests.forEach((item) => {

            if (objData[item.hotel.id]) {
                objData[item.hotel.id][1] += 1;
            } else {
                objData[item.hotel.id] = [item.hotel.name, 1];
            }
        })
        const chartData = Object.values(objData);

        setyaxisData(() => {
            return chartData.map((val) => {
                return val[0]
            })
        });

        setSeriesData(() => {
            return chartData.map((val) => {
                return val[1]
            })
        })

        setTotalRequests(data.requests.length);
    }

    useEffect(() => {
        fetchData();
    }, [])


    return (
        <div className='chart'>
            <div className="chart_wrapper">
                <Chart
                    options={chartOptions}
                    series={series}
                    type="line"
                    width="100%"

                />
            </div>
            <h2>Total requests: {totalRequests}</h2>
            <p>List of unique department names across all Hotels: Housekeeping, Front Desk, Maintenance, Concierge, Spa, Fitness, Catering, Security, Recreation, Room Service, Water Sports, Guest Services
                .</p>
        </div>
    )

}
export default ChartComponent;