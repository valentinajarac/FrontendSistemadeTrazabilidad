import api from '../api/config';

// Función para probar la autenticación
async function testAuth() {
  try {
    const response = await api.post('/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('Respuesta completa:', response);
    console.log('Datos de respuesta:', response.data);
    console.log('Estructura:', {
      success: response.data.success,
      message: response.data.message,
      data: {
        token: response.data.data?.token,
        role: response.data.data?.role,
        userId: response.data.data?.userId,
        username: response.data.data?.username
      }
    });
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Ejecutar la prueba
testAuth();