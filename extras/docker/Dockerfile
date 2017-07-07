FROM ubuntu:14.04

MAINTAINER FIWARE Cloud Portal Team. DIT-UPM

WORKDIR /opt

# Install Ubuntu dependencies
RUN sudo apt-get update && \
	sudo apt-get install make g++ software-properties-common python-software-properties -y && \
	sudo add-apt-repository ppa:chris-lea/node.js -y && \
	sudo apt-get update && \
	sudo apt-get install nodejs git ruby1.9.1 -y && \
	sudo gem install sass -v 3.2.12 -y &&\
        sudo apt install curl &&\
        sudo curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash - && \
        sudo apt-get install -y nodejs

# Download latest version of the code and install npm dependencies
RUN git clone https://github.com/billhu422/fiware-cloud-portal.git && \
	cd fiware-cloud-portal && \
	git checkout tags/5.4 && \
	npm install && \
	./node_modules/grunt-cli/bin/grunt

RUN git clone https://github.com/billhu422/qcloudapi-sdk.git && \
        cd qcloudapi-sdk &&\
        npm install

# Run Cloud Portal
WORKDIR /opt/fiware-cloud-portal

# Install sequelize
RUN npm install --save sequelize && npm install --save mysql2
CMD ["sudo", "node", "server.js"]
