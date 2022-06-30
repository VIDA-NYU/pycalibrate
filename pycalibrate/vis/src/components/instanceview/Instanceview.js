// react
import React, { useState } from "react";

// styles
import './Instanceview.css'

const Instanceview = (props) => {

    const [ currentPage, setCurrentPage ] = useState( 0 );

    return (
        <div className='instance-view-table-wrapper'>

            {/* className={ props.classifications[rowindex] === 1  ? 'positive-instance' : 'negative-instance' } */}

            <div className="instance-view-table-body">
                <div className='instance-view-table-scrollable'>
                    <table className="instance-table">
                        <thead>
                            <tr>
                                {props.tableheader.map( (name, index) => 
                                    <th key={index}>{name}</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {props.tablebody.map( (row, rowindex) => 
                                <tr key={rowindex} >
                                    { row.map( (value, columnindex) => 
                                        <td key={columnindex} >{value}</td>    
                                    )}
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="instance-view-table-footer">

                <div className="summary-wrapper">
                    <table className="average-table">
                        <tbody>
                            <tr>
                                {props.tableaverages.map( (average, index) => 
                                    <td key={index} >
                                        <b>{average}</b>
                                    </td>
                                )}
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* <div className="pagination-wrapper">
                    <div className="pagination-button-container">
                        <p><b>-</b></p>
                    </div>
                    <div className="pagination-button-container">
                        <p><b>{currentPage}</b></p>
                    </div>
                    <div className="pagination-button-container">
                        <p><b>+</b></p>
                    </div>
                </div> */}
            </div>
            

        </div>
    )

}

export default Instanceview;