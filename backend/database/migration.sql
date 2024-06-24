CREATE TABLE Users (
    idUsers INTEGER PRIMARY KEY AUTOINCREMENT,
    lastName VARCHAR(50) NOT NULL,
    firstName VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    address VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    cityName VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    photo VARCHAR(255),
    isBotanist BOOLEAN NOT NULL DEFAULT FALSE,
    isAdmin BOOLEAN NOT NULL DEFAULT FALSE,
    isBan BOOLEAN NOT NULL DEFAULT FALSE,
    note DECIMAL(5, 2),
    uid varchar(50) NOT NULL DEFAULT ''
);

CREATE TABLE Comments (
    idComments INTEGER PRIMARY KEY AUTOINCREMENT,
    text VARCHAR(1500) NOT NULL,
    note DECIMAL(5, 2),
    publishedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    idUser INTEGER,
    idPost INTEGER,
    FOREIGN KEY (idUser) REFERENCES Users(idUsers),
    FOREIGN KEY (idPost) REFERENCES Posts(idPosts)
);

CREATE TABLE Posts (
    idPosts INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    publishedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dateStart TIMESTAMP NOT NULL,
    dateEnd TIMESTAMP NOT NULL,
    address VARCHAR(50) NOT NULL,
    cityName VARCHAR(50) NOT NULL,
    state BOOLEAN NOT NULL DEFAULT FALSE,
    accepted BOOLEAN NOT NULL DEFAULT FALSE,
    acceptedBy INTEGER,
    idUser INTEGER,
    idPlant INTEGER,
    FOREIGN KEY (idUser) REFERENCES Users(idUsers),
    FOREIGN KEY (idPlant) REFERENCES Plants(idPlants),
    FOREIGN KEY (acceptedBy) REFERENCES Users(idUsers)
);

CREATE TABLE Plants (
    idPlants INTEGER PRIMARY KEY AUTOINCREMENT,
    description VARCHAR(1000) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    requirements VARCHAR(1000) NOT NULL,
    type VARCHAR(100) NOT NULL,
    idUser INTEGER,
    FOREIGN KEY (idUser) REFERENCES Users(idUsers)
);

CREATE TABLE Images (
    idImages INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(50) NOT NULL,
    url VARCHAR(255) NOT NULL,
    idPlant INTEGER,
    FOREIGN KEY (idPlant) REFERENCES Plants(idPlants)
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
    seen BOOLEAN NOT NULL DEFAULT FALSE,
    idUser1 INTEGER,
    idUser2 INTEGER,
    FOREIGN KEY (idUser1) REFERENCES Users(idUsers),
    FOREIGN KEY (idUser2) REFERENCES Users(idUsers)
);

CREATE TABLE Messages (
    idMessages INTEGER PRIMARY KEY AUTOINCREMENT,
    text VARCHAR(500) NOT NULL,
    publishedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    idConversation INTEGER,
    idUser INTEGER,
    FOREIGN KEY (idConversation) REFERENCES Conversations(idConversations),
    FOREIGN KEY (idUser) REFERENCES Users(idUsers)
);
