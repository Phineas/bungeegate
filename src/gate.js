const flog = require("fancy-log"),
      pkg = require("../package.json"),
      cnf = require("../config.json"),
      proxyHandler = require("./proxy/proxygate.js"),
      readline = require("readline"),
      rl = readline.createInterface(process.stdin, process.stdout);

global.proxies = cnf.bungees;

log("Starting BungeeGate version " + pkg.version + "...");

//proxies.forEach((proxy) => {
  proxyHandler.handleBungee("eu.badlion.net:25565").then(host => {
    log("Registered proxy " + host);
  });
//});

rl.setPrompt('-> ', 3);
rl.on('line', processCommand);

rl.on('SIGINT', () => {
  rl.question('Are you sure you want to close BungeeGate? (THIS WILL DISCONNECT ALL CONNECTED USERS) -> ', (answer) => {
    if (answer.match(/^y(es)?$/i)) {
      process.exit();
    } else {
      rl.prompt();
    }
  });
});

function processCommand(data) {
  switch(data.trim()) {
    case 'end':
      process.exit();
    default:
      log("Unknown command...");
      rl.prompt();
  }
}

function log(m) {
  readline.cursorTo(process.stdout, 0);
  flog.info(m);
  rl.prompt(true);
}
