FROM node:18

# Install system dependencies
RUN apt-get update && \
    apt-get install -y \
    build-essential \
    libcairo2-dev \
    libjpeg-dev \
    libpango1.0-dev \
    libgif-dev \
    libpango1.0-dev \
    libpixman-1-dev \
    libpangocairo-1.0-0 \
    libfontconfig1 \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

WORKDIR /opt/server/backend-test

COPY . .

RUN npm install
EXPOSE 8080
CMD [ "node", "index.js" ]
