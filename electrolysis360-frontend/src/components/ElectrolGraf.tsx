import React, { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceArea, MouseHandlerDataParam } from 'recharts';
import { SimulationRequest, SimulationResponse } from '../types/models';
import { timeStamp } from 'console';

// interface ElectrolGrafProps {
//     parameters: SimulationResponse;
//     values: SimulationRequest;
// }

interface ElectrolGrafProps {
    parameters: SimulationResponse;
    values: SimulationRequest;
}

type ChartPoint1 = { name: number; Eta: number; Temperature: number };
type ChartPoint2 = { name: number; Eta: number; AluminaConcentration: number };
type ChartPoint3 = { name: number; EnergyConsumption: number; Voltage: number };

const ElectrolGraf: React.FC<ElectrolGrafProps> = ({
    parameters,
    values
}) => {

    const [dataT_Eta, setDataT_Eta] = useState<ChartPoint1[]>([]);
    const [dataAl2O3_Eta, setDataAl2O3_Eta] = useState<ChartPoint2[]>([]);
    const [dataU_Eud, setDataU_Eud] = useState<ChartPoint3[]>([]);


    useEffect(() => {
        // Точка для графика T_Eta
        setDataT_Eta(prev => [
        ...prev,
        {
            name: prev.length - 1,
            Eta: parameters.currentEfficiency,   // x
            Temperature: values.temperature      // y
        }
        ]);

        // Точка для графика Al2O3_Eta
        setDataAl2O3_Eta(prev => [
        ...prev,
        {
            name: prev.length - 1,
            Eta: parameters.currentEfficiency,
            AluminaConcentration: values.AluminaConcentration
        }
        ]);

        // Точка для графика U_Eud
        setDataU_Eud(prev => [
        ...prev,
        {
            name: prev.length - 1,
            EnergyConsumption: parameters.energyConsumption,
            Voltage: values.voltage
        }
        ]);
    }, [parameters]);

    // const [dataT_Eta, setDataT_Eta] = useState<any[]>([]);
    // const [dataAl2O3_Eta, setDataAl2O3_Eta] = useState<any[]>([]);
    // const [dataU_Eud, setDataU_Eud] = useState<any[]>([]);

    // useEffect(() => {
    // const ts = new Date().toISOString();

    // const pointT_Eta = {
    //     x: parameters.currentEfficiency,
    //     y: values.temperature,
    //     z: ts
    // };

    // const pointAl2O3_Eta = {
    //     x: parameters.currentEfficiency,
    //     y: values.concentration,
    //     z: ts
    // };

    // const pointU_Eud = {
    //     x: parameters.energyConsumption,
    //     y: values.voltage,
    //     z: ts
    // };

    // setDataT_Eta(prev => [...prev, pointT_Eta]);
    // setDataAl2O3_Eta(prev => [...prev, pointAl2O3_Eta]);
    // setDataU_Eud(prev => [...prev, pointU_Eud]);

    // }, [parameters, values]);

    return (
        <div className="panel control-panel">
            <h2>Графики зависимости</h2>
            <div className="highlight-bar-charts" style={{ userSelect: 'none', width: '100%' }}>

                <LineChart
                    width={700}
                    height={350}
                    data={dataT_Eta.slice(2)}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="1" dataKey="Eta" />
                    <YAxis orientation="right" yAxisId="2" dataKey="Temperature" />
                    <Tooltip />

                    <Line yAxisId="1" type="monotone" dataKey="Eta" stroke="#2116f1ff" />
                    <Line yAxisId="2" type="monotone" dataKey="Temperature" stroke="#cd1306ff" />
                </LineChart>
                <LineChart
                    width={700}
                    height={350}
                    data={dataAl2O3_Eta.slice(2)}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="1" dataKey="Eta" />
                    <YAxis orientation="right" yAxisId="2" dataKey="AluminaConcentration" />
                    <Tooltip />

                    <Line yAxisId="1" type="monotone" dataKey="Eta" stroke="#2116f1ff" />
                    <Line yAxisId="2" type="monotone" dataKey="AluminaConcentration" stroke="#78a69bff" />
                </LineChart>
                <LineChart
                    width={700}
                    height={350}
                    data={dataU_Eud.slice(2)}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="1" dataKey="EnergyConsumption" />
                    <YAxis orientation="right" yAxisId="2" dataKey="Voltage" />
                    <Tooltip />

                    <Line yAxisId="1" type="monotone" dataKey="EnergyConsumption" stroke="#25d2cfff" />
                    <Line yAxisId="2" type="monotone" dataKey="Voltage" stroke="#a437daff" />
                </LineChart>
            </div>
        </div>
    );
};

export default ElectrolGraf;