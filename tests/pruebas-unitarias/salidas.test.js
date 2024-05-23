const express = require('express');
const request = require('supertest');
const productoRutas = require('../../rutas/productoRutas');
const ProductoModel = require('../../models/producto');
const SalidaModel = require('../../models/salidas'); // Asegúrate de importar SalidaModel si lo estás usando
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
app.use('/productos', productoRutas);

beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/inventario', {
        useNewUrlParser: true,
    });
});

beforeEach(async () => {
    await ProductoModel.deleteMany({});
    await SalidaModel.deleteMany({}); // Asegúrate de limpiar también los datos de SalidaModel
});

afterAll(async () => {
    await mongoose.connection.close();
});

test('Debería obtener el reporte de cantidad total vendida y stock actual por producto', async () => {
    // Insertar datos de prueba en la base de datos
    await ProductoModel.create({
        codigo: '1000D24LAINV',
        nombre: 'Prueba rapida COVID19',
        descripcion: 'Pruebas Rapidas de Antigeno Nasofaringeo para COVID19',
        cantidad: '1000',
        marca: 'Assure',
        modelo: 'Fastep-AG',
        lote: '20240510',
        sn: '987cba',
        procedencia: 'China',
        fecha_llegada: new Date(),
        fecha_vencimiento: '2026-08-30'
    });

    await SalidaModel.create({
        codigo: 'SALIDA1',
        fecha_salida: new Date(),
        producto: '664ec74896b84be6a322a80c',
        cantidad: '200', // Cantidad vendida
        destino: 'Almacén'
    });

    // Obtener el reporte de cantidad total vendida y stock actual por producto
    const res = await request(app).get('/salidasRutas/StockYVentas');

    // Verificar la respuesta
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);

    // Verificar valores de stock actual y cantidad de salidas
    const productoReporte = res.body[0]; // Suponiendo que el reporte devuelva un solo producto
    expect(productoReporte.stockActual).toEqual(800); // 1000 (cantidad inicial) - 200 (cantidad vendida)
    expect(productoReporte.cantidadSalidas).toEqual(200); // Cantidad vendida
});
