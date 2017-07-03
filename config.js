var config = {};

config.process_user = '';
config.process_group = '';

// nav bar portals
config.fiportals = {
    // Mandatory portals
    'Cloud': 'http://192.168.87.152',
    'Account': 'http://192.168.87.152:8000',
    'Help&info': 'http://192.168.87.152'
    // Another portals
    //,'': ''
};

// Mandatory. TCP port to bind the server to
config.http_port = 80;

// Set this var to undefined if you don't want the server to listen on HTTPS
config.https = {
    enabled: false,
    cert_file: 'ssl/cert.pem',
    key_file: 'ssl/key.pem',
    port: 443
};

config.useIDM = true;

// OAuth configuration. Only set this configuration if useIDM is true.
config.oauth = {
    account_server: 'http://192.168.87.152:8000',
    client_id: 'ed8a6f15356b47a7b0e74436ccbf9622',
    client_secret: '035b8677459e47f3ab885fb818500c9c',
    callbackURL: 'http://192.168.87.152/login'
};

// Keystone configuration.
config.keystone = {
        version: 3,
	host: '192.168.87.152',
	port: '5000',
	admin_host: '192.168.87.152',
	admin_port: '35357', 
	username: '21192900@qq.com',
	password: 'qaz123',
	tenantId: '',
};

//qcloud account
config.qcloud = {
        SecretId: 'AKIDJUTGrGYTQAlGvRoBKJ8mEbmnMp7LnRDn',
        SecretKey: 'hEammaiiXTGzXv9C9zdIrXO4Zs21xAD8',
};

config.time_stats_logger = false;

// Number of cores to use
// If set to 0 or to a higher number than the max available, it uses all of them.
config.max_cores = 1;

module.exports = config;
