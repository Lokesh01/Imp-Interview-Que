// run `node index.js` in the terminal
const crypto = require('crypto');

function hash(value) {
  return parseInt(
    crypto.createHash('md5').update(value).digest('hex').slice(0, 8),
    16
  );
}

class ConsistentHashing {
  constructor(replicas = 10) {
    this.ring = new Map();
    this.SortedPositions = [];
    this.virtualNodes = replicas;
  }

  addServer(serverName) {
    for (let i = 0; i < this.virtualNodes; i++) {
      let virtualNode = `${serverName}#${i}`;
      let virtualPosi = hash(virtualNode);

      this.ring.set(virtualPosi, serverName);
      this.SortedPositions.push(virtualPosi);
    }

    this.SortedPositions.sort((a, b) => a - b);
  }

  getServer(key) {
    const keyHash = hash(key);

    for (let serverHash of this.SortedPositions) {
      if (keyHash <= serverHash) {
        return this.ring.get(serverHash);
      }
    }

    return this.ring.get(this.SortedPositions[0]);
  }

  printHashRing() {
    for (let hash of this.SortedPositions) {
      const serverName = this.ring.get(hash);
      console.log(`Server Position: ${hash}   Server Name: ${serverName}`);
    }
    console.log(this.SortedPositions.length);
  }
}

const hashRing = new ConsistentHashing();
hashRing.addServer('Blue');
hashRing.addServer('Red');
hashRing.addServer('Green');
hashRing.addServer('Yellow');

// hashRing.printHashRing();
console.log(hashRing.getServer('user1234'));
console.log(hashRing.getServer('user678'));
console.log(hashRing.getServer('user890'));
