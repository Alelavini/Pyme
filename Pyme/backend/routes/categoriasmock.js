const express = require('express');
const router = express.Router();

let arr_CategoriasMock = [
  {
    "IdCategoria": 1,
    "Nombre": "ACCESORIOS"
  },
  {
    "IdCategoria": 2,
    "Nombre": "AUDIO"
  },
  {
    "IdCategoria": 3,
    "Nombre": "CELULARES"
  },
  {
    "IdCategoria": 4,
    "Nombre": "CUIDADO PERSONAL"
  },
  {
    "IdCategoria": 5,
    "Nombre": "DVD"
  },
  {
    "IdCategoria": 6,
    "Nombre": "FOTOGRAFIA"
  },
  {
    "IdCategoria": 7,
    "Nombre": "FRIO-CALOR"
  },
  {
    "IdCategoria": 8,
    "Nombre": "GPS"
  },
  {
    "IdCategoria": 9,
    "Nombre": "INFORMATICA"
  },
  {
    "IdCategoria": 10,
    "Nombre": "LED-LCD"
  }
];

router.get('/api/categoriasmock', async function (req, res) {
  const { Nombre } = req.query; // Captura lo que viene después del ?Nombre=

  // Si no envían el parámetro "Nombre", devolvemos todo el array directamente
  if (!Nombre) {
    return res.json(arr_CategoriasMock);
  }

  // Filtramos el array:
  const resultados = arr_CategoriasMock.filter((x) =>
    x.Nombre.toLowerCase().includes(Nombre.toLowerCase())
  );

  // Si no coincide ninguno (resultados es un array vacío), devolvemos todo
  if (resultados.length === 0) {
    return res.json(arr_CategoriasMock);
  }

  // Si encontró coincidencias, devolvemos solo los resultados
  res.json(resultados);
});

router.get('/api/categoriasmock/:id', async function (req, res) {
  let categoria = arr_CategoriasMock.find(
    (x) => x.IdCategoria == req.params.id
  );
  if (categoria) res.json(categoria);
  else res.status(404).json({ message: 'categoria no encontrado' });
});

router.post('/api/categoriasmock/', (req, res) => {
  const { Nombre } = req.body;
  let categoria = {
    Nombre,
    IdCategoria: Math.floor(Math.random()*100000),
  };

  // aqui agregar a la coleccion
  arr_CategoriasMock.push(categoria);

  res.status(201).json(categoria);
});

router.put('/api/categoriasmock/:id', (req, res) => {
  let categoria = arr_CategoriasMock.find(
    (x) => x.IdCategoria == req.params.id
  );

  if (categoria) {
    const { Nombre } = req.body;
    categoria.Nombre = Nombre;
    res.json({ message: 'categoria actualizado' });
  } else {
    res.status(404).json({ message: 'categoria no encontrado' })
  }
});

router.delete('/api/categoriasmock/:id', (req, res) => {
  let categoria= arr_CategoriasMock.find(
    (x) => x.IdCategoria == req.params.id
  );

  if (categoria) {
    arr_CategoriasMock = arr_CategoriasMock.filter(
      (x) => x.IdCategoria != req.params.id
    );
    res.json({ message: 'categoria eliminado' });
  } else {
    res.status(404).json({ message: 'categoria no encontrado' })
  }
});



module.exports = router;

