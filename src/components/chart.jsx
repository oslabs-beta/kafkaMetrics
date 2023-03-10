import React from 'react';
import { Line } from 'react-chartjs-2';

function LineChart (props) {
    return (
        <div>
            <div>{props.name}</div>
            <Line data = {props.data} />
        </div>
    )
}

export default LineChart;