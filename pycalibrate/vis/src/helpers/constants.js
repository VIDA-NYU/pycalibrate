// third-party
import * as d3 from 'd3';

export const nameTranslator = {

    'currentmodel': 'Model',
    'selectedclass': 'Class',
    'nbins': 'Bins'

};


// creating color scale
// export const divergingColorScale10 = d3.scaleOrdinal(d3.schemeCategory10).domain([0, 10])
export const divergingColorScale10 = d3.scaleOrdinal(['#e31a1c', '#1f78b4', '#33a02c', '#a6cee3', '#b2df8a', '#fb9a99','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a']).domain([0, 10]);

// export default nameTranslator;