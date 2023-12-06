const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 4000;

// Middleware to serve static files (e.g., HTML, CSS, JS)
app.use(express.static('html'));

app.use(express.json());

// Middleware for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Route for create-account.html
app.get('/create-account', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'create-account.html'));
});

// Route for reservation.html
app.get('/reservation', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'reservation.html'));
});

//Route for incident report
app.get('/incident-report', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'report-incident.html'));
});

//Route for feedback.html
app.get('/feedback', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'feedback.html'));
});

app.post('/submit-account-creation', (req, res) => {
    // ... existing code for handling account creation
    const { username, password, dob, email, phone, ccn, notifications } = req.body;

    let notificationsStr = '';

    if (Array.isArray(notifications)) {
        // If notifications is an array (multiple checkboxes checked)
        notificationsStr = notifications.join(';');
    } else if (notifications) {
        // If only one checkbox is checked, it's a string, not an array
        notificationsStr = notifications;
    }

    const userData = `${username},${password},${dob},${email},${phone},${ccn},${notificationsStr}\n`;

    fs.appendFile('user_data.csv', userData, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error writing to file');
        }
        res.send('Account created successfully');
    });
});

app.post('/submit-reservation', (req, res) => {
    // ... existing code for handling reservation submission
    const {
        'rider-name': riderName,
        passengers,
        carpool,
        date,
        length,
        'wait-leave': waitLeave,
        pickup,
        dropoff
    } = req.body;

    // Convert carpool checkbox to a more readable format
    const carpoolStatus = carpool ? 'Yes' : 'No';

    const reservationData = `${riderName},${passengers},${carpoolStatus},${date},${length},${waitLeave},${pickup},${dropoff}\n`;

    // Append the data to reservation.csv
    fs.appendFile('reservation.csv', reservationData, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error writing to file');
        }
        res.send('Reservation submitted successfully');
    });
});


app.post('/feedback-file', (req, res) => {
    const { feedback } = req.body;

    const userData = `${feedback}\n`;

    fs.appendFile('feedback.csv', userData, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error writing to file');
        }
        res.send('feedback sent successfully');
    });
});

app.post('/incident-report', (req, res) => {

    const { date, complaint } = req.body;

    const incident = `${date},${complaint}\n`;

    fs.appendFile('incident_report.csv', incident, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error writing to file');
        }
        res.send('incident reported successfully');
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
