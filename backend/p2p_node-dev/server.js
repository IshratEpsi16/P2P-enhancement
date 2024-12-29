const express = require("express");
const oracledb = require("oracledb");
//import oracledb from 'oracledb';
//import dotenv from 'dotenv';
require("dotenv").config();
//const route = require('./src/routes/api/v1/authRoutes');
const cors = require("cors");
const mountRoutes = require('./src/routes');
const multer = require('multer');
const path = require("path");
const fileUpload = require('express-fileupload');
//const device = require('express-device');
const useragent = require('express-useragent');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('./src/common/api/v1/logger'); // Import the logger
const { initializeScheduler } = require("./src/common/api/v1/scheduler");
const app = express(); // Adjust the relative path as needed
const port = process.env.PORT;
const server = require('http').createServer(app);
const WebSocket = require('ws');
const wsClients = require('./src/middleware/wsClients');
const wss = new WebSocket.Server({ server });
const verifyToken = require("./src/middleware/jwtValidation");

wss.on('connection', (ws) => {
  wsClients.addClient(ws); // Add new client to the list
  console.log('New client connected');

  ws.on('close', () => {
    wsClients.removeClient(ws); // Remove client from the list on disconnect
    console.log('Client disconnected');
  });
});



app.use((req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  console.log(`${fullUrl}`);
  next();
});
// Use CORS to allow requests from your React app domain
const corsOptions = {
  // origin: ["http://p2p.ssgil.com",
  //   "https://p2p.ssgil.com",
  //   "http://localhost:3000",
  //   "http://localhost:5000",
  //   "http://localhost:3003/",
  //   "http://10.27.1.83",
  //   "http://10.35.1.20",
  //   "http://152.70.76.226",
  //   "https://152.70.76.226",], // Array of allowed origins
  origin: 'http://localhost:3001',
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};
app.use(cors());
// Enable CORS for all routes
// app.use(cors());
//app.use(device.capture());
app.use(useragent.express());
app.use(bodyParser.json({ limit: '5mb' }));
//fileUpload
app.use(fileUpload({
  defCharset: 'utf8',
  defParamCharset: 'utf8'
}));
// Use morgan to log HTTP requests to winston
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));
// Initialize the scheduler
initializeScheduler();

// Configure Oracle Database connection details
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.SECRET_KEY,
  connectString: process.env.DATABASE_URL, // e.g., 'localhost:1521/YOUR_SERVICE_NAME'
};



// // Initialize Oracle Client library
async function initializeOracleClient() {
  try {
    //oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_PATH_LOCAL });///opt/oracle/instantclient_19_20 ## D:\\instantclient_19_20
    //oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_PATH_DEV });///opt/oracle/instantclient_19_20 ## D:\\instantclient_19_20
    oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_PATH_LOCAL });///opt/oracle/instantclient_19_20 ## D:\\instantclient_19_20
  } catch (error) {
    console.error('Error initializing Oracle Client:', error);
  }
}

// Use JWT verification middleware before serving static files
//app.use('/protected-public', verifyToken, verifyToken, express.static(path.join(__dirname, '/public')));

// If you have masked paths using environment variables



// give public access for call public path
app.use(express.static(__dirname + '/public'));

app.use(process.env.po_file_path_name, verifyToken, express.static(process.env.po_file_path));

app.use(process.env.document_file_path_name, verifyToken, express.static(process.env.document_file_path));
app.use(process.env.supplier_check_file_path_name, verifyToken, express.static(process.env.supplier_check_file_path));
app.use(process.env.supplier_company_seal_file_path_name, verifyToken, express.static(process.env.supplier_company_seal_file_path));
app.use(process.env.supplier_signature_file_path_name, verifyToken, express.static(process.env.supplier_signature_file_path));
app.use(process.env.trade_or_export_license_file_path_name, verifyToken, express.static(process.env.trade_or_export_license_file_path));
app.use(process.env.ebin_file_path_name, verifyToken, express.static(process.env.ebin_file_path));
app.use(process.env.etin_file_path_name, verifyToken, express.static(process.env.etin_file_path));
app.use(process.env.agent_etin_file_path_name, verifyToken, express.static(process.env.agent_etin_file_path));


app.use(process.env.tax_rtn_ackn_slip_file_path_name, verifyToken, express.static(process.env.tax_rtn_ackn_slip_file_path));
app.use(process.env.incorporation_cirtificate_file_path_name, verifyToken, express.static(process.env.incorporation_cirtificate_file_path));
app.use(process.env.memorandum_association_file_path_name, verifyToken, express.static(process.env.memorandum_association_file_path));
app.use(process.env.authorized_signs_file_path_name, verifyToken, express.static(process.env.authorized_signs_file_path));
app.use(process.env.article_association_file_path_name, verifyToken, express.static(process.env.article_association_file_path));


app.use(process.env.prominent_clients_file_path_name, verifyToken, express.static(process.env.prominent_clients_file_path));
app.use(process.env.annual_turnover_file_path_name, verifyToken, express.static(process.env.annual_turnover_file_path));
app.use(process.env.qa_cirtificate_file_path_name, verifyToken, express.static(process.env.qa_cirtificate_file_path));
app.use(process.env.company_profile_file_path_name, verifyToken, express.static(process.env.company_profile_file_path));
app.use(process.env.recommendation_cirtificate_file_path_name, verifyToken, express.static(process.env.recommendation_cirtificate_file_path));
app.use(process.env.excellency_specialied_cirtificate_file_path_name, verifyToken, express.static(process.env.excellency_specialied_cirtificate_file_path));
app.use(process.env.company_bank_solvency_cirtificate_file_path_name, verifyToken, express.static(process.env.company_bank_solvency_cirtificate_file_path));


app.use(process.env.goods_list_file_path_name, verifyToken, express.static(process.env.goods_list_file_path));
app.use(process.env.business_premises_file_path_name, verifyToken, express.static(process.env.business_premises_file_path));
app.use(process.env.machine_manpower_list_file_path_name, verifyToken, express.static(process.env.machine_manpower_list_file_path));
app.use(process.env.profile_pic1_file_path_name, verifyToken, express.static(process.env.profile_pic1_file_path));
app.use(process.env.profile_pic2_file_path_name, verifyToken, express.static(process.env.profile_pic2_file_path));
app.use(process.env.signature_file_path_name, verifyToken, express.static(process.env.signature_file_path));
app.use(process.env.nid_or_passport_file_path_name, verifyToken, express.static(process.env.nid_or_passport_file_path));
//Profile picture added by shifat
app.use(process.env.profile_pic_file_path_name, verifyToken, express.static(process.env.profile_pic_file_path));
app.use(process.env.rfq_header_file_path_name, verifyToken, express.static(process.env.rfq_header_file_path));
//app.use(process.env.rfq_buyer_file_path_name, verifyToken, express.static(process.env.rfq_buyer_file_path));
app.use(process.env.rfq_lines_file_path_name, verifyToken, express.static(process.env.rfq_lines_file_path));
app.use(process.env.rfq_all_file_path_name, verifyToken, express.static(process.env.rfq_all_file_path));
app.use(process.env.rfq_header_term_file_path_name, verifyToken, express.static(process.env.rfq_header_term_file_path));
app.use(process.env.rfq_buyer_lines_file_path_name, verifyToken, express.static(process.env.rfq_buyer_lines_file_path));
app.use(process.env.rfq_supplier_lines_file_path_name, verifyToken, express.static(process.env.rfq_supplier_lines_file_path));
app.use(process.env.rfq_supplier_term_file_path_name, verifyToken, express.static(process.env.rfq_supplier_term_file_path));
//app.use(process.env.po_file_path_name, verifyToken, express.static(process.env.po_file_path));
app.use(process.env.banner_file_path_name, verifyToken, express.static(process.env.banner_file_path));
app.use(process.env.shipment_header_file_path_name, verifyToken, express.static(process.env.shipment_header_file_path));
app.use(process.env.invoice_mushok_file_path_name, verifyToken, express.static(process.env.invoice_mushok_file_path));





/* routes */

async function connectToDatabase() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    console.log('Connected to Oracle database as:', dbConfig.user);
    const result = await connection.execute(`SELECT * FROM XXP2P.XXP2P_USER`);

    console.log(result.rows);

    // Use the connection for database operations

    // Don't forget to close the connection when you're done
    await connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error connecting to Oracle database:', error);
  }
}

// Middleware to establish Oracle Database connection
app.use(async (req, res, next) => {
  try {
    console.log(`Trying to connect DB`);
    const connection = await oracledb.getConnection(dbConfig);
    req.dbConnection = connection;

    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3003');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
  } catch (error) {
    console.error('Error establishing Oracle Database connection:', error);
    res.status(500).json({ error: error });
  }
});

//app.use(express.static(path.join(__dirname, "uploads")));
mountRoutes(app);


// Use the route in your Express app
//app.use('/', route);

app.all("*", (req, res) => {
  let result = {
    'message': `Could't find the URL ${req.originalUrl}`,
    'status': 404,

  }
  res.status(404).json(result);
});
// Error handling middleware for Multer
// app.use((err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     // Multer error (e.g., file size exceeded)
//     let result = {
//       'message': `Error file size: ${err.message}`,
//       'status': 404,

//     }
//     res.status(400).json(result);
//   } else if (err) {
//     // Other errors (e.g., file type validation)
//     let result = {
//       'message': `Error file type: ${err.message}`,
//       'status': 400,

//     }
//     res.status(err.status || 400).json(result);
//   } else {
//     next();
//   }
// });


// Define a GET route for serving files with JWT verification
app.get('/files/:fileName', verifyToken, (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, 'public', fileName); // Adjust the directory as needed

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: 'File not found.' });
    }

    // Serve the file if it exists
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(500).json({ message: 'Error serving file.' });
      }
    });
  });
});

// Similar route for masked directory with environment variables
app.get(`${process.env.document_file_path_name}/:fileName`, verifyToken, (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(process.env.document_file_path, fileName);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: 'File not found.' });
    }

    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(500).json({ message: 'Error serving file.' });
      }
    });
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server ${process.env.backend_url} is running on port ${port}`);
});

initializeOracleClient()
// Call the Oracle Client initialization function
