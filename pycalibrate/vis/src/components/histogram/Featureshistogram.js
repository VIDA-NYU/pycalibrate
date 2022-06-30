// react
import React, { useState } from 'react';

// styles
import './Featurehistogram.css';

// hooks
import { renderD3 } from '../../hooks/render.hook';

// third-party
import * as d3 from 'd3';

const Featurehistogram = ( props ) => {

    const add_selection_text = (headerGroup, headerWidth, histName, histFilters) => {

        if( histName in histFilters ){

            // formatting numbers


            headerGroup
                .append('text')
                .attr('x', headerWidth)             
                .attr('y', 0)
                .attr('text-anchor', 'end')
                .style('fill', '#969696')
                .style('font-family', "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif")
                .style('font-size', '12px')
                .text(`[${ histFilters[histName].start.toString().substring(0,4) }, ${histFilters[histName].end.toString().substring(0,4)}]`);

        }

    }

    const add_brush = ( chartGroup, svgref, margins, xScale ) => {

        // creating brush
        const brush = d3.brushX()
        .extent([ 
            [0, 0], 
            [svgref.node().getBoundingClientRect().width - margins.left - margins.right, svgref.node().getBoundingClientRect().height - margins.top - margins.bottom]
        ])
        .on("end", (event) => { 

            const visualFloor = Math.ceil(xScale.invert( event.selection[0]));
            const visualCeil = Math.floor(xScale.invert( event.selection[1]));

            const startValue = props.histdata.bounds[visualFloor];
            const endValue = props.histdata.bounds[visualCeil] + 1;

            // propagating brush up
            props.onFeatureBrushed( { 'name': props.histdata.name, 'start': startValue, 'end': endValue, 'visualFloor': event.selection[0], 'visualCeil': event.selection[1] });

        });

        // appending brush
        chartGroup.call(brush);

    } 

    const add_header = ( headerGroup, name ) => {
        headerGroup
            .append('text')
            .style('fill', '#969696')
            .style('font-family', "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif")
            .style('font-size', '12px')
            .text(name)
            
    }

    const clear_plot = (svgref) => {
        svgref.selectAll('*').remove();
    }

    const bar_color = (xScale, barIndex) => {

        if(props.histdata.name in props.appliedFilters){

            if( xScale(barIndex) >=  props.appliedFilters[props.histdata.name].visualFloor && xScale(barIndex) <=  props.appliedFilters[props.histdata.name ].visualCeil){
                return '#9ecae1';
            } else {
                return '#d9d9d9';
            }
        }
        return '#d9d9d9';
    }

    const render_histogram = ( chartGroup, xScale, yScale, data, filter={} ) => {

        // calculating width of the bar
        const bartWidth = (xScale.range()[1] / data.length) - 2;

        chartGroup
            .selectAll('.bar')
            .data( data )
            .join(
                enter => 
                    enter.append('rect')
                        .attr('x', (d, index) => xScale(index))
                        .attr('y', (d, index) => yScale(d) )
                        .attr('width', bartWidth )
                        .attr('height', (d, index) => yScale.range()[0] - yScale(d)  )
                        .attr('fill', (d, index) => bar_color(xScale, index) )
                        .attr('stroke', '#737373')
                        .attr('stroke-width', '1')
        )            
    }

    const ref = renderD3( 
        (svgref) => {

            // clearing
            clear_plot(svgref);

            // constants
            const margins = {
                top: 30,
                left: 20,
                right: 20,
                bottom: 20
            }

            const chartGroup = svgref
                .append("g")
                .attr("transform", `translate(${margins.left},${margins.top})`);

            const headerGroup = svgref
                .append("g")
                .attr("transform", `translate(${margins.left},${margins.top/2})`);

            // svg size
            const svgWidthRange = [0, svgref.node().getBoundingClientRect().width - margins.left - margins.right];
            const svgHeightRange = [0, svgref.node().getBoundingClientRect().height - margins.top - margins.bottom];

            // calculating data domain
            const xDomain = [ 0, props.histdata.values.length  ];
            const yDomain = [ d3.min(props.histdata.values) - 5, d3.max(props.histdata.values)] ;

            // creating scales
            const xScale = d3.scaleLinear().domain(xDomain).range(svgWidthRange);
            const yScale = d3.scaleLinear().domain(yDomain).range([svgHeightRange[1], svgHeightRange[0]]);

            // adding header
            add_header( headerGroup, props.histdata.name );

            // adding selection text
            add_selection_text( headerGroup, svgWidthRange, props.histdata.name, props.appliedFilters );

            // rendering chart
            render_histogram( chartGroup, xScale, yScale, props.histdata.values);

            // adding brush
            add_brush( chartGroup, svgref, margins, xScale );

        });

    return (
        <div className='histogram-plot-wrapper'>
            <div className='histogram-plot-container'>
                <svg ref={ref}></svg>
            </div>
        </div>
    );

}

export default Featurehistogram;