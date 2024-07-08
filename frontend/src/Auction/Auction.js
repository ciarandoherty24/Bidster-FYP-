
// get all bids for event, order them and set Bid Price
async function processBids(event_id) {
  //fetch event capacity
  const [event] = await db.query('SELECT event_capacity FROM Events WHERE event_id = ?', [event_id]);
  const capacity = event[0].event_capacity;

  //fetch top bids ordered from high to low
  const [bids] = await db.query('SELECT * FROM Bids WHERE event_id = ? ORDER BY bid_amount DESC LIMIT ? ', [event_id,capacity]);
  
  //set lowest bid to End Price
  const winningBidPrice = bids[bids.length-1].bid_amount;

  console.log(`Auction Result for event ${event_name}: $${winningBidPrice}`)

}

module.exports = processBids;
  