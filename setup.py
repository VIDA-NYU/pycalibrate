from setuptools import setup, find_packages

with open("README.md", "r") as fh:
    long_description = fh.read()

setup(
    name="pycalibrate",
    version="4.0.0",
    author="Peter Xenopoulos, Joao Rulff, Brian Barr, Luis Gustavo Nonato, Claudio Silva",
    author_email="pnx200@nyu.edu",
    description="Pycalibrate. A tool to assess classifier calibration",
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
