const express = require('express');
const rutas = express.Router();
const productoModel = require('../models/producto');
//endpoint traer todos los productos
rutas.get('/getproductos', async (req, res) => {
    try {
        const producto = await productoModel.find();
        res.json(producto);
    }catch (error){
        res.status(500).json({mensaje: error.message});
    }
});

//endpoint Crear
rutas.post('/crear', async (req, res) => {
    const producto = new productoModel({
        codigo: req.body.codigo,
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        cantidad: req.body.cantidad,
        marca: req.body.marca,
        modelo: req.body.modelo,
        lote: req.body.lote,
        sn: req.body.sn,
        procedencia: req.body.procedencia,
        fecha_llegada: new Date(),
        fecha_vencimiento: new Date(req.body.fecha_vencimiento)
    })
    try {
        const nuevoProducto = await producto.save();
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(400).json({mensaje: error.message})
    }
});

//endpoint editar
rutas.put('/editar/:id', async (req, res) => {
try {
    const productoEditado = await productoModel.findByIdAndUpdate(req.params.id, req.body, {new : true});
    if (!productoModel)
        return res.status(404).json({mensaje : 'Producto no encontrado'});
    else
        return res.status(201).json(productoEditado);
} catch (error) {
    res.status(400).json({mensaje: error.message})
}
});

//Eliminar
rutas.delete('/eliminar/:id', async (req, res) => {
    try {
        const productoEliminado = await productoModel.findByIdAndDelete(req.params.id);
        if(!productoEliminado)
            return res.status(404).json({mensaje : 'Producto NO Encontrado'});
        else
            return res.status(200).json({mensaje : 'Producto Eliminado'});

    } catch (error) {
        res.status(400).json({mensaje: error.message})
    }
})

// producto por id
rutas.get('/productoid/:id', async (req, res) => {
    try {
        const producto = await productoModel.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({mensaje : 'Producto NO Encontrado'});
        } else {
            return res.json(producto);
        }
    }catch (error){
        res.status(500).json({mensaje: error.message});
    }
});

//producto por fabricante
rutas.get('/productofabricante/:marca', async (req, res) => {
    try {
        const productofabricante = await productoModel.find({ marca: new RegExp(req.params.marca, 'i') });
            return res.json(productofabricante);
    }catch (error){
        res.status(500).json({mensaje: error.message});
    }
});

//Eliminar TODO
rutas.delete('/eliminartodo', async (req, res) => {
    try {
        await productoModel.deleteMany();
            return res.json({mensaje : 'Productos Eliminados'});

    } catch (error) {
        res.status(400).json({mensaje: error.message})
    }
})
module.exports = rutas;

//Contar Total
rutas.get('/totalproductos', async (req, res) => {
    try {
        const total = await productoModel.countDocuments();
            return res.json({totalproductos: total});
    } catch (error) {
        res.status(400).json({mensaje: error.message})
    }
})

//Ordenar por Fecha desc
rutas.get('/productosfechadesc', async (req, res) => {
    try {
        const productosfechadesc = await productoModel.find().sort({ fecha_llegada: -1 });
            return res.json({productosfechadesc});
    } catch (error) {
        res.status(400).json({mensaje: error.message})
    }
})

//Ordenar por Fecha asc
rutas.get('/productosfechaasc', async (req, res) => {
    try {
        const productosfechaasc = await productoModel.find().sort({ fecha_llegada: 1 });
            return res.json({productosfechaasc});
    } catch (error) {
        res.status(400).json({mensaje: error.message})
    }
})

//Productos por Mes
rutas.get('/productosPorMes/:Mes', async (req, res) => {
    const nombreMesConsulta = req.params.Mes.toLowerCase();
    const meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    if (!meses.includes(nombreMesConsulta)) {
        return res.status(400).json({ mensaje: "mes invalido" });
    }

    const mesConsulta = meses.indexOf(nombreMesConsulta) + 1; // Obtener el número del mes

    try {
        const productosPorMes = await productoModel.find().lean(); // Obtener todos los productos
        const productosFiltrados = productosPorMes.filter(producto => {
            const fechaProducto = new Date(producto.fecha_llegada); // Convertir la fecha del producto a un objeto Date
            const mesProducto = fechaProducto.getMonth() + 1; // Obtener el mes (1 a 12)
            return mesProducto === mesConsulta; // Filtrar los productos cuyo mes coincide con el mes de la consulta
        });

        if (productosFiltrados.length === 0) {
            return res.status(404).json({ mensaje: "No existen productos en este mes" });
        }

        res.status(200).json(productosFiltrados);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al filtrar los productos por mes", error: error.message });
    }
});

// Productos con stock bajo
rutas.get('/productosStockBajo', async (req, res) => {
    try {
        const productosStockbajo = await productoModel.find({ cantidad: { $lt: 50 } });
        if (productosStockbajo.length > 0) {
            res.status(200).json({
                mensaje: "Los siguientes productos tienen un stock debajo de 50 unidades:",
                productos: productosStockbajo
            });
        } else {
            res.status(200).json({ mensaje: "No hay productos con stock bajo." });
        }
    } catch (error) {
        res.status(500).json({ mensaje: "Error", error: error.message });
    }
});


//Productos vencidos
rutas.get('/productosVencidos', async (req, res) => {
    try {
        const fechaActual = new Date();
        const productosVencidos = await productoModel.find({ fecha_vencimiento: { $lt: fechaActual } });

        res.status(200).json(productosVencidos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener productos vencidos", error: error.message });
    }
});

//productos proximos a vencer
rutas.get('/productosProximosAVencer', async (req, res) => {
    try {
        const fechaActual = new Date();
        const fechaLimite = new Date();
        fechaLimite.setMonth(fechaLimite.getMonth() + 3);

        const productosProximosAVencer = await productoModel.find({
            fecha_vencimiento: { $gte: fechaActual, $lte: fechaLimite }
        });

        res.status(200).json(productosProximosAVencer);
    } catch (error) {
        res.status(500).json({ mensaje: "Error", error: error.message });
    }
});

// totales por marca
rutas.get('/CantidadPorMarca', async (req, res) => {
    try {
        const cantidadPorMarca = await productoModel.aggregate([
            {
                $group: {
                    _id: "$marca",
                    totalProductos: { $sum: "$cantidad" }
                }
            },
            {
                $sort: { totalProductos: -1 }
            }
        ]);

        res.status(200).json(cantidadPorMarca);
    } catch (error) {
        res.status(500).json({ mensaje: "Error", error: error.message });
    }
});
module.exports = rutas;