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
   lastUpdate: 'no timestamp',
};

// Client handshake connection
io.on('connection', (client) => {
   // Updates currency rates from external API
   function updateTradeRates() {
      axios
         .get('https://www.freeforexapi.com/api/live?pairs=USDGBP,GBPUSD')
         .then((response) => {
            const rawData = response.data;
            if (rawData.rates.USDGBP.timestamp !== tradeRates.lastUpdate) {
               tradeRates.lastUpdate = rawData.rates.USDGBP.timestamp;
               tradeRates.USDtoGBP = rawData.rates.USDGBP.rate;
               tradeRates.GBPtoUSD = rawData.rates.GBPUSD.rate;
            }
            client.emit('data', tradeRates);
         });
   }

   // Client subscription event
   client.on('subscribeToRatesUpdate', () => {
      updateTradeRates();
      setInterval(updateTradeRates, 15000);
   });
});

// Assign the socket port
io.listen(8000);
console.log('Socket server started on port 8000 🚀');
