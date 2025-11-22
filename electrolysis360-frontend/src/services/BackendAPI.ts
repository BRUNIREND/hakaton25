import {SimulationRequest, SimulationResponse} from "../types/models";
import axios from 'axios'
export const SimulationRequestAPI = async (Data:SimulationRequest):Promise<SimulationResponse> => {
    try {
        const response = await axios.post(
            `http://localhost:5000/api/Simulation/calculate`,
            Data
        );
        console.log("data from back")
        return response.data;
    } catch (error) {
        console.error('Delete error:', {
            url: `http://localhost:5000/api/Simulation/calculate`,
            error: error instanceof Error ? error.message : error
        });
        throw error;
    }
}