
## specify the node base image with your desired version node:<version> specify the node base image
FROM node:7
# replace this with your application's default port
EXPOSE 8888

CMD ["ls"]

