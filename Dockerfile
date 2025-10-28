FROM nginx:alpine

# Copy SSL certificates
COPY ssl/private.key /etc/nginx/ssl/private.key
COPY ssl/certificate.crt /etc/nginx/ssl/certificate.crt

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Set proper permissions for SSL files
RUN chmod 600 /etc/nginx/ssl/private.key
RUN chmod 644 /etc/nginx/ssl/certificate.crt

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
