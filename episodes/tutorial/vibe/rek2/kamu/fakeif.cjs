const os = require('os');
os.networkInterfaces = () => ({
  lo: [{ address: '127.0.0.1', netmask: '255.0.0.0', family: 'IPv4', mac: '00:00:00:00:00:00', internal: true, cidr: '127.0.0.1/8' }],
  wlan0: [{ address: '192.168.1.23', netmask: '255.255.255.0', family: 'IPv4', mac: 'aa:bb:cc:dd:ee:ff', internal: false, cidr: '192.168.1.23/24' }],
});
require('module').syncBuiltinESMExports();
