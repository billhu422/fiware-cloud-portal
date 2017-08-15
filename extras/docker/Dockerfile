FROM node:7.10.1

MAINTAINER FIWARE Cloud Portal Team. DIT-UPM

WORKDIR /opt

# Install Ubuntu dependencies
RUN apt-get update && \
	apt-get install make g++ software-properties-common python-software-properties -y && \
	apt-get install git ruby1.9.1 -y && \
	gem install sass  &&\
    apt-get install curl && \
    apt-get install lrzsz vim -y 

# Download latest version of the code and install npm dependencies
RUN git clone https://github.com/billhu422/fiware-cloud-portal.git && \
	cd fiware-cloud-portal && \
	git checkout -b hybrid tags/vh2.4 && \
	npm install && \
	./node_modules/grunt-cli/bin/grunt debug --force

RUN git clone https://github.com/billhu422/qcloudapi-sdk.git && \
        cd qcloudapi-sdk &&\
        npm install

# Run Cloud Portal
WORKDIR /opt/fiware-cloud-portal

# Install sequelize
CMD ["node", "server.js"]
