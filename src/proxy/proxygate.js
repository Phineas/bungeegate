var net = require("net");

var ProxyGate = function() {};

function to(dst_host, dst_port) {
  var proxy = new ProxyGate();
  proxy.dstHost = dst_host;
  proxy.dstPort = dst_port;
  proxy.mwre = [];
  return proxy;
};

ProxyGate.prototype.use = function(fn) {
  this.mwre.push(fn);
  return this;
}

ProxyGate.prototype._handle = function(buffer, source, destination, out) {
  var evt = {
    "buf": buffer,
    "src": source,
    "dst": destination,
    "out": out
  };
  var next = ProxyGate.npbr;
  for(var i = this.mwre.length - 1; i >= 0; i--) {
    next = this.mwre[i].bind(this, evt, next);
  }
  next();
  return this;
};

ProxyGate.prototype.listen = function(port) {
  var self = this;
  this.server = net.createServer(function (gateInterpret) {
    var preBased = [];
    gateInterpret.on("data", pre = function(data) {
      preBased.push(data);
    });

    var proxiedGateConnection = net.connect(self.dstPort, self.dstHost, function() {
      gateInterpret.removeListener("data", pre);
      while(preBased.length) {
        self._handle(preBased.shift(), gateInterpret, proxiedGateConnection, true);
      }
      gateInterpret.on("data", function(buf) {
        self._handle(buf, gateInterpret, proxiedGateConnection, true);
      });
      proxiedGateConnection.on("data", function(buf) {
        self._handle(buf, proxiedGateConnection, gateInterpret, false);
      });
      sockA.on("end", function() {
        proxiedGateConnection.removeAllListeners();
        proxiedGateConnection.end();
      });
      proxiedGateConnection.on("end", function() {
        console.log("sockB end");
        gateInterpret.on.removeAllListeners();
        gateInterpret.on.end();
      });
    });
  });
  this.server.listen(port);
  return this;
};

ProxyGate.npbr = function() {};

function proxyData(evt, next) {
  evt.dst.write(evt.buf);
  next();
};

ProxyGate.handleBungee = function(host) {
  return new Promise(function(resolve, reject) {
    let ip = host.split(':');
    to(ip[0], ip[1]).use(proxyData).listen(25565);
    resolve(ip[0]);
  });
}

module.exports = ProxyGate;
