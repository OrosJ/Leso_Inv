const express = require('express');
const rutas = express.Router();
const salidaModel = require('../models/salidas');
const productoModel = require('../models/producto');

//endpoint mostrar todas las salidas
rutas.get('/getsalidas', async (req, res)=> {
    try {
        const salida = await salidaModel.find();
        res.json(salida);
    } catch (error) {
        res.status(500).json({mensaje: error.message}); 
    }
});

//endpoint crear salidas
rutas.post('/crearsalida', async (req, res) => {
    const salida = new salidaModel({
        codigo: req.body.codigo,
        fecha_salida: new Date(),
        producto: req.body.producto,
        cantidad: req.body.cantidad,
        destino: req.body.destino
    })
    try {
        const nuevaSalida = await salida.save();
        res.status(201).json(nuevaSalida);
    } catch (error) {
        res.status(400).json({mensaje: error.message})
    }
});

//endpoint editar salida
rutas.put('/editarsalida/:id', async (req, res) => {
    try {
        const salidaEditada = await salidaModel.findByIdAndUpdate(req.params.id, req.body, {new : true});
        if (!salidaModel)
            return res.status(404).json({mensaje : 'Salida no encontrada'});
        else
            return res.status(201).json(salidaEditada);
    } catch (error) {
        res.status(400).json({mensaje: error.message})
    }
});

//Eliminar
rutas.delete('/eliminarsalida/:id', async (req, res) => {
    try {
        const salidaEliminada = await salidaModel.findByIdAndDelete(req.params.id);
        if(!salidaEliminada)
            return res.status(404).json({mensaje : 'Salida NO Encontrada'});
        else
            return res.status(200).json({mensaje : 'Salida Eliminada'});

    } catch (error) {
        res.status(400).json({mensaje: error.message})
    }
});

module.exports = rutas;

//REPORTE SALIDAS 1
rutas.get('/salidasporproducto/:productoid', async (req, res)=>{
    const {productoid} = req.params;
    try {
        const producto = await productoModel.findById(productoid);
        if(!producto)
            return res.status(404).json({mensaje : 'Producto no encontrado'});
        const salidas = await salidaModel.find({producto: productoid}).populate('producto');
        res.json(salidas);
    } catch (error) {
        res.status(500).json({mensaje: error.message});
    }
});

//REPORTE 2 
// Reporte: Cantidad Total Vendida y Stock Actual por Producto
rutas.get('/StockYVentas', async (req, res) => {
    try {
        const productos = await productoModel.find();
        const productosConCantidadVendidaYStockActual = await Promise.all(productos.map(async (producto) => {
            const salidas = await salidaModel.find({ producto: producto._id });
            const cantidadTotalVendida = salidas.reduce((total, salida) => total + parseInt(salida.cantidad), 0);
            const stockActual = producto.cantidad - cantidadTotalVendida;

            return {
                producto: producto,
                cantidadTotalVendida: cantidadTotalVendida,
                stockActual: stockActual
            };
        }));
        res.status(200).json(productosConCantidadVendidaYStockActual);
    } catch (error) {
        res.status(500).json({ mensaje: "Error:", error: error.message });
    }
});
