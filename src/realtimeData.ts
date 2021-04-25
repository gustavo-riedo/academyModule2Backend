// Imports
import axios from 'axios';

// SocketIO elements
const io = require('socket.io')({
   cors: {
      origin: '*',
   },
});

// Trade rates object
const tradeRates = {
   USDtoGBP: 'no trade rate',
   GBPtoUSD: 'no trade rate',
};

function updateTradeRates() {
   axios
      .get(
         'http://apilayer.net/api/live?access_key=13ae867396defb2765bf822c2e525734&currencies=GBP&source=USD&format=1'
      )
      .then((response) => {
         const rawData = response.data;
         tradeRates.USDtoGBP = rawData.quotes.USDGBP;
      });
   axios
      .get(
         'http://apilayer.net/api/live?access_key=13ae867396defb2765bf822c2e525734&currencies=USD&source=GBP&format=1'
      )
      .then((response) => {
         const rawData = response.data;
         tradeRates.GBPtoUSD = rawData.quotes.GBPUSD;
      });
   setInterval(updateTradeRates, 86400000);
}

// Client handshake connection
io.on('connection', (client) => {
   // Client subscription event
   client.on('subscribeToRatesUpdate', () => {
      client.emit('data', tradeRates);
      setInterval(client.emit('data', tradeRates), 300000);
   });
});

// Assign the socket port
io.listen(8000);
console.log('Socket server started on port 8000 🚀');
