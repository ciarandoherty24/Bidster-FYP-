async function processBids(event_id) {
    // Fetch all bids for the event and sort them high to low by bid amount and then by time
    const [sortedBids] = await db.query(`SELECT user_id, bid_amount, bid_quantity, bid_time FROM Bids WHERE event_id = ? ORDER BY bid_amount DESC, bid_time ASC`, [event_id]);

    // Get Total Available tickets
    const [[{event_capacity}]] = await db.query('SELECT event_capacity FROM Events WHERE event_id = ?', [event_id]);
    let ticketsAvailable = event_capacity;

    let finalTicketPrice = 0;
    let winningBids = [];

    // Iterate through sorted bids to determine winning and losing bids
    for (const bid of sortedBids) {
        if (ticketsAvailable <= 0) {
            await markBidAsLost(bid.user_id, event_id, bid.bid_amount);
            continue;
        }

        if (ticketsAvailable - bid.bid_quantity >= 0) {
            finalTicketPrice = bid.bid_amount;
            ticketsAvailable -= bid.bid_quantity;
            winningBids.push({ ...bid, quantity_received: bid.bid_quantity });
            await markBidAsWon(bid.user_id, event_id, bid.bid_amount, bid.bid_quantity);
        } else {
            // In cases where there's a tie or the remaining quantity doesn't match the winner's request
            finalTicketPrice = bid.bid_amount;
            winningBids.push({ ...bid, quantity_received: ticketsAvailable });
            await markBidAsWon(bid.user_id, event_id, bid.bid_amount, ticketsAvailable);
            ticketsAvailable = 0; // All tickets should now be allocated
        }
    }

    // Mark all remaining bids as lost
    for (const bid of sortedBids) {
        if (!winningBids.some(w => w.user_id === bid.user_id && w.bid_amount === bid.bid_amount)) {
            await markBidAsLost(bid.user_id, event_id, bid.bid_amount);
        }
    }

    console.log('Auction has ended.');
    console.log('Final Ticket Price: $', finalTicketPrice);
    console.log('Winning Bids:', winningBids);
}

// Function for updating winning bids in the database
async function markBidAsWon(user_id, event_id, bid_amount, quantity_received) {
    await db.query(`UPDATE Bids SET result = 1, quantity_received = ? WHERE user_id = ? AND event_id = ? AND bid_amount = ?`, [quantity_received, user_id, event_id, bid_amount]);
}

// Function for updating losing bids in the database
async function markBidAsLost(user_id, event_id, bid_amount) {
    await db.query(`UPDATE Bids SET result = 0 WHERE user_id = ? AND event_id = ? AND bid_amount = ?`, [user_id, event_id, bid_amount]);
}

//old verison WORKING VERSION ---------------------------------------------------------------------------------------------------------
async function processBids(event_id) {
    return new Promise((resolve, reject)=>{
        //fetch event event_capacity
        const sqlEventeventCapacity = 'SELECT event_capacity FROM Events WHERE event_id =?';
        db.query(sqlEventeventCapacity,[event_id],(err,results)=>{
            if(err) return reject(err);
            if(results.length === 0 ) return reject (new Error("Event not Found"))
            const ticketsAvailable = results[0].event_capacity;

        //fetch bids placed with event_id
        const sqlBidsPlaced = `
                SELECT Bids.user_id, Users.Username, Bids.bid_amount, Bids.bid_quantity
                FROM Bids 
                JOIN Users ON Bids.user_id = Users.UserID 
                WHERE Bids.event_id = ? 
                ORDER BY Bids.bid_amount DESC,Bids.bid_time ASC
            `;
            db.query(sqlBidsPlaced,[event_id],(err,bids)=>{
                if(err) return reject(err);
                let totalQuantity = 0;
                let finalTicketPrice = 0;
                let winningBids = [];

                const processedBids = bids.map(bid=>{
                    if(totalQuantity < ticketsAvailable){
                        totalQuantity += bid.bid_quantity;
                        winningBids.push(bid);
                        finalTicketPrice = bid.bid_amount
                    }
                    return{
                        ...bid,
                        result: totalQuantity <= ticketsAvailable
                    }
                });
                db.beginTransaction(transactionError =>{
                    if(transactionError) return reject(transactionError);
                    //update bids in database to say if they won or lost
                    const updateBid = (bid) =>{
                        return new Promise((resolveUpdate,rejectUpdate)=>{
                            const result =  bid.result ? 1:0; //1 is won and 0 is lost
                            db.query('UPDATE Bids SET result = ? WHERE user_id=? AND event_id=?',[result,bid.user_id,event_id],(updateErr,updateResult)=>{
                                if(updateErr)return rejectUpdate(err);
                                resolveUpdate();
                            });
                        });
                    };
                    //Execute all bid updates in parallel
                    Promise.all(processedBids.map(updateBid))
                    .then(()=>{
                        db.commit(commitErr=>{
                            if(commitErr){
                                db.rollback(()=>reject(commitErr));
                                return;
                            }
                            resolve({
                                finalTicketPrice,
                                winningBids
                            });
                        });
                    })
                    .catch(updateError=>{
                        db.rollback(()=>reject(updateError));
                    })
                })
            })
        })

    })
}