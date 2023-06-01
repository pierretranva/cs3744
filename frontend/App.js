// Author: Pierre Tran
//Date: 4/17/2023
import React, { useEffect, useState } from 'react';
import ScatterPlot from "./ScatterPlot"
import PieChart from "./PieChart"
import Histogram from "./Histogram"
import DataGrid from "./DataGrid"
// import rawData from "./data.json"

import "./App.css"

let App = () => {


    let [data, setData] = useState([]);
    let [checked, setChecked] = useState([0]);

    let updateCheck = (arr) =>{
        setChecked(arr)

    }
    useEffect(() =>
    {
        fetch("http://localhost:3001/data")
        .then((res) => res.json())
        .then((res) => setData(res))
        .then(console.log(data))

    }, [])


    return (
        <>
            <div id="main">
                <div className='row'>
                    <div className='column'>
                        <ScatterPlot data={data} selected={checked} />
                        <div id="pieBar">   
                        <PieChart data={data}/>
                        <Histogram data={data}/>
                        </div>
                    </div>
                    <div className='column'>
                        <DataGrid data={data} callback= {(arr) => updateCheck(arr)}/>
                        
                    </div>
                </div>
            </div>
        </>

    );
}

export default App;