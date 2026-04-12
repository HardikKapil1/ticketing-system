# 1. Start with Node base image
FROM node:22-alpine

# 2. Set working directory inside container
WORKDIR /app

# 3. Copy package.json first
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy rest of the code
COPY . .

# 6. Build the app
RUN npm run build

# 7. Start the app
EXPOSE 3001
CMD ["npm", "run", "start"]