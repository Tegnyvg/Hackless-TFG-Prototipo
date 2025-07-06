const request = require('supertest');
const app = require('../app'); // Asegúrate de exportar tu app en app.js

describe('Solicitudes de Demo', () => {
  it('debe guardar una solicitud válida', async () => {
    const res = await request(app)
      .post('/solicitar-demo')
      .send({ nombre: 'Juan', empresa: 'EmpresaX', email: 'juan@x.com', telefono: '123', mensaje: 'Quiero una demo' });
    expect(res.statusCode).toBe(200);
    expect(res.body.solicitud).toBeDefined();
  });

  it('debe rechazar solicitud sin email', async () => {
    const res = await request(app)
      .post('/solicitar-demo')
      .send({ nombre: 'Juan', empresa: 'EmpresaX' });
    expect(res.statusCode).toBe(400);
  });
});

describe('Login Admin', () => {
  it('rechaza login con credenciales inválidas', async () => {
    const res = await request(app)
      .post('/admin-login')
      .send({ correo_electronico: 'noexiste@x.com', password: '12345678' });
    expect(res.statusCode).toBe(401);
  });
  // Puedes agregar más pruebas para login válido, 2FA, etc.
});
