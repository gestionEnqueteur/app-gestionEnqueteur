import axios from 'axios';
import { renderHook } from '@testing-library/react-native';
import useApi from '../../hook/useApi';

jest.mock('axios'); // Simule le module axios

describe('useApi', () => {
  it('should create axios instance', () => {
    // Simule axios.create avec une configuration simple
    axios.create.mockReturnValue({});

    renderHook(() => useApi({ jwt: '', urlApi: 'https://api.example.com' }));

    // Vérifie juste si axios.create a bien été appelé sans se soucier des valeurs précises
    expect(axios.create).toHaveBeenCalled();
  });
});









