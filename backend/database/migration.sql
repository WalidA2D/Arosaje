CREATE TABLE Users (
    idUsers INT PRIMARY KEY,
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
    note DECIMAL(5, 2)
);

CREATE TABLE Comments (
    idComments INT PRIMARY KEY,
    text VARCHAR(1500) NOT NULL,
    note DECIMAL(5, 2),
    publishedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    idUser INT,
    idPost INT,
    FOREIGN KEY (idUser) REFERENCES Users(idUsers),
    FOREIGN KEY (idPost) REFERENCES Posts(idPosts)
);

CREATE TABLE Posts (
    idPosts INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    publishedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dateStart TIMESTAMP NOT NULL,
    dateEnd TIMESTAMP NOT NULL,
    address VARCHAR(50) NOT NULL,
    cityName VARCHAR(50) NOT NULL,
    state BOOLEAN NOT NULL DEFAULT FALSE,
    accepted BOOLEAN NOT NULL DEFAULT FALSE,
    idUser INT,
    idPlant INT,
    FOREIGN KEY (idUser) REFERENCES Users(idUsers),
    FOREIGN KEY (idPlant) REFERENCES Plants(idPlants)
);

CREATE TABLE Plants (
    idPlants INT PRIMARY KEY,
    description VARCHAR(1000) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    requirements VARCHAR(1000) NOT NULL,
    type VARCHAR(100) NOT NULL,
    idUser INT,
    FOREIGN KEY (idUser) REFERENCES Users(idUsers)
);

CREATE TABLE Images (
    idImages INT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    url VARCHAR(255) NOT NULL,
    idPlant INT,
    FOREIGN KEY (idPlant) REFERENCES Plants(idPlants)
);

CREATE TABLE Favorites (
    idFavorites INT PRIMARY KEY,
    idPost INT,
    idUser INT,
    FOREIGN KEY (idPost) REFERENCES Posts(idPosts),
    FOREIGN KEY (idUser) REFERENCES Users(idUsers)
);

CREATE TABLE Conversations (
    idConversations INT PRIMARY KEY,
    dateStart TIMESTAMP NOT NULL,
    dateEnd TIMESTAMP NOT NULL,
    seen BOOLEAN NOT NULL DEFAULT FALSE,
    idUser1 INT,
    idUser2 INT,
    FOREIGN KEY (idUser1) REFERENCES Users(idUsers),
    FOREIGN KEY (idUser2) REFERENCES Users(idUsers)
);

CREATE TABLE Messages (
    idMessages INT PRIMARY KEY,
    text VARCHAR(500) NOT NULL,
    publishedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    idConversation INT,
    idUser INT,
    FOREIGN KEY (idConversation) REFERENCES Conversations(idConversations),
    FOREIGN KEY (idUser) REFERENCES Users(idUsers)
);
