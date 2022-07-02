from setuptools import setup, find_packages

with open("README.md", "r") as fh:
    long_description = fh.read()

setup(
    name="pycalibrate",
    version="0.0.2",
    author="Peter Xenopoulos, Joao Rulff, Brian Barr, Luis Gustavo Nonato, Claudio Silva",
    author_email="xenopoulos@nyu.edu",
    description="pycalibrate. A tool to assess classifier calibration in Jupyter Notebooks",
    long_description=long_description,
    long_description_content_type='text/markdown',
    url='https://github.com/VIDA-NYU/pycalibrate',
    packages=find_packages(exclude=['node_modules']),
    include_package_data=True,
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: BSD License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.7',
    install_requires=[
        'numpy',
        'scikit-learn',
        'notebook',
        'notebookjs',
        'interpret',
        'pandas'
    ]
)
