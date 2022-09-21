# BUILDER #
###########

# Base image
FROM registry.xeba.tech/node:14.4.0 as builder

# Arguments definition
ARG ENVIRONMENT=staging

# Environment variables
ENV METAPROJECT=maestro PROJECT=aardvark
ENV APP_DIR=/$PROJECT

# Copy files from prject
COPY . $APP_DIR

# Replace settings.js file
COPY deploy/.aardvark-frontend-$ENVIRONMENT.env $APP_DIR/src/settings.ts

# Create the home directory
WORKDIR $APP_DIR

# Build node modules
RUN npm install && npm run build

# Final #
#########

# Base image
FROM nginx:1.19.0

# Copy nginx configuration file
COPY nginx-default.conf /etc/nginx/conf.d/default.conf

# Environment variables
ENV METAPROJECT=maestro PROJECT=aardvark
ENV APP_DIR=/var/www/html/$METAPROJECT

# Create directory for static content
RUN mkdir -p $APP_DIR

# Copy files from builder
COPY --from=builder /aardvark/dist/. $APP_DIR/

