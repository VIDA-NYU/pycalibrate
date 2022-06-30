// react
import React, { useState } from 'react';

// third-party
import * as d3 from 'd3';
import { Legend } from '../../helpers/legend';

// styles
import './Confusionmatrix.css';
import { renderD3 } from '../../hooks/render.hook';

const Confusionmatrix = ( props ) => {

    // getting max count
    const maxCount = d3.max( props.matrixdata, row => {
        return d3.max(row)
    });

    // creating color scale
    const cScale = d3.scaleSequential(d3.interpolateGreys).domain([0, maxCount])

    const ref = renderD3(
        (svgref) => {

            // removing previous legend
            d3.select('.legend-svg').selectAll('*').remove();

            if( props.matrixdata.length > 0){
                Legend(d3.scaleSequential([0, maxCount],  d3.interpolateGreys), svgref, {
                    title: "Count"
                });
            }
        }
    )

    return(
        <div className='confusion-matrix-container'>
            <div className='confusion-matrix-header'>
                <p>Confusion Matrix</p>
            </div>
            <div className='confusion-matrix-body'>

                { props.matrixdata.map( (row, rowindex) => 
                    <div className='matrix-row'>
                        { props.matrixdata[rowindex].map( (column, columnindex) => 
                            <div className='matrix-column' style={{backgroundColor: cScale(column)}}>
                                <p className='cell-value'>{column}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className='confusion-matrix-footer' >
                <div className='confusion-matrix-footer-container'>
                    <svg className='legend-svg' ref={ref}></svg>
                </div>
            </div>
        </div>
    )

}

export default Confusionmatrix;