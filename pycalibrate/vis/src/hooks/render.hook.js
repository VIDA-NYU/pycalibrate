import React from 'react';
import * as d3 from 'd3';

export const renderD3 = (renderchart) => {

    const ref = React.useRef();

    React.useEffect(() => {
        renderchart(d3.select(ref.current));
        return () => {};
    });

    return ref;
}