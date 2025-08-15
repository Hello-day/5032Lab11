// Alibaba Cloud Function Compute - Cloud function for counting books
// Deploy to Alibaba Cloud Function Compute Service

exports.handler = async (event, context) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  console.log('Context info:', JSON.stringify(context, null, 2));
  
  // Set CORS headers to allow frontend access
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  // Get HTTP method - Alibaba Cloud Function Compute event structure
  const method = event.method || event.httpMethod || 'GET';
  console.log('HTTP method:', method);

  // Handle preflight requests
  if (method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: headers,
      body: ''
    };
  }

  try {
    // Support GET and POST requests
    if (method !== 'GET' && method !== 'POST') {
      return {
        statusCode: 405,
        headers: headers,
        body: JSON.stringify({
          success: false,
          error: `Unsupported HTTP method: ${method}`,
          supportedMethods: ['GET', 'POST']
        })
      };
    }

    // Mock JSON data (in actual deployment, you can get from OSS or database)
    const authorsData = [
      {
        "id": 1,
        "name": "Jane Austen",
        "birthYear": 1775,
        "genres": ["Romance", "Social commentary"],
        "famousWorks": [
          { "title": "Pride and Prejudice", "year": 1813 },
          { "title": "Sense and Sensibility", "year": 1811 }
        ]
      },
      {
        "id": 2,
        "name": "George Orwell",
        "birthYear": 1903,
        "genres": ["Dystopian", "Political satire"],
        "famousWorks": [
          { "title": "1984", "year": 1949 },
          { "title": "Animal Farm", "year": 1945 }
        ]
      },
      {
        "id": 3,
        "name": "Agatha Christie",
        "birthYear": 1890,
        "genres": ["Mystery", "Crime fiction"],
        "famousWorks": [
          { "title": "Murder on the Orient Express", "year": 1934 },
          { "title": "Death on the Nile", "year": 1937 }
        ]
      }
    ];

    // Statistics logic
    const authorsCount = authorsData.length;
    const totalBooks = authorsData.reduce((total, author) => {
      return total + author.famousWorks.length;
    }, 0);

    // Build detailed information
    const authorDetails = authorsData.map(author => ({
      name: author.name,
      bookCount: author.famousWorks.length,
      books: author.famousWorks.map(work => work.title)
    }));

    // Return result
    const result = {
      success: true,
      data: {
        authorsCount: authorsCount,
        totalBooks: totalBooks,
        authors: authorDetails,
        message: "Book counting completed - via Alibaba Cloud Function Compute"
      },
      timestamp: new Date().toISOString(),
      cloudProvider: "Alibaba Cloud Function Compute"
    };

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Cloud function execution error:', error);
    
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};
