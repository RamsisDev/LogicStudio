
DROP DATABASE IF EXISTS inventorydb;
CREATE DATABASE inventorydb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE inventorydb;


CREATE TABLE categorias (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(50)  NOT NULL,
    descripcion  VARCHAR(250)
);


CREATE TABLE productos (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL,
    descripcion  VARCHAR(500),
    precio       DECIMAL(18,2) NOT NULL,
    stock        INT NOT NULL
);

CREATE TABLE producto_categoria (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    producto_id   INT NOT NULL,
    categoria_id  INT NOT NULL,
    CONSTRAINT uq_prodcat UNIQUE (producto_id, categoria_id),
    CONSTRAINT fk_prodcat_producto
        FOREIGN KEY (producto_id)  REFERENCES productos  (id) ON DELETE CASCADE,
    CONSTRAINT fk_prodcat_categoria
        FOREIGN KEY (categoria_id) REFERENCES categorias (id) ON DELETE CASCADE
);

CREATE TABLE transacciones (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    fecha            DATETIME(6)   NOT NULL,
    tipo_transaccion VARCHAR(50)   NOT NULL,   -- COMPRA / VENTA
    detalle          LONGTEXT
);

CREATE TABLE transaccion_productos (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    transaccion_id  INT NOT NULL,
    producto_id     INT NOT NULL,
    cantidad        INT NOT NULL,
    precio_unitario DECIMAL(18,2) NOT NULL,
    precio_total    DECIMAL(18,2) NOT NULL,
    CONSTRAINT fk_txprod_transaccion
        FOREIGN KEY (transaccion_id) REFERENCES transacciones (id) ON DELETE CASCADE,
    CONSTRAINT fk_txprod_producto
        FOREIGN KEY (producto_id)    REFERENCES productos     (id) ON DELETE CASCADE
);

INSERT INTO categorias (nombre)
VALUES ('Electrónica'), ('Accesorios');

INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
('Laptop',  '14-inch 16 GB RAM', 799.99,  50),
('Mouse',   'Ergonómico USB',     19.90, 150),
('Teclado', 'Mecánico',           29.90, 120);

INSERT INTO producto_categoria (producto_id, categoria_id) VALUES
(1, 1),
(2, 1),
(2, 2),
(3, 1),
(3, 2);

INSERT INTO transacciones (fecha, tipo_transaccion, detalle)
VALUES (NOW(6), 'VENTA', 'Venta web #1001');
SET @TxId := LAST_INSERT_ID();

INSERT INTO transaccion_productos
        (transaccion_id, producto_id, cantidad, precio_unitario, precio_total)
VALUES  (@TxId, 1, 1, 799.99, 799.99),  
        (@TxId, 2, 2,  19.90,  39.80);
        
        
        
        
        
/*/conectar a la db con el urser local