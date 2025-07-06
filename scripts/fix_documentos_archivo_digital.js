// script para limpiar el campo archivo_digital en la base de datos
// Ejecuta este script una sola vez con: node scripts/fix_documentos_archivo_digital.js

const { sequelize } = require('../config/database');
const Documentacion = require('../models/Documentacion');

async function fixArchivos() {
  try {
    const docs = await Documentacion.findAll();
    for (const doc of docs) {
      if (doc.archivo_digital && doc.archivo_digital.startsWith('uploads/')) {
        const nuevoNombre = doc.archivo_digital.replace(/^uploads\//, '');
        doc.archivo_digital = nuevoNombre;
        await doc.save();
        console.log(`Actualizado: ${doc.id_documento} -> ${nuevoNombre}`);
      }
    }
    console.log('¡Actualización completada!');
    process.exit(0);
  } catch (err) {
    console.error('Error actualizando documentos:', err);
    process.exit(1);
  }
}

fixArchivos();
