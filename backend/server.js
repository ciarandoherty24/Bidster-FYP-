
const express = require('express')
const mysql = require('mysql')
const cors = require('cors') 
//password hashing
const bcrypt = require('bcrypt');
const saltRounds=10;
//Json Web Token for Authorization
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

//NODE CRON FOR SCHEDULING EVENTS
const cron = require('node-cron');

//Database Connection
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"BidmasterV1.1"
})
//GET ALL MUSIC EVENT DETAILS INCLUDING THEIR AUCTION DETAILS
app.get('/home', (req, res) => {
    const sql = `
        SELECT Events.*, Auctions.start_time, Auctions.end_time 
        FROM Events 
        JOIN Auctions ON Events.event_id = Auctions.event_id
        WHERE Events.event_type = 'music'
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching events and auction times:', err);
            res.status(500).send('Error fetching events and auction times');
            return;
        }
        //console.log('Data to be sent :',result);
        res.json(result);
    });
});
//GET ALL EVENT DATA INCLUDING AUCTION DATA
app.get('/allEvents', (req, res) => {
    const sql = `
        SELECT Events.*, Auctions.start_time, Auctions.end_time 
        FROM Events 
        JOIN Auctions ON Events.event_id = Auctions.event_id`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching events and auction times:', err);
            res.status(500).send('Error fetching events and auction times');
            return;
        }
        //console.log('Data to be sent:',result);
        res.json(result);
    });
});
//GET ALL CINEMA EVENT DETAILS INCLUDING THEIR AUCTION DETAILS
app.get('/cinema', (req, res) => {
    const sql = `
        SELECT Events.*, Auctions.start_time, Auctions.end_time 
        FROM Events
        JOIN Auctions ON Events.event_id = Auctions.event_id
        WHERE Events.event_type = 'cinema'
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching events and auction times:', err);
            res.status(500).send('Error fetching events and auction times');
            return;
        }
        //console.log('Data to be sent:',result);
        res.json(result);
    });
});


//GET ALL USER DATA
app.get('/users', (req,res)=>{
    const sql = "SELECT * FROM Users";
    db.query(sql,(err,result)=>{
        if(err) return res.json({Message: "Error inside server"});
        return res.json(result);
    })
})
//REGISTER USERS 
app.post('/register', (req, res) => {
    const { email, password, firstname,lastname } = req.body;
    let { username } = req.body;
    //IF USERNAME NOT PROVIDED SET IT AS EMAIL
    username = username || email; 
    // BCRYPT HASHING FOR PASSWORD SECURITY
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error hashing password" });
        }
        //SQL INSERT STATEMENT FOR INSERTING NEW USERS INTO TABLE
        const sql = "INSERT INTO Users (Username, Email,FirstName,LastName) VALUES (?, ?, ?,?)";
        db.query(sql, [username, email,firstname,lastname], (error, results) => {
            if (error) {
                console.error(error);
                //IF THERE IS ALREADY A USER ASSIGNED WITH DETAILS THROW ERROR
                if (error.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: "Email or Username already exists" });
                }
                return res.status(500).json({ message: "Error registering new user" });
            }
            res.status(201).json({ message: "User registered successfully", userId: results.insertId });
        });
    });
});
/*
//Verify JsonWebToken
const verifyJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access token is required for authentication." });
    }

    jwt.verify(token, "jwtSecret", (err, decoded) => {
        if (err) {
            return res.status(401).json({ auth: false, message: "Failed to authenticate token." });
        }

        
        const sql = "SELECT * FROM Users WHERE id = ?";
        db.query(sql, [decoded.id], (err, user) => {
            if (err) {
                return res.status(500).json({ message: "Error fetching user from database." });
            }
            if (user.length === 0) {
                return res.status(404).json({ message: "User not found." });
            }
            req.user = user[0];
            next();
        });
    });
};
*/

//USER SIGN IN
app.post('/signin', (req, res) => {
    const { email, password } = req.body;

    //CHECK DATABASE FOR USER WITH CORRESPONDING EMAIL
    const sql = "SELECT * FROM Users WHERE Email = ?";
    db.query(sql, [email], (err, users) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
        //IF NOT USERS RETURNED
        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = users[0];
        //AUTHENTICATE PASSWORD
        bcrypt.compare(password, user.PasswordHash.toString(), (err, isMatch) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Server Error during password authentication" });
            }
            //IF PASSWORD DOESNT MATCH
            if (!isMatch) {
                return res.status(401).json({ message: "Incorrect Password" });
            }

            const id = users[0].id
            //CREATE JWT TOKEN
            const token = jwt.sign({id},'jwtSecret',{ 
            //EXPIRY TIME
            expiresIn:300,//5MINS
            }) 

            // CORRECT PASSWORD
            return res.json({ message: "Correct Password",user: { UserID: user.UserID, Username: user.Username, Email: user.Email, FirstName: user.FirstName,LastName: user.LastName, CreatedAt:user.CreatedAt, IsActive: user.IsActive, UpdatedAt:user.UpdatedAt,Role:user.Role, PasswordHash:user.PasswordHash } });

            });
        });
});
//USER SETTINGS 
  // PUT FOR UPDATING DETAILs
app.put('/settings/:UserId/edit', async (req, res) => {
    //USER ID FROM URL
    const { UserId } = req.params;
    const { username, email, firstName, lastName,  } = req.body;
    try {
        let sql = "UPDATE Users SET Username = ?, Email = ?, FirstName = ?, LastName = ? WHERE UserID = ?";
        let params = [username, email, firstName, lastName];
        params.push(UserId);

        db.query(sql, params, (err, result) => {
            if (err) {
                console.error('Error updating users details:', err);
                return res.status(500).send('Error updating user details');
            }
            return res.send({ message: 'User details updated successfully' });
        });
    } catch (err) {
        console.error('Error updating user settings:', err);
        res.status(500).send('Error updating user settings');
    }
});



//GET SPECIFIC EVENT AND AUCTION DETAILS BY EVENT_ID
app.get('/events/:event_id', (req, res) => {
    //GET EVENT_ID FROM URL
    const { event_id } = req.params;
    const sql = 
            `SELECT e.*, a.min_price, a.start_time, a.end_time
            FROM Events e
            LEFT JOIN Auctions a ON e.event_id = a.event_id
            WHERE e.event_id = ?`;
    db.query(sql, [event_id], (err, results) => {
        if (err) {
            console.error("Failed to fetch event and auction details:", err);
            return res.status(500).json({ message: "Error fetching event and auction details" });
        }
        //IF NO RESULTS RETURNED
        if (results.length === 0) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json(results[0]);
    });
});

//ADMIN SETTINGS
//ADD NEW EVENT ALONG WITH ITS AUCTION
app.post('/addevent', (req, res) => {
    const { eventName, eventDesc, eventDate, eventLocation, eventURL,eventCapacity, startingPrice, minimumPrice, priceDropRate, auctionStartTime, auctionEndTime, eventType } = req.body;
    //ENSURE ALL DATA IS SENT
    if (!eventName || !eventDesc || !eventDate || !eventLocation || !eventURL || !eventCapacity || !minimumPrice || !auctionStartTime || !auctionEndTime || !eventType) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    //INSERT NEW EVENT DATA
    const eventsql = "INSERT INTO Events (event_name, description, event_location, event_date, image_url, event_capacity,event_type) VALUES (?, ?, ?, ?, ?,?,?)";
    db.query(eventsql, [eventName, eventDesc, eventLocation, eventDate, eventURL, eventCapacity,eventType], (eventError, eventResults) => {
        if (eventError) {
            console.error(eventError);
            return res.status(500).json({ message: "Error adding event" });
        }
        //SET EVENTID TO LAST INSERTED ID IN EVENT TABLE
        const eventId = eventResults.insertId;
        //INSERT AUCTION DATA CORRESPONDING TO EVENT DATA
        const auctionsql = "INSERT INTO Auctions (event_id, min_price,start_time, end_time) VALUES (?, ?, ?, ?)";
        db.query(auctionsql, [eventId,minimumPrice, auctionStartTime, auctionEndTime], (auctionError, auctionResults) => {
            if (auctionError) {
                console.error(auctionError);
                return res.status(500).json({ message: "Error adding auction data" });
            }
            res.status(201).json({ message: "Event and Auction added successfully", eventId: eventId, auctionId: auctionResults.insertId });
        });
    });
});
//EDIT EVENT
app.put('/events/:event_id', (req, res) => {
    //GET EVENT ID FROM URL
    const { event_id } = req.params;
    const { eventName, eventDesc, eventDate, eventLocation, eventURL, eventCapacity, eventType, minimumPrice, auctionStartTime, auctionEndTime } = req.body;
    //CHECK THAT ALL DATA HAS BEEN SENT
    if (!eventName || !eventDesc || !eventDate || !eventLocation || !eventURL || !eventCapacity || !minimumPrice || !auctionStartTime || !auctionEndTime || !eventType) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    //BEGIN DATABASE TRANSACTION
    db.beginTransaction(err => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error starting transaction" });
        }

        //UPDATE THE EVENT DETAILS
        const updateEventSql =
        `UPDATE Events 
        SET event_name = ?, description = ?, event_location = ?, event_date = ?, image_url = ?, event_capacity = ?, event_type=?
        WHERE event_id = ?`;

        db.query(updateEventSql, [eventName, eventDesc, eventLocation, eventDate, eventURL, eventCapacity, eventType,event_id], (error, results) => {
            if (error) {
                //ROLLBACK TRANSACTION
                db.rollback(() => {
                    console.error(error);
                    return res.status(500).json({ message: "Error updating event" });
                });
            }

            //IF EVENT DOESNT EXIST
            if (results.affectedRows === 0) {
                //ROLLBACK TRANSACTION
                db.rollback(() => {
                    return res.status(404).json({ message: "Event not found" });
                });
            } else {
                //AFTER SUCCESSFULLY UPDATING EVENT DATA, NOW UPDATE AUCTION DATA
                const updateAuctionSql = 
                `   UPDATE Auctions
                    SET min_price = ?, start_time = ?, end_time = ?
                    WHERE event_id = ?`;
                db.query(updateAuctionSql, [ minimumPrice, auctionStartTime, auctionEndTime, event_id], (auctionError, auctionResults) => {
                    if (auctionError) {
                        //ROLLBACK TRANSACTION
                        db.rollback(() => {
                            console.error(auctionError);
                            return res.status(500).json({ message: "Error updating auction data" });
                        });
                    }

                    //IF ALL UPDATES ARE SUCCESSFULL, COMMIT TRANSACTION TO DATABASE
                    db.commit(commitErr => {
                        if (commitErr) {
                            //ROLLBACK TRANSACTION IF ERROR
                            db.rollback(() => {
                                console.error(commitErr);
                                return res.status(500).json({ message: "Error committing transaction" });
                            });
                        }
                        res.status(200).json({ message: "Event and Auction updated successfully" });
                    });
                });
            }
        });
    });
});

//DELETE EVENT ALONG WITH ITS AUCTION
app.delete('/events/:eventId', (req, res) => {
    //GET EVENT ID FROM URL
    const {eventId}=req.params;

    //START DATABASE TRANSACTION
    db.beginTransaction((err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error starting database transaction" });
        }
        //FIRST DELETE ALL BIDS ASSOCIATED WITH THE EVENT
        const deleteBidSql = "DELETE FROM Bids WHERE event_id = ?";
        db.query(deleteBidSql, [eventId], (error, bidResults) => {
            if (error) {
                console.error(error);
                //IF ERROR ROLL BACK TRANSACTION
                db.rollback(() => {
                    return res.status(500).json({ message: "Error deleting bids" });
                });
                return;
            }
            //DELETE AUCTIONS ASSOCIATED WITH EVENT
            const deleteAuctionSql = "DELETE FROM Auctions WHERE event_id = ?";
            db.query(deleteAuctionSql, [eventId], (error, auctionResults) => {
                if (error) {
                    console.error(error);
                    //IF ERROR ROLL BACK TRANSACTION
                    db.rollback(() => {
                        return res.status(500).json({ message: "Error deleting auction" });
                    });
                    return;
                }

                // DELETE EVENT WITH EVENT ID 
                const deleteEventSql = "DELETE FROM Events WHERE event_id = ?";
                db.query(deleteEventSql, [eventId], (error, eventResults) => {
                    if (error) {
                        console.error(error);
                        //IF ERROR ROLL BACK TRANSACTION
                        db.rollback(() => {
                            return res.status(500).json({ message: "Error deleting event" });
                        });
                        return;
                    }
                    //IF EVENT DOESNT EXIST
                    if (eventResults.affectedRows === 0) {
                        //ROLLBACK TRANSACTION
                        db.rollback(() => {
                            return res.status(404).json({ message: "Event not found" });
                        });
                        return;
                    }

                    // IF ALL TRANSACTIONS ARE SUCCESSFUL COMMIT THEM TO DATABASE
                    db.commit((commitErr) => {
                        if (commitErr) {
                            console.error(commitErr);
                            //ROLLBACK TRANSACTION
                            db.rollback(() => {
                                return res.status(500).json({ message: "Error committing transaction" });
                            });
                            return;
                        }
                        res.status(200).json({ message: "Events,associated auction, and bids deleted successfully" });
                    });
                });
            });
        });
    });
});


//PLACE NEW BID
app.post('/events/:event_id/bid', (req, res) => {
    //GET VALUES FROM THE REQUEST BODY
    const { UserID, bidAmount, quantity } = req.body;
    //GET EVENT ID FROM URL
    const { event_id } = req.params;
    //INSERT NEW BIDS INTO TABLE
    const sql = "INSERT INTO Bids (user_id, event_id, bid_amount, bid_quantity) VALUES (?, ?, ?,?)";
    db.query(sql, [UserID, event_id, bidAmount,quantity], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: "Error adding bid" });
        }
        res.status(201).json({ message: "Bid added successfully", bidId: results.insertId });
    });
});

//GET BIDS FOR SPECIFIC USER
app.get('/user/:UserID/bids', (req, res) => {
    //GET USER ID FROM URL
    const { UserID } = req.params;
    //GET ALL BIDS ALONG WITH THEIR DETAILS FROM DATABASE
    const sql = "SELECT Bids.bid_amount, Bids.event_id,Bids.result,Events.event_name FROM Bids JOIN Events ON Bids.event_id = Events.event_id WHERE Bids.user_id = ?";
    db.query(sql, [UserID], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: "Error fetching user bids" });
        }
        res.status(200).json(results);
    });
});

//QUERYPROMISE TO WRAP EXECUTE DATABASE QUERIES IN
function queryPromise(sql, params) {
    //RETURN NEW PROMISE
    return new Promise((resolve, reject) => {
      //EXECUTE  THE SQL STATEMENT
      db.query(sql, params, (err, results) => {
        if (err) {
          //IF ERROR REJECT THE PROMISE
          reject(err);
        } else {
          //IF SUCCESSFULL, RESOLVE THE PROMISE WITH THE RESULTS
          resolve(results);
        }
      });
    });
  }

//PROCESS BIDS FUNCTION
async function processBids(event_id) {
    try{
    //GET ALL BIDS WITH EVENT ID AND SORT THEM IN DESCENDING ORDER WITH THE TIME ASCENDING ORDER
    const sortedBids = await queryPromise(`SELECT user_id, bid_amount, bid_quantity, bid_time FROM Bids WHERE event_id = ? ORDER BY bid_amount DESC, bid_time ASC`, [event_id]);
    //console.log('Bids Fetched: ',sortedBids);
    //GET TOTAL TICKETS AVAILABLE
    const eventCapacityQuery = await queryPromise('SELECT event_capacity FROM Events WHERE event_id = ?', [event_id]);
    //const eventNameQuery = await queryPromise('SELECT event_name FROM Events WHERE event_id = ?',[event_id]);
    let ticketsAvailable = eventCapacityQuery[0].event_capacity;
    //let event_name = eventCapacityQuery[0].event_name;

    //VARIABLE FOR FINAL PRICE
    let finalTicketPrice = 0;
    //STACK FOR THE SET OF WINNING BIDS
    let winningBids = [];

    //ITERATE THROUGH THE SORTED BIDS AND DETERMINE WHICH ONES WON AND LOST
    for (const bid of sortedBids) {
        //IF NO TICKETS LEFT
        if (ticketsAvailable <= 0) {
            //await markBidAsLost(bid.user_id, event_id, bid.bid_amount);
            console.log('No tickets left');
            continue;
        }
        //IF ENOUGH TICKETS AVAILABLE
        if (ticketsAvailable - bid.bid_quantity >= 0) {
            //SET FINAL PRICE TO CURRENT BID AMOUNT
            finalTicketPrice = bid.bid_amount;
            //DECREASE TICKET AVAILABILITY
            ticketsAvailable -= bid.bid_quantity;
            //PUSH BIDS TO STACK
            winningBids.push({ ...bid, quantity_received: bid.bid_quantity });
            //MARK THE BIDS AS WON
            await markBidAsWon(bid.user_id, event_id, bid.bid_amount, bid.bid_quantity);
            //sendNotification(bid.user_id,"Congratulations!",`Your Bid for event ${event_id} was Won! `,'bid_won')
        } else {
            //IF BIDS REQUESTED QUANTITY EXCEEDS REMAINDER. GIVE THEM WHATEVERS LEFT OVER (PARTIAL WIN)
            //SET FINAL PRICE TO LAST BID AMOUNT
            finalTicketPrice = bid.bid_amount;
            //PUSH BID TO STACK SETTING THE QUANTITY RECIEVED TO WHATEVERS LEFT OVER
            winningBids.push({ ...bid, quantity_received: ticketsAvailable });
            //MARK BID AS WON
            await markBidAsWon(bid.user_id, event_id, bid.bid_amount, ticketsAvailable);
            //await sendNotification(bid.user_id,"Congratulations!",`Your Bid for event ${event_id} was partially Won! `,'bid_won')
            //ALL TICKETS SHOULD NOW BE ALLOCATED
            ticketsAvailable = 0; 
        }
    }

    //MARK ALL REMAINING BIDS AS LOST
    for (const bid of sortedBids) {
        if (!winningBids.some(w => w.user_id === bid.user_id && w.bid_amount === bid.bid_amount)) {
            //MARK AS LOST
            await markBidAsLost(bid.user_id, event_id, bid.bid_amount);
            //sendNotification(bid.user_id,"Unfortunetly",`Your Bid for event ${event_id} was Lost `,'bid_lost')
        }
    }
    try {
        //SET CLEARING PRICE OR FINAL PRICE IN AUCTIONS TABLE FOR EVENT
        await queryPromise(`UPDATE Auctions SET ClearingPrice = ? WHERE event_id = ?`, [ finalTicketPrice,event_id]);
        console.log('Clearing Price set:', finalTicketPrice);
    } catch (error) {
        console.error(`Error updating ClearingPrice in Database: ${event_id}:`, error);
    }
    console.log('Generating Tickets');
    //GENERATE TICKETS FOR ALL IN STACK
    generateTickets(winningBids,event_id,finalTicketPrice);
    console.log('Auction has ended.');
    console.log('Final Ticket Price: $', finalTicketPrice);
    console.log('Winning Bids:', winningBids);  
    } catch(error){
        console.error('Error Processing bids for event_id:', event_id, error);
    }
} 


//FUNCTION FOR MARKING BIDS AS WON
async function markBidAsWon(user_id, event_id,bid_amount, quantity_received) {
    console.log('Marking bids as won');
    try {
        //UPDATE BID RESULT AS WON (1) THE BID AMOUNT AND QUANTITY RECIEVED
        await queryPromise(`UPDATE Bids SET result = 1, quantity_received = ? WHERE user_id = ? AND event_id = ? AND bid_amount = ?`, [quantity_received, user_id, event_id, bid_amount]);
        //sendNotification(user_id,"Congratulations!",`Your Bid for event ${event_id} was Won! `,'bid_won')
        console.log('Bid marked as won for user:', user_id);
        //SEND NOTIFACTION TO USER 
        await sendNotification(user_id,"Congratulations!",`Your Bid for event ${event_id} was Won! `,'bid_won');
    } catch (error) {
        console.error(`Error marking bid as won for user_id: ${user_id}:`, error);
    }
}
//FUNCTION FOR MARKING BIDS AS LOST
async function markBidAsLost(user_id, event_id, bid_amount) {
    try {
        //UPDATE BID RESULT AS LOST (0) THE BID AMOUNT AND QUANTITY RECIEVED
        await queryPromise(`UPDATE Bids SET result = 0 WHERE user_id = ? AND event_id = ? AND bid_amount = ?`, [user_id, event_id, bid_amount]);
        //sendNotification(user_id,"Unfortunetly",`Your Bid for event ${event_id} was Lost `,'bid_lost')
        //console.log('Bid marked as lost for user:', user_id);
        //SEND NOTIFACTION TO USER 
        await sendNotification(user_id,"Unfortunetly",`Your Bid for event ${event_id} was Lost `,'bid_lost');
    } catch (error) {
        console.error(`Error marking bid as lost for user_id: ${user_id}:`, error);
    }
}

//FUNCTION FOR GENERATING TICKETS
async function generateTickets(winningBids, event_id,finalTicketPrice) {
    //ITERATE THROUGH WINNING BIDS
    for (const bid of winningBids) {
        try {
            //GET EVENTS DETAILS SUCH AS NAME DESCRIPTION AND USERS DETAILS FIRST LAST NAME ETC
            const eventDetails = await queryPromise('SELECT event_name, description FROM Events WHERE event_id = ?', [event_id]);
            const userDetails = await queryPromise('SELECT FirstName, LastName FROM Users WHERE UserID = ?', [bid.user_id]);
            console.log(eventDetails, userDetails);
            //SET DUMMY URL CODE PATH  **TEMPORARY** NEED TO SET UP PROPER QR CODE GENERATOR
            const QRCODE = '/An-example-of-QR-code.png'; //PATH TO DUMMY PICTURE IN FILE
            //LOOP FOR BIDS WHERE MULTIPLE TICKETS ARE WON
            for(let i=0;i<bid.quantity_received;i++){
                //CREATE DUMMY SEAT NUMBER **DEMO PURPOSES**
                const seatNumber = `A${Math.floor(Math.random() * 100)}`;

                //INSERT TICKETS INTO TABLE
                const sql = `INSERT INTO Tickets (event_id, user_id, price_paid, seat_number, status, QRCODE, event_name, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                //SET STATUS TO PAID **DEMO PURPOSES**
                const status = 'paid'; //WHEN PAYMENT FUNCTIONALITY IS SET UP THIS WILL BE CHANGED TO REFLECT A SUCCESSFUL PAYMENT
            
                await queryPromise(sql, [
                    event_id,
                    bid.user_id,
                    finalTicketPrice,
                    seatNumber,
                    status,
                    QRCODE,
                    eventDetails[0].event_name,
                    userDetails[0].FirstName,
                    userDetails[0].LastName
                ]);
                }
            
            console.log(`Tickets generated for User ID: ${bid.user_id}, Quantity: ${bid.quantity_received}`);
        } catch (error) {
            console.error('Error generating ticket for User ID:', bid.user_id, error);
        }
    }
}


//FETCH TICKETS FOR SPECIFIC USER
app.get('/user/:UserID/tickets', async (req, res) => {
    //GET USER ID FROM URL
    const { UserID } = req.params;
    try {
        //GET TICKET QUERY
        const sql = 
        `   SELECT t.*, e.event_name, e.event_date, e.event_location 
            FROM Tickets t
            JOIN Events e ON t.event_id = e.event_id
            WHERE t.user_id = ?`;
        const tickets = await queryPromise(sql, [UserID]);
        res.json(tickets);
    } catch (error) {
        console.error('Error fetching user tickets:', error);
        res.status(500).send('Error fetching user tickets');
    }
});

//FUNCTION FOR CREATING NOTIFICATIONS
async function sendNotification(user_id, title, message, type, status = 'unread'){
    try{
        //INSERT QUERY FOR NOTIFICATIONS TABLE
        const sql = `INSERT INTO Notifications (user_id, title, message, type, status) VALUES (?, ?, ?, ?, ?)`;
        await queryPromise(sql,[user_id,title,message,type,status]);
        console.log('Notification created for User:',user_id);
    }catch(error){
        console.error('Error creating notification for User: ',user_id);
    }
}


//END OF AUCTION 
app.post('/events/:event_id/endAuction',async (req,res)=>{
    //GET EVENT ID FROM URL
    const { event_id } = req.params;
    try {
        //CALL PROCESS BIDS FOR AUCTION RESULTS
        const auctionResults = await processBids(event_id);
        res.json({ message: "Auction processed successfully", auctionResults });
        //UPDATE AUCTION STATUS TO COMPLETED
        db.query("UPDATE `Auctions` SET `Status` = 'completed' WHERE `Auctions`.`event_id` = ?", [event_id], (error, results) => {
            if (error) {
                console.error("Error updating auction status:", error);
            } else {
                console.log("Auction status updated successfully");
                
            }
        });
        
    } catch (error) {
        console.error("Error processing auction:", error);
        res.status(500).send("Error processing auction");
    }
})

//GET USERS BIDS
app.get('/events/:event_id/bids/:UserID', async (req, res) => {
    //GET EVENTID AND USER ID FROM URL
    const { event_id, UserID } = req.params;

    try {
        //SQL QUERIE
        const sql = `
            SELECT bid_amount
            FROM Bids
            WHERE event_id = ? AND user_id = ?
            ORDER BY bid_amount DESC
            LIMIT 1
        `;
        db.query(sql, [event_id, UserID], (err, results) => {
            if (err) {
                console.error("Error fetching user's bid:", err);
                return res.status(500).send("Error fetching user's bid");
            }
            if (results.length === 0) {
                //IF USER HAS NOT PLACED ANY BIDS
                return res.json({ bidAmount: null });
            }
            res.json({ bidAmount: results[0].bid_amount });
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).send("Server error");
    }
});

//AUCTION RESULTS
app.get('/events/:event_id/auctionResults', async (req, res) => {
    //EVENT ID FROM URL
    const { event_id } = req.params;
    
    //CHECK AUCTIONS STATUS
    const statusSql = 'SELECT Status FROM Auctions WHERE event_id = ?';
    db.query(statusSql, [event_id], (statusErr, statusResults) => {
        if (statusErr) {
            console.error("Error fetching auction status:", statusErr);
            return res.status(500).send("Error fetching auction status");
        }
        if (statusResults.length === 0 || statusResults[0].Status !== 'completed') {
            //AUCTION WASNT FOUND OR ELSE IT HAS NOT CONCLUDED
            return res.json({ message: "Auction is still in progress", isAuctionEnded: false });
        }

        //AUCTIONS CONCLUDED NOW FETCH THE RESULTS 
        const sql = `
            SELECT Users.Username, Bids.bid_amount, Bids.result, Auctions.ClearingPrice
            FROM Bids
            INNER JOIN Users ON Bids.user_id = Users.UserID
            INNER JOIN Auctions ON Bids.event_id = Auctions.event_id
            WHERE Bids.event_id = ?
            ORDER BY Bids.bid_amount DESC,
            Bids.bid_time ASC;
        `;
        db.query(sql, [event_id], (err, results) => {
            if (err) {
                console.error("Error fetching auction results:", err);
                return res.status(500).send("Error fetching auction results");
            }
            res.json({ auctionResults: results, isAuctionEnded: true });
        });
    });
});

//GET USERS NOTIFICATIONS
app.get('/user/:UserID/notifications',async (req,res)=>{
    //GET USER ID FROM URL
    const {UserID} = req.params;
    try{
        //SQL QUERIE TO GET NOTIFICATIONS WITH USER ID
        const sql = 'SELECT * FROM Notifications WHERE user_id = ?  ORDER BY created_at DESC';
        const notificaions = await queryPromise(sql,[UserID]);
        res.json(notificaions);
    }catch(error){
        console.error('Error fetching Notifications: ',error);
        res.status(500).send('Error Fetching Notifications');
    }
})
//MARK NOTIFICATIONS AS READ
app.put('/user/:UserID/notifications/markasread', async (req,res)=>{
    //GET USER ID FROM URL
    const {UserID}=req.params;
    //GET NOTIFICATIONS ID FROM REQUEST BODY
    const {notificationIds}=req.body;
    try{
        //UPDATE NOTIFICATIONS STATUS TO READ IN TABLE
        const sql = `UPDATE Notifications SET status = 'read' WHERE user_id = ? AND notification_id IN (?)`;
        await queryPromise(sql,[UserID,notificationIds]);
        res.json({message:"Notifications marked as read successfully"});
    }catch(error){
        console.error("Error marking notifications as read: ",error);
        res.status(500).json({message:"Error marking notifications as read"});
    }
})

//CHECK AUCTION STATUS
async function checkAuctionStatus(){
    console.log('Checking for Ended Auctions and processing them.......');
    try{
        //GET ENDED AUCTIONS
        const endedAuctions = await queryPromise('SELECT * FROM Auctions WHERE end_time <= NOW() AND Status != "completed"');
        //ITERATATE THROUGH ENDED AUCTIONS
        for(const auction of endedAuctions){
            //CALL PROCESS BIDS FUNCTION
            await processBids(auction.event_id);
            //UPDATE STATUS TO COMPLETED
            await queryPromise('UPDATE Auctions SET Status = "completed" WHERE event_id = ?', [auction.event_id]);
        }
        console.log('Finished Checking');
    }catch(error){
        console.error('Error Checking and processing ended auctions: ',error);
    }
    
}
//NODE-CRON SCHEDULER FOR CHECKING FOR ENDED AUCTIONS AND PROCESSING THEM
cron.schedule('* * * * *',()=>{
    checkAuctionStatus();
})
//SERVER SETUP
//APP LISTENING ON PORT 3001
app.listen(3001,()=>{
    console.log("Listening")
});

