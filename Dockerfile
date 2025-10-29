FROM nginx:alpine


# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Set proper permissions for SSL files
RUN mkdir -p /etc/nginx/ssl && \
    chmod 700 /etc/nginx/ssl

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]


