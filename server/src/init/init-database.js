const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');

let database;

async function initDatabase() {
  const client = new MongoClient('mongodb://localhost:6000');

  try {
    await client.connect();
    database = client.db('my_db');
    await initAdmin();
    await initQuizzes();
  } finally {
    await client.close();
  }
}

async function initAdmin() {
  const usersCollection = database.collection('users');

  let admin = await usersCollection.findOne({ email: 'quiz@admin.com' });

  if (admin) {
      console.log('The admin is already present.');
      console.log(admin, '\n');
      return;
  }

  admin = {
      _id: new ObjectId('000000000000000000000000'),
      email: 'quiz@admin.com',
      nickname: 'admin',
      password: 'admin123',
      score: 0,
      finishedQuizzes: []
  };

  await usersCollection.insertOne(admin);

  console.log('The admin is created successfully.');
  console.log(admin, '\n');
}

async function initQuizzes() {
  const quizzesCollection = database.collection('quizzes');

  const data = fs.readFileSync('./src/init/quizzes.json', 'utf8');
  
  if (!data) {
    console.error("Error reading file: './src/init/quizzes.json'");
    return;
  }

  const quizzes = JSON.parse(data);

  for (let i = 0; i < quizzes.length; i++) {
    let title = '';
    switch (i) {
      case 0:
        title = 'TypeScript';
        break;
      case 1:
        title = 'Angular';
        break;
      case 2:
        title = 'MongoDB';
        break;
      case 3:
        title = 'Webfejlesztés';
        break;
    }
    let quiz = await quizzesCollection.findOne({ title: title });

    if (quiz) {
        console.log(`The quiz ${title} is already present.`);
        continue;
    }
    
    await quizzesCollection.insertOne(quizzes[i]);
    console.log(`The quiz ${title} is created successfully.`);
  }
}

initDatabase().catch(console.error);
