CREATE TABLE Users (
    idUsers INTEGER PRIMARY KEY AUTOINCREMENT,
    lastName TEXT NOT NULL,
    firstName TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    cityName TEXT NOT NULL,
    password TEXT NOT NULL,
    photo TEXT,
    isBotanist INTEGER NOT NULL DEFAULT 0,
    isAdmin INTEGER NOT NULL DEFAULT 0,
    isBan INTEGER NOT NULL DEFAULT 0,
    note REAL,
    uid TEXT NOT NULL DEFAULT ''
);

CREATE TABLE Comments (
    idComments INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    note REAL,
    publishedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    idUser INTEGER,
    idPost INTEGER,
    FOREIGN KEY (idUser) REFERENCES Users(idUsers),
    FOREIGN KEY (idPost) REFERENCES Posts(idPosts)
);

CREATE TABLE Posts (
    idPosts INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    publishedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dateStart TIMESTAMP NOT NULL,
    dateEnd TIMESTAMP NOT NULL,
    address TEXT NOT NULL,
    cityName TEXT NOT NULL,
    state INTEGER NOT NULL DEFAULT 0,
    accepted INTEGER NOT NULL DEFAULT 0,
    acceptedBy INTEGER,
    idUser INTEGER, 
    plantOrigin TEXT,
    plantRequirements TEXT,
    plantType TEXT,
    image1 TEXT,
    image2 TEXT,
    image3 TEXT,
    FOREIGN KEY (idUser) REFERENCES Users(idUsers),
    FOREIGN KEY (acceptedBy) REFERENCES Users(idUsers)
);

CREATE TABLE Favorites (
    idFavorites INTEGER PRIMARY KEY AUTOINCREMENT,
    idPost INTEGER,
    idUser INTEGER,
    FOREIGN KEY (idPost) REFERENCES Posts(idPosts),
    FOREIGN KEY (idUser) REFERENCES Users(idUsers)
);

CREATE TABLE Conversations (
    idConversations INTEGER PRIMARY KEY AUTOINCREMENT,
    dateStart TIMESTAMP NOT NULL,
    dateEnd TIMESTAMP NOT NULL,
    seen INTEGER NOT NULL DEFAULT 0,
    idUser1 INTEGER,
    idUser2 INTEGER,
    FOREIGN KEY (idUser1) REFERENCES Users(idUsers),
    FOREIGN KEY (idUser2) REFERENCES Users(idUsers)
);

CREATE TABLE Messages (
    idMessages INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    publishedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    idConversation INTEGER,
    idUser INTEGER,
    FOREIGN KEY (idConversation) REFERENCES Conversations(idConversations),
    FOREIGN KEY (idUser) REFERENCES Users(idUsers)
);
