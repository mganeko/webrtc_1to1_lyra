# Use the offical node.js image

FROM node:10.15.3-alpine

RUN mkdir /root/work 
WORKDIR /root/work/
RUN apk add git
RUN git clone https://github.com/mganeko/webrtc_1to1.git
WORKDIR /root/work/webrtc_1to1
RUN npm install

# use tini for alpine
RUN apk add --no-cache tini
# Tini is now available at /sbin/tini
ENTRYPOINT ["/sbin/tini", "--"]

# Run the web service on container startup.
EXPOSE 8080
CMD [ "node", "server_1to1.js" ]


# --- memo -----

# -- to build ---
#$ docker build -t mganeko/webrtc_1to1 .

# -- sh ---
#$ docker run -it mganeko/webrtc_1to1 /bin/ash

# -- run --
#$ docker run -d -p 8001:8080 --name webrtc mganeko/webrtc_1to1
# --> open http://localhost:8001/

# -- run with PORT env --
#$ docker run -d -e PORT=1323 -p 8002:1323 --name webrtc mganeko/webrtc_1to1
# --> open http://localhost:8002/

# -- push to Docker Hub (hub.docker.com)
#$ docker push mganeko/webrtc_1to1
