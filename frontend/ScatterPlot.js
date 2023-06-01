// Author: Pierre Tran
//Date: 4/17/2023
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./ScatterPlot.css";


let ScatterPlot = (props) => {
    const ref = useRef(null);
    const [rect, setRect] = useState([30, 50]);
    const [mousePos, setMousePos] = useState({});

    function make() {
        let data = props.data;
        let highlight = props.selected;
        for (let i = 0; i < data.length; i++) {
            if (highlight.includes(i)) {
                data[i].selected = true;
            } else {
                data[i].selected = false;
            }
        }

        let margin = 30;
        let scatterContainer = d3
            .select("#scatterDiv")
            .append("p")
            .attr("id", "scatterTitle")
            .append("b")
            .text("Scatter Plot")
            .append("svg")
            .attr("class", "scatterContainer")
            .attr("id", "scatterSvg")
            .attr("width", rect[0])
            .attr("height", rect[1] - 50)
            .style("background", "white");

        let pxX = rect[0];
        let pxY = rect[1] - 50;

        var dateParse = d3.timeParse("%Y-%m-%d");
        //gets the extent depending on which field you want to read
        function getExtent(fieldRead) {
            switch (fieldRead) {
                case "python":
                    return d3.extent(
                        data.map(function (child) {
                            return +child.python;
                        })
                    );
                case "java":
                    return d3.extent(
                        data.map(function (child) {
                            return +child.java;
                        })
                    );
                case "javascript":
                    return d3.extent(
                        data.map(function (child) {
                            return +child.javascript;
                        })
                    );
                case "Week":
                    return d3.extent(
                        data.map(function (child) {
                            return dateParse(child.Week);
                        })
                    );
            }
        }

        //create the scales
        let scX = d3
            .scaleTime()
            .domain(getExtent("Week"))
            .range([margin + 2, pxX - margin]);
        let scY = d3
            .scaleLinear()
            .domain([0, 110])
            .range([pxY - margin, margin])
            .nice();

        let g1 = scatterContainer.append("g").classed("ds1", true);
        // .attr('transform', `translate(${margin.left}, ${margin.top})`)

        let textBox = g1.append("text");

        //creating the dots on the graph and connecting them
        let drawChart = function (g, accessor, color, name) {
            let value = 0;
            g.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("fill", color)
                .attr("r", 2)
                .attr("cx", (d) => scX(dateParse(d["Week"])))
                .attr("cy", accessor)
                .attr("class", (d) => (d.selected ? "selected" : ""))
                .on("mouseover", function (e, d) {
                    if (name === "python") {
                        value = d.python;
                    } else if (name === "java") {
                        value = d.java;
                    } else {
                        value = d.javascript;
                    }
                    let x = mousePos.x + 10;
                    x = x.toString() + "px";
                    let y = mousePos.y - 10;
                    y = y.toString() + "px";

                    d3.select("#main")
                        .append("div").attr("id", "tooltip")
                        .append("p").attr("id", "line1")
                    d3.select("#tooltip").append("p").attr("id", "line2")
                    d3.select("#tooltip").append("p").attr("id", "line3")

                    d3.select("#tooltip").style("top", y).style("left", x).style("visibility", "visible");
                    d3.select("#line1").text(name);
                    d3.select("#line2").text(value);
                    d3.select("#line3").text(d.Week);
                })
                .on("mouseout", (d) => {
                    d3.select("#tooltip").remove();
                });

            let makeLine = d3
                .line()
                .x((d) => scX(dateParse(d["Week"])))
                .y(accessor);
            g.append("path")
                .attr("d", makeLine(data))
                .attr("fill", "none")
                .on("mouseover", function (e, d) {
                    if (name === "python") {
                        value = d.python;
                    } else if (name === "java") {
                        value = d.java;
                    } else {
                        value = d.javascript;
                    }
                    let x = mousePos.x + 10;
                    x = x.toString() + "px";
                    let y = mousePos.y - 10;
                    y = y.toString() + "px";

                    d3.select("#main")
                        .append("div").attr("id", "tooltip")
                        .append("p").attr("id", "line1")
                    d3.select("#tooltip").append("p").attr("id", "line2")
                    d3.select("#tooltip").append("p").attr("id", "line3")

                    d3.select("#tooltip").style("top", y).style("left", x).style("visibility", "visible");
                    d3.select("#line1").text(name);
                    d3.select("#line2").text(value);
                    d3.select("#line3").text(d.Week);
                })
                .on("mouseout", (d) => {
                    d3.select("#tooltip").remove();
                });
        };
        let gPy = scatterContainer.append("g");
        let gJava = scatterContainer.append("g");
        let gJS = scatterContainer.append("g");
        gPy.attr("stroke", "blue");
        gJava.attr("stroke", "green");
        gJS.attr("stroke", "red");
        drawChart(gPy, (d) => scY(d["python"]), "blue", "python");
        drawChart(gJava, (d) => scY(d["java"]), "green", "java");
        drawChart(gJS, (d) => scY(d["javascript"]), "red", "javascript");

        //create the x and y axis and the dotted lines
        let axisLeft = d3.axisLeft(scY).tickSize(0);
        let axisRight = d3
            .axisRight(scY)
            .tickSize(pxX - margin - margin)
            .tickFormat((d) => (d <= d3.timeYear(d) ? d.getFullYear() : null));
        let axisBottom = d3.axisBottom(scX);

        //add the axes
        scatterContainer
            .append("g")
            .attr("transform", `translate(2, ${pxY - margin})`)
            .call(axisBottom);
        scatterContainer
            .append("g")
            .attr("transform", `translate(${margin}, 0)`)
            .call(axisLeft)
            .call((g) => g.selectAll(".tick text").attr("x", -2));
        scatterContainer
            .append("g")
            .attr("transform", `translate(${margin}, 0)`)
            .call(axisRight)
            .call((g) =>
                g.selectAll(".tick:not(:first-of-type) line").attr("stroke-opacity", 0.5).attr("stroke-dasharray", "2,2")
            );

        //add the title
        scatterContainer
            .append("x")
            .attr("x", 100)
            .attr("y", 100)
            .attr("text-anchor", "middle")
            .style("font-size", "100px")
            .text("Scatter Plot");
    }

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            if (entries[0].contentRect.width !== rect[0] || entries[0].contentRect.height !== rect[1]) {
                setRect([entries[0].contentRect.width, entries[0].contentRect.height]);
            }
        });
        const handleMouseMove = (event) => {
            setMousePos({ x: event.clientX, y: event.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);
        observer.observe(ref.current);

        // return () => ref.current && observer.unobserve(ref.current)
        return () => {
            d3.select("#scatterSvg").remove();
            d3.select("#tooltip").remove();
            d3.select("#scatterTitle").remove();
            make();
            ref.current && observer.unobserve(ref.current);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    });

    return (
        <>
            <div ref={ref} id="scatterDiv"></div>
        </>
    );
};

export default ScatterPlot;
