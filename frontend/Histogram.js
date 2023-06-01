// Author: Pierre Tran
//Date: 4/17/2023
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import "./Histogram.css"

let Histogram = (props) => {

    let ref = useRef(null)
    const [rect, setRect] = useState([30,50])
    const [mousePos, setMousePos] = useState([0, 0])

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
    let make = () => {
        let data = props.data


        let margin = 5

        let averages = getAverages(data)
        //creates svg
        let histContainer = d3.select("#histogram")
            .append("p").attr("id", "histTitle").append("b").text("Histogram")
            .append("svg")
            .attr("id", "histContainer")
            .attr("width", rect[0]-30)
            .attr("height", rect[1]-50)
            .style("background-color", "white")

        //gets pixel value of svg

        let pxX = rect[0]-30
        let pxY = rect[1]-50

        //create scales for x and y
        let scX = d3.scaleBand().domain(['javascript', 'python', 'java']).range([margin, pxX - margin]).padding(0.1);
        let scY = d3.scaleLinear().domain([0, averages[0].value]).range([margin, pxY - margin]).nice()


        let g = histContainer.append('g')

        //add bars to the svg
        let bars = g.selectAll("rect")
            .data(averages)
            .enter()
            .append("rect")
            .attr("x", d => scX(d.name))
            .attr("y", function (d) {
                return (pxY - margin - scY(d.value))
            })
            .attr("width", scX.bandwidth())
            .attr("height", function (d) { return scY(d.value); })
            .attr("stroke", "black")
            .attr('stroke-width', 3)
            .attr("fill", function getColor(data) {
                if (data.name == 'javascript') {
                    return "red";
                }
                else if (data.name == 'python') {
                    return "blue";
                }
                return "green";
            })
            .on("mouseover", function (e, d) {
                let x = mousePos.x + 10
                x = x.toString() + "px"
                let y = mousePos.y - 10
                y = y.toString() + "px"

                d3.select("#main")
                    .append("div").attr("id", "tooltip")
                    .append("p").attr("id", "line1")
                    .append("p").attr("id", "line2")
                    .append("p").attr("id", "line3")
                d3.select("#tooltip")
                    .style('top', y)
                    .style("left", x)
                    .style('visibility', 'visible')
                d3.select("#line1")
                    .text(d.value)
                d3.select("#line2")
                    .text("")
                d3.select("#line3")
                    .text("")
                    

            })
            .on('mouseout', d => {
                d3.select("#tooltip").remove()

            })

    }
    // useEffect(() => {
    //     d3.select("#histContainer").remove()
    //     d3.select("#histTitle").remove()
    //     make()
    //     // console.log(rect)
    // })
    // useEffect(() => {
    //     d3.select("#histContainer").remove()
    //     d3.select("#histTitle").remove()
    //     make()
    //     const observer = new ResizeObserver(entries => {
    //         if (entries[0].contentRect.width != rect[0] || entries[0].contentRect.height != rect[1]) {
    //             setRect([entries[0].contentRect.width, entries[0].contentRect.height])
    //         }
    //     })

    //     observer.observe(ref.current)
    //     return () => ref.current && observer.unobserve(ref.current)

    // })

    // useEffect(() => {

    //     const handleMouseMove = (event) => {
    //         setMousePos({ x: event.clientX, y: event.clientY });
    //     };

    //     window.addEventListener('mousemove', handleMouseMove);

    //     return () => {
    //         window.removeEventListener(
    //             'mousemove',
    //             handleMouseMove
    //         );
    //     };
    // }, []);
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
            d3.select("#histContainer").remove()
            d3.select("#tooltip").remove()
            d3.select("#histTitle").remove()
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
            <div ref={ref} id="histogram"></div>
        </>
    );

}
export default Histogram;