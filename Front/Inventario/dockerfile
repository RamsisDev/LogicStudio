# Etapa 1: imagen base con Node
FROM node:22-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto
COPY package*.json ./
COPY angular.json ./
COPY tsconfig*.json ./
COPY . .

# Instala dependencias
RUN npm install -g @angular/cli && npm install

# Expone el puerto 4200
EXPOSE 4200

# Comando para levantar el servidor Angular
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
