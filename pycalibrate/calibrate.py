from copyreg import constructor
from gc import callbacks
from notebookjs import execute_js
from .helpers import calculate_histograms, calculate_preds_histograms
from .reliabilitycurve import ReliabilityCurve
import numpy as np
# from callbacks import reliability_diagram, learned_reliability_diagram, filter_by_range, filter_by_feature_range
from .callbacks import get_reliability_curve, learned_reliability_diagram, confusion, get_table_average



class Calibrate:

    def __init__(self, data) -> None:

        ## calculating histograms
        self.histograms = calculate_histograms( data )

        ## user-generated data
        self.data = data

        ## models
        self.predictions = {}
        self.labels = {}
        self.models = []
        
        ## number of classes
        self.nClasses = 0

        ## created curves
        self.createdCurves = []

        ## loading vis lib
        self.vislib = None
        with open ('./vis/dist/calibration.js', "r") as f:
            self.vislib = f.read()

    def add_model(self, predictions, labels, name):

        ## TODO: make sure all models have same number of classes

        ## appending model name
        self.models.append(name)

        ## appending model data
        self.labels[name] = labels
        self.predictions[name]  = predictions

        ## updating nclasses
        self.nClasses = predictions.shape[1]
        
    def visualize(self):

        ## setting callbacks
        callbacks = {
            'get_reliability_curve': self.get_reliability_curve,
            'get_learned_curve': self.get_learned_curve,
            'get_curve_instance_data': self.get_curve_instance_data,
            'clear_curves': self.clear_curves,
            'filter_by_pred_range': self.filter_by_pred_range
        }

        ## setting input data
        input_data = {
            'histograms': self.histograms,
            'models': self.models,
            'nclasses': self.nClasses
        }

        # Plotting the Radial Bar Chart
        execute_js(
            library_list=[self.vislib],
            main_function="calibration.renderCalibration", 
            data_dict=input_data,
            callbacks=callbacks )

    def get_preds_histogram( self, preds ):
        return calculate_preds_histograms(preds)

    def get_reliability_curve( self, event ):

        ## current model
        modelPredictions = self.predictions[event['currentmodel']]
        modelLabels = self.labels[event['currentmodel']]
        
        ## getting curve
        currentcurvedata, instancedata, confusionmatrix, preds, labels, allClassPreds, allClassLabels = get_reliability_curve( event, data=self.data, preds=modelPredictions, labels=modelLabels )
        
        ## saving instance data
        curve = ReliabilityCurve( 
            tableheader=instancedata['tableheader'], 
            tablebody=instancedata['tablebody'], 
            confusionMatrix=confusionmatrix, 
            preds=preds, 
            labels=labels,
            allClassPreds=allClassPreds,
            allClassLabels=allClassLabels)
        self.createdCurves.append(curve)

        ## getting curve
        return currentcurvedata

    def get_learned_curve( self, event ):

        selectedCurve = self.createdCurves[event['curveIndex']]
        learnedCurve = learned_reliability_diagram( selectedCurve.preds, selectedCurve.labels )

        return learnedCurve

    def get_curve_instance_data( self, event ):

        currentInstanceData = {
            'tableheader':  self.createdCurves[event['curveIndex']].tableheader,
            'tablebody': self.createdCurves[event['curveIndex']].tablebody,
            'tableaverages': get_table_average(self.createdCurves[event['curveIndex']].tablebody),
            'confusionmatrix': self.createdCurves[event['curveIndex']].confusionMatrix,
            'predshistogram': self.get_preds_histogram(self.createdCurves[event['curveIndex']].preds)
        }

        return currentInstanceData

    def filter_by_pred_range(self, event ):

        ## getting current curve
        currentCurve = self.createdCurves[0]

        ## setting conds
        conds = ( (currentCurve.preds >= event['start']) & (currentCurve.preds <= event['end']) )
        tablebody = np.array(currentCurve.tablebody)[conds]
        
        ## calculating filtered confusion matrix
        preds = currentCurve.allClassPreds[conds]
        labels = currentCurve.allClassLabels[conds]
        confusionMatrix = confusion(preds, labels)

        return {
            'tablebody': tablebody.tolist(),
            'tableheader': currentCurve.tableheader,
            'tableaverages': get_table_average( tablebody ),
            'confusionmatrix': confusionMatrix
        }

    def clear_curves(self, event):

        nCurves = len(self.createdCurves)
        self.createdCurves = []

        return {'ncurves':  nCurves}

