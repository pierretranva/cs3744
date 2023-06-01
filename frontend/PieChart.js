// Author: Pierre Tran
//Date: 4/17/2023
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import "./PieChart.css"

const PieChart = (props) => {
    let data = props.data
    const ref = useRef(null)
    const [rect, setRect] = useState([30,50])
    const [mousePos, setMousePos] = useState({})

    function getAverages(data) {
        let averages = [
            { name: "python", value: 0 },
            { name: "java", value: 0 },
            { name: "javascript", value: 0 }
        ]
        function average(arr) {
    
            let sum = arr.reduce((partialSum, a) => partialSum + a, 0);
            return sum / arr.length
        }
        averages[0].value = Math.round(average(data.map(function (child) {
            return +child.python;
        })))
        averages[1].value = Math.round(average(data.map(function (child) {
            return +child.java;
        })))
        averages[2].value = Math.round(average(data.map(function (child) {
            return +child.javascript;
        })))
        return averages;
    }
    let make = () =>
    {
        let margin = 5


    let averages = getAverages(data)


    let pieContainer = d3.select("#pieChart")
        .append("p").attr("id", "pieTitle").append("b").text("Pie Chart")
        .append('svg')
        .attr('width', rect[0])
        .attr('height', rect[1]-50)
        .attr('id', 'pieContainer')
        .style('background', 'white')

    //gets x and y pixel of svg
    let pxX = rect[0]
    let pxY = rect[1]-50
    //finds smallest px value
    let pxSmall = pxY
    if (pxX < pxY) {
        pxSmall = pxX
    }

    let pie = d3.pie().value(d => d.value).padAngle(0.1)(averages)


    let arcMkr = d3.arc().innerRadius(pxSmall / 6).outerRadius((pxSmall / 2) - margin)
        .cornerRadius(2)

    let scC = d3.scaleOrdinal(['blue', 'green', 'red'])
        .domain(pie.map(d => d.index))


    let g = pieContainer
        .append("g").attr("transform", `translate(${pxX / 2}, ${pxY / 2 + margin})`)

    g.selectAll("path").data(pie).enter().append("path")
        .attr("d", arcMkr)
        .attr("fill", d => scC(d.index))
        .attr("stroke", "black")
        .attr('stroke-width', 3)
        .on("mouseover", function (e, d) {
            let x = mousePos.x + 10
            x = x.toString() + "px"
            let y = mousePos.y - 10
            y = y.toString() + "px"

            d3.select("#main")
                .append("div").attr("id", "tooltip")
                .append("p").attr("id", "line1")
            d3.select("#tooltip")
                .append("p").attr("id", "line2")
            d3.select("#tooltip")
                .append("p").attr("id", "line3")
            d3.select("#tooltip")
                .style('top', y)
                .style("left", x)
                .style('visibility', 'visible')
            d3.select("#line1")
                .text(d.data.name)
            d3.select("#line2")
                .text(d.value)
            d3.select("#line3")
                .text("")
                

        })
        .on('mouseout', d => {
            d3.select("#tooltip").remove()

        })

    }
useEffect(()=>{
    

        const observer = new ResizeObserver(entries => {
            if(entries[0].contentRect.width != rect[0] || entries[0].contentRect.height != rect[1] ){
          setRect([entries[0].contentRect.width, entries[0].contentRect.height])
            }
        })
        const handleMouseMove = (event) => {
            setMousePos({ x: event.clientX, y: event.clientY });
          };
        
          window.addEventListener('mousemove', handleMouseMove);
        observer.observe(ref.current)
        
        // return () => ref.current && observer.unobserve(ref.current)
          return () => {
            d3.select("#pieContainer").remove()
            d3.select("#tooltip").remove()
            d3.select("#pieTitle").remove()
            make()
            ref.current && observer.unobserve(ref.current)
              window.removeEventListener(
                'mousemove',
                handleMouseMove
              );
            };
        })
    
    
    return (
        <>
        <div ref={ref} id="pieChart"></div>
</>
    );
}

export default PieChart;