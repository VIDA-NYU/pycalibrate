[![Downloads](https://static.pepy.tech/personalized-badge/pycalibrate?period=total&units=international_system&left_color=grey&right_color=blue&left_text=Downloads)](https://pepy.tech/project/pycalibrate) [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1EBWWy43btgBX-q_pucXtHBOTy-SKerXu?usp=sharing) [![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/VIDA-NYU/pycalibrate/blob/main/LICENSE)

 ## pycalibrate

 Pycalibrate is a Python package that allows access to the _Calibrate_ tool. Calibrate is a visual analytics tool used to analyze model calibration in Jupyter Notebooks. Below, we show what Calibrate looks like in practice.

## Installation

Installing pycalibrate is easy. Simply run:

```shell
pip install pycalibrate
```

You can also use pycalibrate on Colab, by copying our [Example Colab Notebook](https://colab.research.google.com/drive/1EBWWy43btgBX-q_pucXtHBOTy-SKerXu?usp=sharing).

## Usage
One can pycalibrate in just a few lines of code:

```python
from pycalibrate import Calibrate

c = Calibrate(data=dataset) # `dataset` must be a Pandas dataframe

c.add_model(y_preds, y_labels, "ModelName") 
# y_preds is an n x k matrix of predictions
# y_labels is an n x k matrix of one-hot encoded labels

c.visualize() # Voila! 
```

## Calibrate Tool

![System screen](https://github.com/VIDA-NYU/pycalibrate/blob/main/images/teaser.png?raw=true)

## Need Help?
Need help? Open up an [issue](https://github.com/VIDA-NYU/pycalibrate/issues).