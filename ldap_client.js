// ldapsearch -x -H ldap://ldap.univ.run:389/ -b 'dc=univ-reunion,dc=fr' '(cn=Gangat Yasine)'

var ldap = require('ldapjs');
var client = ldap.createClient({
  url: 'ldap://ldapr.univ.run:389'
});

num_etud = 29000266;

var opts = {
  filter: '(supannAliasLogin=' + num_etud + ')',
  scope: 'sub'
};

result = client.search('ou=People,dc=univ-reunion,dc=fr', opts, function(err, res){

	res.on('searchEntry', function(entry) {
		json = JSON.stringify(entry.object);
		obj = JSON.parse(json);
    // console.log('entry: ' + JSON.stringify(entry.object));
    // console.log('\n');
    console.log(obj.supannEtuEtape);
  });
  res.on('searchReference', function(referral) {
    console.log('referral: ' + referral.uris.join());
  });
  res.on('error', function(err) {
    console.error('error: ' + err.message);
  });
  res.on('end', function(result) {
    console.log('status: ' + result.status);
  });
});



