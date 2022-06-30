class ReliabilityCurve:

    def __init__(self, tableheader, tablebody, confusionMatrix, preds, labels, allClassPreds, allClassLabels ):

        self.tableheader = tableheader
        self.tablebody = tablebody

        ## saving confusion matrix
        self.confusionMatrix = confusionMatrix

        self.preds = preds
        self.labels = labels


        ## TODO: Remove after the deadline. I added this to calculate the confusion matrix on brush faster. 
        ## However, we can just do a count of the remaining samples after filtering.
        self.allClassPreds = allClassPreds
        self.allClassLabels = allClassLabels

        # self.nBins = 0
        # self.model = 0
