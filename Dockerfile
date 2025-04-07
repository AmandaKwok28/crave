FROM --platform=linux/amd64 node:20-slim
# FROM --platform=linux/arm64 node:20

# Set the working directory
WORKDIR /usr/src/app

# Install Python and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm

# First, handle backend setup
WORKDIR /usr/src/app/api
COPY api/package.json api/pnpm-lock.yaml ./
RUN pnpm install

# Set up Python virtual environment
RUN python3 -m venv /usr/src/venv
ENV PATH="/usr/src/venv/bin:$PATH"

# Copy Python requirements and install
COPY api/scripts/requirements.txt ./scripts/
RUN pip3 install --upgrade pip && \
    pip3 install --no-cache-dir -r scripts/requirements.txt


# After installing Python requirements
# Create model directory first
WORKDIR /usr/src/app/api/scripts
RUN mkdir -p model_cache

# Copy only the download script first
COPY api/scripts/download_model.py ./

# Increase network timeouts and retry the model download
RUN pip3 install --upgrade pip && \
    pip3 install --no-cache-dir requests urllib3 && \
    export HTTPS_PROXY_REQUEST_TIMEOUT=300 && \
    export HUGGINGFACE_HUB_VERBOSITY=info && \
    python3 download_model.py || python3 download_model.py || python3 download_model.py

# handle frontend setup
WORKDIR /usr/src/app/web
COPY web/package.json web/pnpm-lock.yaml ./
RUN pnpm install

# Copy all source code to the root working directory
WORKDIR /usr/src/app
COPY . .
RUN cp web/.env.production web/.env
ENV NODE_ENV=production

# Build the frontend
WORKDIR /usr/src/app/web
RUN pnpm build

# Build the backend
WORKDIR /usr/src/app/api
RUN pnpm build

# Copy start script to api directory and make it executable
COPY api/scripts/start.sh ./start.sh
RUN chmod +x ./start.sh

# Expose backend port
EXPOSE 3000

WORKDIR /usr/src/app/api
CMD ["./start.sh"]