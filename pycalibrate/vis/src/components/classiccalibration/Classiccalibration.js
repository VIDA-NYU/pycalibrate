// react
import React, { useState } from 'react';

// styles
import './Classiccalibration.css';

// hooks
import { renderD3 } from '../../hooks/render.hook';

// helpers
import { nameTranslator, divergingColorScale10 } from '../../helpers/constants';


// third-party
import * as d3 from 'd3';

const ClassicCalibrationPlot = ( props ) => {   
    
    const create_brush = (chartGroup, svgref, margins, xScale) => {

        // creating brush
        const brush = d3.brushX()
        .extent([ 
            [0, 0], 
            [svgref.node().getBoundingClientRect().width - margins.left - margins.right, svgref.node().getBoundingClientRect().height - margins.top - margins.bottom]
        ])
        .on("end", (event) => { 

            props.onDiagramBrushed(
                {'start': xScale.invert(event.selection[0]), 
                'end': xScale.invert(event.selection[1]) }) 
        });

        // appending brush
        chartGroup.call(brush);
    }

    const clear_plot = (svgref) => {

        svgref.selectAll('*').remove();
        
    }

    const render_calibration_line = ( chartGroup, xScale, yScale, data, curveIndex, appliedfilters, selectedCurve  ) => {

        // creating line function
        const line = d3.line()
            .curve(d3.curveLinear)
            .x(d => xScale(d.x))
            .y(d => yScale(d.y));
        
        // appending circles
        chartGroup
            .append('path')
            .datum(data) 
            .attr("class", "line") 
            .attr("d", line)
            .style("fill", "none")
            .style("stroke", () => { 

                if(selectedCurve == -1){
                    return divergingColorScale10(curveIndex);
                } else {
                    if( selectedCurve == curveIndex ){
                        return divergingColorScale10(curveIndex);
                    } else {
                        return '#d1d1d1';
                    }
                }
                
                // if(curveIndex === props.selectedCurve.curveIndex ){
                //     return "#9ecae1"
                // }
                // return "#a2a3a2";
            })
            .style("stroke-width", "2")
            .style('cursor', 'pointer')
            .on('click', (event) => {

                // fixing line selection
                props.onCurveClick({curveIndex});

            })
            .on('mouseout', ( event ) => { 

                // clearing previous tooltip
                d3.select('.tooltip-div').remove();
                d3.select(event.srcElement)
                    .style("stroke-width", "2");

            })
            .on('mouseenter', ( event ) => { 

                // clearing previous tooltip
                d3.select('.tooltip-div').remove();

                // creating new tooltip
                const tooltipdiv = d3.select("body")
                        .append("div")	
                        .attr("class", "tooltip-div")				
                        .style("opacity", .9)
                        .style("left", (event.pageX) + "px")		
                        .style("top", (event.pageY - 50) + "px");

                Object.entries(appliedfilters).forEach(entry => {
                    const [key, value] = entry;

                    if( key !== 'featurefilters' & key !== 'predrange' ){
                        tooltipdiv
                            .append('div')
                            .attr("class", "tooltip-div-row")	
                                .html(`<p><b>${nameTranslator[key]}</b>:</p> <p>${value}</p>`);
                    }
                });
                    
                d3.select(event.srcElement)
                    .style("stroke-width", "5");
            });

    }

    const render_learned_line = ( chartGroup, xScale, yScale, data, selectedCurve ) => {

        // creating line function
        const line = d3.line()
            .curve(d3.curveLinear)
            .x(d => xScale(d.x))
            .y(d => yScale(d.y));
        
        // appending circles
        chartGroup
            .append('path')
            .datum(data) 
            .attr("class", "line") 
            .attr("d", line)
            .attr('stroke-dasharray', '5 5')
            .style("fill", "none")
            .style("stroke", () => {
                return divergingColorScale10(selectedCurve);
            })
            .style("stroke-width", "1");

    }

    const render_support_line = ( chartGroup, xScale, yScale ) => {

        // support line data
        const supportLineData = [];
        for(let i = 0; i < 1; i += 0.1){
            const point = {'x': i, 'y': i};
            supportLineData.push(point);
        }

        // creating line function
        const line = d3.line()
            .curve(d3.curveLinear)
            .x(d => xScale(d.x))
            .y(d => yScale(d.y));
        
        // appending circles
        chartGroup
            .append('path')
            .datum(supportLineData) 
            .attr("class", "line") 
            .attr("d", line)
            .attr('stroke-dasharray', '5 5')
            .style("fill", "none")
            .style("stroke", "#a2a3a2")
            .style("stroke-width", "1");

    }

    const render_legends = ( xLegendGroup, yLegendGroup ) => {

        xLegendGroup
            .append("text")
            .attr("x", 0)
            .attr("y", 0)
            .text("Confidence")
            .attr('fill', '#969696')
            .attr('text-anchor', 'end')
            .attr('alignment-baseline', 'baseline')
            .style("font-size", "8pt")
            .style("font-weight", "500")
            .style('font-family',"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif'");  

        yLegendGroup
            .append("text")
            .attr("x", 0)
            .attr("y", 0)
            .text("True Rate")
            .attr("transform", "rotate(270)")
            .attr('fill', '#969696')
            .attr('text-anchor', 'end')
            .attr('alignment-baseline', 'baseline')
            .style("font-size", "8pt")
            .style("font-weight", "500")
            .style('font-family',"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif'");  

    }

    const render_preds_histogram = ( histogramGroup, data, xScale, yScale ) => {

        // calculating width of the bar
        const bartWidth = (xScale.range()[1] / data.length) - 2;

        histogramGroup
            .selectAll('.bar')
            .data( data )
            .join(
                enter => 
                    enter.append('rect')
                        .attr('x', (d, index) => xScale(index) )
                        .attr('y',  (d, index) => yScale(d)  )
                        .attr('width', bartWidth)
                        .attr('height', (d, index) => yScale.range()[0] - yScale(d) )
                        .attr('fill', '#d9d9d9')
                        .attr('stroke', '#969696')
                        .attr('stroke-width', '1')
                        .style('opacity', 0.5)
        )            

    }

    const ref = renderD3( 
        (svgref) => {

            // constants
            const margins = {
                top: 40,
                left: 50,
                right: 40,
                bottom: 40
            }

            // clearing
            clear_plot(svgref);

            // creating groups
            const yAxisGroup = svgref
                .append("g")
                .attr("transform", `translate(${margins.left},${margins.top})`);

            const xAxisGroup = svgref
                .append("g")
                .attr("transform", `translate(${margins.left},${svgref.node().getBoundingClientRect().height -  margins.bottom})`);

            const chartGroup = svgref
                .append("g")
                .attr("transform", `translate(${margins.left},${margins.top})`);

            const xLegendGroup = svgref
                .append("g")
                .attr("transform", `translate(${svgref.node().getBoundingClientRect().width -  margins.right},${svgref.node().getBoundingClientRect().height - 10 })`);

            const yLegendGroup = svgref
                .append("g")
                .attr("transform", `translate(${ margins.left/2 - 5 },${margins.top})`);

            const predsHistogramGroup = svgref
                .append("g")
                .attr("transform", `translate(${margins.left},${svgref.node().getBoundingClientRect().height -  margins.bottom - 80 })`);
            
            // svg size
            const svgWidthRange = [0, svgref.node().getBoundingClientRect().width - margins.left - margins.right];
            const svgHeightRange = [0, svgref.node().getBoundingClientRect().height - margins.top - margins.bottom];

            // calculating data domain
            const xDomain = [0,1];
            const yDomain = [0,1];

            // creating scales
            const xScale = d3.scaleLinear().domain(xDomain).range(svgWidthRange);
            const yScale = d3.scaleLinear().domain(yDomain).range([svgHeightRange[1], svgHeightRange[0]]);

            // appending axes
            xAxisGroup
                .style("color", "#a2a3a2")
                .call(d3.axisBottom(xScale));

            yAxisGroup
                .style("color", "#a2a3a2")
                .call(d3.axisLeft(yScale));

            // render legends
            render_legends( xLegendGroup, yLegendGroup );

            if( props.selectedCurve.curveIndex !== -1 && props.predsHistrogram.values.length > 0 ){

                // calculating max histogram value
                const maxHistValue = d3.max(props.predsHistrogram.values);

                const predsHistogramXscale = d3.scaleLinear().domain([0, props.predsHistrogram.values.length]).range(svgWidthRange);
                const predsHistogramYscale = d3.scaleLinear().domain([0, maxHistValue]).range([80, 0]);

                
                render_preds_histogram( predsHistogramGroup, props.predsHistrogram.values, predsHistogramXscale, predsHistogramYscale );
            }

            if( props.selectedCurve.curveIndex !== -1 ){
                // appending brush
                create_brush( chartGroup, svgref, margins, xScale );
            }

            // rendering support line
            render_support_line( chartGroup, xScale, yScale );

            // rendering reliability curves
            for(let lineIndex = 0; lineIndex < props.chartdata.length; lineIndex++){
                render_calibration_line( chartGroup, xScale, yScale, props.chartdata[lineIndex].curvepoints, lineIndex, props.chartdata[lineIndex].filters, props.selectedCurve.curveIndex  );
            }

            if( props.learnedCurve && props.learnedCurve.length > 0 ){
                render_learned_line( chartGroup, xScale, yScale, props.learnedCurve, props.selectedCurve.curveIndex );
            }

    });

    return (
        <div className='plot-container'>
            <svg ref={ref}></svg>
        </div>
    );
}

export default ClassicCalibrationPlot;