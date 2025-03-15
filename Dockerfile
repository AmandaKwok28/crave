# Use Node.js image with Debian (better Python compatibility)
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

# handle frontend setup
WORKDIR /usr/src/app/web
COPY web/package.json web/pnpm-lock.yaml ./
RUN pnpm install

# Copy all source code to the root working directory
WORKDIR /usr/src/app
COPY . .

# Build the frontend
WORKDIR /usr/src/app/web
RUN pnpm build

# Build the backend
WORKDIR /usr/src/app/api
RUN pnpm build

# Expose backend port
EXPOSE 3000

WORKDIR /usr/src/app/api
CMD ["pnpm", "start"]