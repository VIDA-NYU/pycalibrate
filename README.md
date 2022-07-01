# PyCalibrate

![System screen](https://github.com/VIDA-NYU/pycalibrate/blob/main/images/teaser.png?raw=true)


## Introduction

Analyzing classification model performance is a crucial task for machine learning practitioners. While practitioners often use count-based metrics derived from confusion matrices, like accuracy, many applications, such as weather prediction, sports betting, or patient risk prediction, rely on a classifier’s predicted probabilities rather than predicted labels. In these instances, practitioners are concerned with producing a calibrated model, that is, one which outputs probabilities that reflect those of the true distribution. Model calibration is often analyzed visually,through static reliability diagrams, however, the traditional calibration visualization may suffer from a variety of drawbacks due to the strong aggregations it necessitates. Furthermore, count-based approaches are unable to sufficiently analyze model calibration. We present Calibrate, an interactive reliability diagram that addresses the aforementioned issues. Calibrate constructs a reliability diagram that is resistant to drawbacks in traditional approaches, and allows for interactive subgroup analysis and instance-level inspection.

## Installation

### Option 1: Local Installation:

Clone the repo:
~~~~
git clone https://github.com/VIDA-NYU/pycalibrate.git
~~~~




Interactive Calibration Plots
