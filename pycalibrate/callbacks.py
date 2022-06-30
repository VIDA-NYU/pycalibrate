from sklearn.calibration import calibration_curve
from sklearn.metrics import confusion_matrix
from interpret.glassbox import ExplainableBoostingClassifier
import numpy as np
import pandas as pd


def get_table_average( tablebody  ):

    return  np.around( np.array(tablebody).mean(axis=0) , decimals=2).tolist()

def get_reliability_curve( filters, data, preds, labels ):

    filteredPreds = preds
    filteredLabels = labels
    filteredData = data

    ## Filtering by features
    for key in filters['featurefilters']:

        ## setting boolean conditions
        currentconds = ( (filteredData[filters['featurefilters'][key]['name']] >= filters['featurefilters'][key]['start']) & (filteredData[filters['featurefilters'][key]['name']] <= filters['featurefilters'][key]['end']) )
        
        ## filtering dataframes
        filteredData = filteredData[ currentconds ]
        filteredPreds = filteredPreds[ currentconds ] 
        filteredLabels = filteredLabels[ currentconds ]


    ## saving all classes predictions
    allClassPreds = filteredPreds
    allClassLabels = filteredLabels

    ## confusion matrix
    confusionMatrix = confusion(filteredPreds, filteredLabels)

    ## filtering to current class index
    filteredPreds = filteredPreds[:, filters['selectedclass']]
    filteredLabels = filteredLabels[:, filters['selectedclass']]

    # new reliability curve
    chartData = reliability_diagram( preds=filteredPreds, labels=filteredLabels, bins=filters['nbins'] )

            
    return {'reliabilitychart': chartData }, {
            'tableheader': filteredData.columns.tolist(),
            'tablebody': np.around(filteredData.values, decimals=2).tolist(),
            # 'classifications': filteredLabels.tolist()
        }, confusionMatrix, filteredPreds, filteredLabels, allClassPreds, allClassLabels


def reliability_diagram( preds, labels, bins ):

    '''
        n = number of samples
        k = number of classseex

        preds - n x k numpy array of predicted probabilities
        labels - n x k numpy array of one-hot encoded labels
        class_index - integer of what class to consider
        bins - integer for number of bins used to make curve
    '''

    acc, conf = calibration_curve(labels, preds, n_bins=bins, strategy="uniform")
    chartData = [ { 'x': conf[i], 'y': acc[i] }  for i in range(acc.shape[0]) ]
    return chartData

def confusion( preds, labels ):
    
    y_pred = np.argmax(preds, axis=1)
    y_true = np.argmax(labels, axis=1)
    
    return confusion_matrix(y_true, y_pred)

def learned_reliability_diagram(preds, labels, bins=256, random_state=42):

    '''
        n = number of samples
        k = number of classes

        preds - n x k numpy array of predicted probabilities
        labels - n x k numpy array of one-hot encoded labels
        class_index - integer of what class to consider
        bins - integer for number of bins in EBM model
        random_state - for reproducibility
    '''

    ebm = ExplainableBoostingClassifier(random_state=random_state, binning="uniform", max_bins=bins)
    ebm.fit(preds.reshape(-1,1), labels.reshape(-1,1))
    conf = np.linspace(0,1,num=100)
    acc = ebm.predict_proba(conf.reshape(-1,1))[:,1]

    chartData = [ { 'x': conf[i], 'y': acc[i] }  for i in range(acc.shape[0])]
    return {'learnedcurve': chartData }