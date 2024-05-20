const express = require('express');
const request = require('supertest');
const productoRutas = require('../../rutas/productoRutas');
const ProductoModel = require('../../models/producto');
const mongoose = require('mongoose');
const productoModel = require('../../models/producto');
const app = express();
app.use(express.json());
app.use('/productos', productoRutas);

describe('Pruebas Unitarias para Productos', ()=> {
    beforeEach(async ()=>{
        await mongoose.connect('mongodb://127.0.0.1:27017/inventario', {
            useNewUrlParser: true,
        });
        await ProductoModel.deleteMany({});
    });
    afterAll(()=>{
        return mongoose.connection.close();
    });

    //Primer Test GET PRODUCTOS
    test('Deberia Mostrar todos los Productos metodo: GET: getproductos', async()=>{
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
            fecha_llegada: '',
            fecha_vencimiento: '2026-08-30'})

            await ProductoModel.create({
                codigo: '5000D24LAINV',
                nombre: 'Prueba rapida Influenza-COVID19',
                descripcion: 'Pruebas Rapidas de Antigeno Nasofaringeo para COVID19 e Influenza',
                cantidad: '5000',
                marca: 'Sugentech',
                modelo: 'DUO',
                lote: '20240611',
                sn: '9438502347',
                procedencia: 'Korea',
                fecha_llegada: '',
                fecha_vencimiento: '2026-10-30'})    

            const res = await request(app).get('/productos/getproductos');

            //Verificar Respuesta
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(2);
     
    }, 1000);

    //Segundo Test AGREGAR PRODUCTOS
    test('Deberia Agregar un nuevo produto : POST: /crear', async()=>{
        const nuevoProducto = {
            codigo: "1000D24LA12",
            nombre: "FaStep prueba rapida antigeno nasal",
            descripcion: "Fastep Nasal AG",
            cantidad: 1000,
            marca: "Assure",
            modelo: "COV-S23010H2",
            lote: "I2456789",
            sn: "67354657",
            procedencia: "China",
            fecha_vencimiento: " ",
            fecha_vencimiento: "2026/10/30"
        };

        const res = await request(app)
            .post('/productos/crear')
            .send(nuevoProducto);
        expect(res.statusCode).toEqual(201);
        expect(res.body.nombre).toEqual(nuevoProducto.nombre);
    });

    //Tercer Test ACTUALIZAR PRODUCTOS
    test('Deberia Actualizar un producto que ya existe : PUT: /editar', async()=>{

        const fechaActual = new Date().toISOString().split('T')[0];

        const productoCreado = await productoModel.create({
            codigo: '1000D24LAINV',
            nombre: 'Prueba rapida COVID19',
            descripcion: 'Pruebas Rapidas de Antigeno Nasofaringeo para COVID19',
            cantidad: '1000',
            marca: 'Assure',
            modelo: 'Fastep-AG',
            lote: '20240510',
            sn: '987cba',
            procedencia: 'China',
            fecha_llegada: fechaActual,
            fecha_vencimiento: '2026-08-30'});
        
        const productoActualizar = {
            codigo: '5000D24LAP',
            nombre: 'Pruebas rapidas de COVID19/Influenza/RSV',
            descripcion: 'Pruebas Rapidas de Antigeno Nasofaringeo para COVID19, Influenza y RSV',
            cantidad: '5000',
            marca: 'Assure',
            modelo: 'Fastep-COMBO',
            lote: '20241050',
            sn: '0987654321',
            procedencia: 'China',
            fecha_vencimiento: '2026-12-30'
        };

        const res = await request(app)
            .put('/productos/editar/'+productoCreado._id)
            .send(productoActualizar);
        expect(res.statusCode).toEqual(201);
        expect(res.body.codigo).toEqual(productoActualizar.codigo);
    });

    //Tercer Test ELIMINAR PRODUCTOS
    test('Deberia Eliminar un producto que ya existe : DELETE: /eliminar', async()=>{
        const fechaActual = new Date().toISOString().split('T')[0];

        const productoCreado = await productoModel.create({
            codigo: '1000D24LAINV',
            nombre: 'Prueba rapida COVID19',
            descripcion: 'Pruebas Rapidas de Antigeno Nasofaringeo para COVID19',
            cantidad: '1000',
            marca: 'Assure',
            modelo: 'Fastep-AG',
            lote: '20240510',
            sn: '987cba',
            procedencia: 'China',
            fecha_llegada: fechaActual,
            fecha_vencimiento: '2026-08-30'});
        
        const res = await request(app)
            .delete('/productos/eliminar/'+productoCreado._id);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({mensaje : 'Producto Eliminado'});

    });
});

