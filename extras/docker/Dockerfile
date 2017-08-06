#FROM ubuntu:14.04
FROM node:7.10.1

MAINTAINER FIWARE Cloud Portal Team. DIT-UPM

WORKDIR /opt

# Install Ubuntu dependencies
RUN apt-get update && \
	apt-get install make g++ software-properties-common python-software-properties -y && \
#	sudo add-apt-repository ppa:chris-lea/node.js -y && \
#	sudo apt-get update && \
#	sudo apt-get install nodejs git ruby1.9.1 -y && \
	apt-get install git ruby1.9.1 -y && \
	gem install sass  &&\
        apt install curl 

# Download latest version of the code and install npm dependencies
RUN git clone https://github.com/billhu422/fiware-cloud-portal.git && \
	cd fiware-cloud-portal && \
	git checkout hybrid && \
	npm install && \
	./node_modules/grunt-cli/bin/grunt debug --force

RUN git clone https://github.com/billhu422/qcloudapi-sdk.git && \
        cd qcloudapi-sdk &&\
        npm install

# Run Cloud Portal
WORKDIR /opt/fiware-cloud-portal

# Install sequelize
CMD ["node", "server.js"]
