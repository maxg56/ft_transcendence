# services/Dockerfile
# Utilisation de l'image Node.js comme base
FROM node:18 AS base

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers package.json et package-lock.json pour ne pas réinstaller les deps si ces fichiers n'ont pas changé
COPY package.json package-lock.json ./

# Installation des dépendances (en cache)
RUN npm install --frozen-lockfile

# Étape finale pour éviter de copier node_modules plusieurs fois
FROM node:18 AS final

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules

COPY $service .

CMD ["npm", "run", "dev"]
