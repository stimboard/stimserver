var config = {};

// Server configuration
config.app ={
	"port": 6969
}

// Habilitation code configuration
config.habilitationCode = {
	"ESIROI-I3" : "2283",
	"ESIROI-I2" : "2282",
	"ESIROI-I1" : "2281"
}

// Sql configuration
config.db_host = "localhost";
config.db_port = 3306;
config.db_user = "stimboard";
//config.db_password = "stimboard";
config.db_password = "dews34Sd";
config.db_name = "stimboard";


// Init module configuration
module.exports = config;
