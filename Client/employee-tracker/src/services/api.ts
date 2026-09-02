import axios from "axios";

const API_URL = "http://192.168.2.4:5000/api/employees";

export const fetchContracts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const restoreContract = async (id: number) => {
  const response = await axios.put(`${API_URL}/${id}/restore`);
  return response.data;
};


export const deleteContract = async (id: number) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const fetchArchivedContracts =async () => {
  const response = await axios.get(`${API_URL}/archive`);
  return response.data;
};

export const addContract = async (contractData: {
  first_name: string;
  middle_name?: string;
  last_name: string;
  start_date: string;
  end_date: string | null;
  project: string;
  line_manager: string;
  phone_number: string;
  email: string;
  email2?: string;
  email3?: string;
  email4?: string;
}) => {
  const response = await axios.post(`${API_URL}/add`, contractData);
  return response.data;
};
export const updateContract = async (id: number, contractData: {
  first_name: string;
  middle_name?: string;
  last_name: string;
  start_date: string;
  end_date: string;
  project: string;
  line_manager: string;
  phone_number: string;
  email: string;
  email2?: string;
  email3?: string;
  email4?: string;
}) => {
  const response = await axios.put(`${API_URL}/${id}`, contractData);
  return response.data;
};




export const exportToCSV = async (): Promise<Blob> => {
  const response = await axios.get(`${API_URL}/export/csv`, {
    responseType: 'blob'
  });
  return response.data;
};

export const fetchHistory = async (id: number) => {
  const response = await axios.get(`${API_URL}/${id}/history`);
  return response.data;
};

export const importFromCSV = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post(`${API_URL}/import/csv`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};