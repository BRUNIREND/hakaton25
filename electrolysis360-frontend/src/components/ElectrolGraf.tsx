import React, { useEffect, useState, useCallback } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceArea, MouseHandlerDataParam } from 'recharts';
import { SimulationRequest, SimulationResponse } from '../types/models';
import { timeStamp } from 'console';

type Impressions = { name: number; cost: number; impression: number };

type ZoomAndHighlightState = {
    left: string | number;
    right: string | number;
    refAreaLeft: string | number | undefined;
    refAreaRight: string | number | undefined;
    top: string | number;
    bottom: string | number;
    top2: string | number;
    bottom2: string | number;
    animation: boolean;
};

const initialState: ZoomAndHighlightState = {
    left: 'dataMin',
    right: 'dataMax',
    refAreaLeft: undefined,
    refAreaRight: undefined,
    top: 'dataMax+1',
    bottom: 'dataMin-1',
    top2: 'dataMax+20',
    bottom2: 'dataMin-20',
    animation: true,
};

const getAxisYDomain = (
    from: string | number | undefined,
    to: string | number | undefined,
    ref: keyof Impressions,
    offset: number,
    ): (number | string)[] => {
    if (from != null && to != null) {
        const refData = impressionsData.slice(Number(from) - 1, Number(to));
        let [bottom, top] = [refData[0][ref], refData[0][ref]];
        refData.forEach(d => {
        if (d[ref] > top) top = d[ref];
        if (d[ref] < bottom) bottom = d[ref];
        });

        return [(bottom | 0) - offset, (top | 0) + offset];
    }
    return [initialState.bottom, initialState.top];
};

interface ElectrolGrafProps {
    parameters: SimulationResponse;
    values: SimulationRequest;
}


const ElectrolGraf: React.FC<ElectrolGrafProps> = ({
    parameters,
    values
}) => {

    const [zoomGraph, setZoomGraph] = useState<ZoomAndHighlightState>(initialState);

    const zoom = useCallback(() => {
        setZoomGraph((prev: ZoomAndHighlightState): ZoomAndHighlightState => {
        let { refAreaLeft, refAreaRight } = prev;

        if (refAreaLeft === refAreaRight || refAreaRight === '') {
            return {
            ...prev,
            refAreaLeft: undefined,
            refAreaRight: undefined,
            };
        }

        if (refAreaLeft && refAreaRight && refAreaLeft > refAreaRight)
            [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

        const [bottom, top] = getAxisYDomain(refAreaLeft, refAreaRight, 'cost', 1);
        const [bottom2, top2] = getAxisYDomain(refAreaLeft, refAreaRight, 'impression', 50);

        return {
            ...prev,
            refAreaLeft: undefined,
            refAreaRight: undefined,
            left: refAreaLeft ?? initialState.left,
            right: refAreaRight ?? initialState.right,
            bottom,
            top,
            bottom2,
            top2,
        };
        });
    }, [setZoomGraph]);

    const zoomOut = useCallback(() => {
        setZoomGraph(initialState);
    }, [setZoomGraph]);

    const onMouseDown = useCallback(
        (e: MouseHandlerDataParam) => {
        setZoomGraph((prev: ZoomAndHighlightState): ZoomAndHighlightState => ({ ...prev, refAreaLeft: e.activeLabel }));
        },
        [setZoomGraph],
    );

    const onMouseMove = useCallback(
        (e: MouseHandlerDataParam) => {
        setZoomGraph(prev => {
            if (prev.refAreaLeft) {
            return { ...prev, refAreaRight: e.activeLabel };
            }
            return prev;
        });
        },
        [setZoomGraph],
    );

    const { refAreaLeft, refAreaRight, left, right, top, bottom, top2, bottom2 } = zoomGraph;

    const [dataT_Eta, setDataT_Eta] = useState<any[]>([]);
    const [dataAl2O3_Eta, setDataAl2O3_Eta] = useState<any[]>([]);
    const [dataU_Eud, setDataU_Eud] = useState<any[]>([]);

    useEffect(() => {
    const ts = new Date().toISOString();

    const pointT_Eta = {
        x: parameters.currentEfficiency,
        y: values.temperature,
        z: ts
    };

    const pointAl2O3_Eta = {
        x: parameters.currentEfficiency,
        y: values.concentration,
        z: ts
    };

    const pointU_Eud = {
        x: parameters.energyConsumption,
        y: values.voltage,
        z: ts
    };

    setDataT_Eta(prev => [...prev, pointT_Eta]);
    setDataAl2O3_Eta(prev => [...prev, pointAl2O3_Eta]);
    setDataU_Eud(prev => [...prev, pointU_Eud]);

    }, [parameters, values]);

    return (
        <div className="highlight-bar-charts" style={{ userSelect: 'none', width: '100%' }}>
            <button type="button" className="btn update" onClick={zoomOut}>
                Zoom Out
            </button>

            <LineChart
                style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
                responsive
                data={impressionsData}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={zoom}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis allowDataOverflow dataKey="name" domain={[left, right]} type="number" />
                <YAxis allowDataOverflow domain={[bottom, top]} type="number" yAxisId="1" width="auto" />
                <YAxis orientation="right" allowDataOverflow domain={[bottom2, top2]} type="number" yAxisId="2" width="auto" />
                <Tooltip />
                <Line yAxisId="1" type="natural" dataKey="cost" stroke="#8884d8" animationDuration={300} />
                <Line yAxisId="2" type="natural" dataKey="impression" stroke="#82ca9d" animationDuration={300} />

                {refAreaLeft && refAreaRight ? (
                <ReferenceArea yAxisId="1" x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />
                ) : null}
            </LineChart>
        </div>
    );
};

export default ElectrolGraf;