// react
import React, { useState } from 'react';

// styles
import './Header.css';
import './Dropdown.css';


const Header = ( props ) => {

    // available models
    const availableModels = props.models;
    const availableClasses = Array.from(Array(props.nclasses).keys());

    // setting state
    const [headerConf, setHeaderConf] = useState({
        'nbins': 10,
        'selectedclass': 0,
        'currentmodel': availableModels[0]
    });

    // Clear
    const on_clear_clicked = () => {

         // clearing filters
         setHeaderConf({
            'nbins': 10,
            'selectedclass': 0,
            'currentmodel': availableModels[0]
        });

        // propagating clear up
        props.onClearCliked();
    }

    // Curve Request
    const on_curve_request = () => {

        // requesting new curve
        props.onCurveRequested();   

        // clearing filters
        setHeaderConf({
            'nbins': 10,
            'selectedclass': 0,
            'currentmodel': availableModels[0]
        });

    }

    // Learned Curve Request
    const on_learned_curve_request = () => {

        // requesting new curve
        props.onLearnedCurveRequested();

    }
    // TODO: Add learned curve

    // Bins
    const nBinsAdded = (event) => {

        const newNBins = parseInt(headerConf.nbins) + 1;
        const headerConfiguration = {
            ...headerConf,
            'nbins': newNBins
        }

        // updating model
        setHeaderConf( headerConfiguration );

        // submitting new conf
        props.headerChanged(headerConfiguration);

    }

    const nBinsSubtracted = (event) => {

        const newNBins = parseInt(headerConf.nbins) - 1;
        const headerConfiguration = {
            ...headerConf,
            'nbins': newNBins
        }

        // updating model
        setHeaderConf( headerConfiguration );
        
        // submitting new conf
        props.headerChanged(headerConfiguration);

    }

    // Classes
    const currentClassChanged = (event) => {

        const newClass = parseInt(event.target.value);
        const headerConfiguration = {
            ...headerConf,
            'selectedclass': newClass
        }

        // updating model
        setHeaderConf( headerConfiguration );

        // submitting new conf
        props.headerChanged(headerConfiguration);
       
    }

    // Models
    const currentModelChanged = (event) => {

        const newModel = event.target.value;
        const headerConfiguration = {
            ...headerConf,
            'currentmodel': newModel
        }

        // updating model
        setHeaderConf( headerConfiguration );

        // submitting new conf
        props.headerChanged(headerConfiguration);

    }

    return (
        <div className='header-wrapper'>

            <div className='button-container'>

                <div className='button-container-header'>
                    <p>Bins</p>
                </div>
                <div className='button-container-body'>
                    <button onClick={nBinsSubtracted}>-</button>
                    <p>{headerConf.nbins}</p>
                    <button onClick={nBinsAdded}>+</button>
                </div>

                
            </div>

            <div className='button-container'>
                <div className='button-container-header'>
                    <p>Class</p>
                </div>

                <div className='button-container-body'>
                    <select name='classes' id='classname' value={headerConf.selectedclass} onChange={currentClassChanged}>
                        {availableClasses.map( (classNumber, classindex) => 
                            <option key={classindex} value={classNumber}>{classNumber}</option>
                        )}
                    </select>
                </div>
            </div>


            <div className='button-container'>
                <div className='button-container-header'>
                    <p>Model</p>
                </div>

                <div className='button-container-body'>
                    <select name='models' id='modelname' value={headerConf.currentmodel} onChange={currentModelChanged}>
                        {availableModels.map( (modelName, modelindex) => 
                            <option key={modelindex} value={modelName}>{modelName}</option>
                        )}
                    </select>
                </div>
            </div>

            <div className='single-button-container-header' onClick={on_clear_clicked}>
                <p>Clear</p>
            </div>

            <div className='single-button-container-header' onClick={on_curve_request}>
                <p>Create Curve</p>
            </div>  

            <div className='single-button-container-header' 
                style={ (props.selectedCurve.curveIndex === -1) ? { display: 'none' } : {display: 'flex'} } 
                onClick={on_learned_curve_request}>
                <p>Learned Curve</p>
            </div>
            
        </div>)

}

export default Header;