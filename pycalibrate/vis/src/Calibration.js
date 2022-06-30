// react
import React, { useState } from 'react';

// styles
import './Calibration.css'

// components
import ClassicCalibrationPlot from './components/classiccalibration/Classiccalibration';
import Header from './components/header/Header';
import Featurehistogram from './components/histogram/Featureshistogram';
import Instanceview from './components/instanceview/Instanceview';
import ConfusionMatrix from './components/confusionmatrix/Confusionmatrix';


const Calibration = ( props ) => {   
    
    const [ filters, setFilters ] = useState( {
        'nbins': 10,
        'selectedclass': 0,
        'currentmodel': props.models[0],
        'predrange': [],
        'featurefilters': {}
    });

    const [ reliabilitycharts, setReliabilitycharts ] = useState( [] );
    const [ selectedreliabilitychart, setSelectedreliabilitychart ] = useState( {'curveIndex': -1} );
    const [ currentLearnedCurve, setCurrentLearnedCurve ] = useState( [] );
    const [ currentPredsHistogram, setCurrentPredsHistogram] = useState( {'values': [] } );
    
    
    const [ curveInstances, setCurveInstances ] = useState( {
        'tableheader': [],
        'tablebody': [],
        'tableaverages': []
    });

    const [matrixdata, setMatrixdata ] = useState([]);


    //********** CALIBRATION PLOT EVENTS **********/
    const on_pred_range_brushed = ( event ) => {

        const filtered_table_data = ( data ) => {

             // instance rows
             setCurveInstances( {
                'tableheader': data.tableheader,
                'tablebody': data.tablebody.slice(0, 200),
                'tableaverages': data.tableaverages
            });

            // setting matrix data
            setMatrixdata(data.confusionmatrix);

        }

        let comm_filter_by_pred_range_request = new CommAPI('filter_by_pred_range', filtered_table_data);
        comm_filter_by_pred_range_request.call(event);

    }

    const on_curve_click = ( event ) => {

        // callback
        const curve_instance_data = ( data ) => {

            // instance rows
            setCurveInstances( {
                'tableheader': data.tableheader,
                'tablebody': data.tablebody.slice(0, 200),
                'tableaverages': data.tableaverages
            });

            // setting matrix data
            setMatrixdata(data.confusionmatrix);

            // updating state 
            setSelectedreliabilitychart( {'curveIndex': event.curveIndex} );

            // updating preds histogram
            setCurrentPredsHistogram( data.predshistogram )

            // clearing learned curve
            setCurrentLearnedCurve( [] );

        }

        if( event.curveIndex !== selectedreliabilitychart.curveIndex ){

            let comm_curve_instance_data_request = new CommAPI('get_curve_instance_data', curve_instance_data);
            comm_curve_instance_data_request.call(event);

        } else {

            // instance rows
            setCurveInstances( {
                'tableheader': [],
                'tablebody': [],
                'tableaverages': []
            });

            // clearing learned curve
            setCurrentLearnedCurve( [] );

            // setting matrix data
            setMatrixdata( [] );

            // clearing preds histogram
            setCurrentPredsHistogram( {'values': [] } );

            // updating state
            setSelectedreliabilitychart( {'curveIndex': -1 } );

        }

    };

    //********** HEADER EVENTS **********/
    const clear_all = () => {

        const clear_all_curves = ( event ) => {

            // clearing curves
            setReliabilitycharts( [] );

            // clearing filters
            setFilters({
                'nbins': 10,
                'selectedclass': 0,
                'currentmodel': props.models[0],
                'predrange': [],
                'featurefilters': {}
            });

            // instance rows
            setCurveInstances( {
                'tableheader': [],
                'tablebody': [],
                'tableaverages': []
            });

            // setting matrix data
            setMatrixdata( [] );

            // clearing learned curve
            setCurrentLearnedCurve( [] );

            // updating state
            setSelectedreliabilitychart( {'curveIndex': -1 } );


        }
        
        let comm_clear_curves_request = new CommAPI('clear_curves', clear_all_curves);
        comm_clear_curves_request.call({});


    };

    const on_curve_requested = () => {

        // callback
        const reliability_diagram = ( data ) => {

            const charts = [...reliabilitycharts];
            charts.push( {'curvepoints': data.reliabilitychart, filters } )
            setReliabilitycharts( charts );

            // clearing filters
            setFilters({
                'nbins': 10,
                'selectedclass': 0,
                'currentmodel': props.models[0],
                'predrange': [],
                'featurefilters': {}
            });

        };

        let comm_curve_request = new CommAPI('get_reliability_curve', reliability_diagram);
        comm_curve_request.call(filters);

    };


    const on_learned_curve_requested = () => {

        // callback
        const learned_curve_data = ( data ) => {

            setCurrentLearnedCurve(data.learnedcurve);

        };

        let comm_learned_curve_request = new CommAPI('get_learned_curve', learned_curve_data);
        comm_learned_curve_request.call(selectedreliabilitychart);

    };


    const header_changed = ( headerConf ) => {

        const newFilters = {
            ...filters,
            ...headerConf
        };

        // setting new filters
        setFilters(newFilters);
    };


    //********** HISTOGRAMS EVENTS **********/
    const on_feature_brushed = ( histogramFilters ) => {

        // adding histogram filters
        const featurefilters = {
            ...filters.featurefilters,
        };
        featurefilters[histogramFilters.name] = histogramFilters;

        
        // setting new filters
        const newFilters = {
            ...filters,
            'featurefilters': featurefilters
        }; 
        
        // updating state
        setFilters(newFilters);
    };

    return (
        <div>
            <div className='calibration-wrapper'>

                <div className='header-container'>
                    <Header 
                        models={props.models}
                        nclasses={props.nclasses}
                        selectedCurve={selectedreliabilitychart}
                        headerChanged={header_changed}
                        onCurveRequested={on_curve_requested}
                        onLearnedCurveRequested={on_learned_curve_requested}
                        onClearCliked={clear_all}  
                    />
                </div>

                <div className='plot-wrapper'>
                    <div className='calibration-container'>
                        <ClassicCalibrationPlot 
                            chartdata={reliabilitycharts}
                            selectedCurve={selectedreliabilitychart}
                            learnedCurve={currentLearnedCurve}
                            predsHistrogram={currentPredsHistogram}
                            onCurveClick={on_curve_click}
                            onDiagramBrushed={on_pred_range_brushed}
                        />
                    </div>
                    <div className='histograms-wrapper'>
                        <div className='histograms-wrapper-scrollable'>
                            {props.histdata.map( (histogram, index) => 
                                <div key={index} className='histogram-container'>
                                    <Featurehistogram 
                                        histdata={histogram} 
                                        appliedFilters={filters.featurefilters}
                                        onFeatureBrushed={on_feature_brushed}
                                        // onFeatureBrushed={feature_brushed} 
                                        // appliedFilters={featureFilters}
                                    />
                                </div>)
                            }
                        </div>
                    </div>
                </div>
                <div className='footer-container'>
                    <div className='instance-view-wrapper'>
                        <Instanceview 
                            tableheader={curveInstances.tableheader}
                            tablebody={curveInstances.tablebody}
                            tableaverages={curveInstances.tableaverages}
                            // classifications={classifications} 
                        />
                    </div>
                    <div className='confusion-matrix-wrapper'>
                        <ConfusionMatrix matrixdata={matrixdata}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Calibration;