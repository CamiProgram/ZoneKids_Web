-- Script SQL para actualizar las imágenes de los productos
-- Usa URLs de Picsum Photos que tienen CORS habilitado

UPDATE producto SET imagenesUrl = '[
  "https://picsum.photos/300/300?random=1001",
  "https://picsum.photos/300/300?random=1002",
  "https://picsum.photos/300/300?random=1003"
]' WHERE id = 1 AND nombre LIKE '%Body Manga%';

UPDATE producto SET imagenesUrl = '[
  "https://picsum.photos/300/300?random=2001",
  "https://picsum.photos/300/300?random=2002",
  "https://picsum.photos/300/300?random=2003"
]' WHERE id = 2 AND nombre LIKE '%Pantalón%';

UPDATE producto SET imagenesUrl = '[
  "https://picsum.photos/300/300?random=3001",
  "https://picsum.photos/300/300?random=3002",
  "https://picsum.photos/300/300?random=3003"
]' WHERE id = 3 AND nombre LIKE '%Vestido%';

UPDATE producto SET imagenesUrl = '[
  "https://picsum.photos/300/300?random=4001",
  "https://picsum.photos/300/300?random=4002",
  "https://picsum.photos/300/300?random=4003"
]' WHERE id = 4 AND nombre LIKE '%Enterizo%';

UPDATE producto SET imagenesUrl = '[
  "https://picsum.photos/300/300?random=5001",
  "https://picsum.photos/300/300?random=5002",
  "https://picsum.photos/300/300?random=5003"
]' WHERE id = 5 AND nombre LIKE '%Cardigan%';

UPDATE producto SET imagenesUrl = '[
  "https://picsum.photos/300/300?random=6001",
  "https://picsum.photos/300/300?random=6002",
  "https://picsum.photos/300/300?random=6003"
]' WHERE id = 6 AND nombre LIKE '%Conjunto%';

UPDATE producto SET imagenesUrl = '[
  "https://picsum.photos/300/300?random=7001",
  "https://picsum.photos/300/300?random=7002",
  "https://picsum.photos/300/300?random=7003"
]' WHERE id = 7 AND nombre LIKE '%Pants%';

UPDATE producto SET imagenesUrl = '[
  "https://picsum.photos/300/300?random=8001",
  "https://picsum.photos/300/300?random=8002",
  "https://picsum.photos/300/300?random=8003"
]' WHERE id = 8 AND nombre LIKE '%Remera%';

UPDATE producto SET imagenesUrl = '[
  "https://picsum.photos/300/300?random=9001",
  "https://picsum.photos/300/300?random=9002",
  "https://picsum.photos/300/300?random=9003"
]' WHERE id = 9 AND nombre LIKE '%Pollera%';

UPDATE producto SET imagenesUrl = '[
  "https://picsum.photos/300/300?random=10001",
  "https://picsum.photos/300/300?random=10002",
  "https://picsum.photos/300/300?random=10003"
]' WHERE id = 10 AND nombre LIKE '%Jumpsuit%';
