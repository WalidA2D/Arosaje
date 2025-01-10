import { UserInstance } from './User';
import { PostInstance } from './Post';
import { CommentInstance } from './Comment';
import { MessageInstance } from './Message';
import { ConversationInstance } from './Conversation';
import { FavInstance } from './UserFavorites';
import { UsersConversationsInstance } from './UserConversations';

// User Associations
UserInstance.hasMany(PostInstance, { foreignKey: 'idUser', as: 'posts' });
UserInstance.hasMany(CommentInstance, { foreignKey: 'idUser', as: 'comments' });
UserInstance.belongsToMany(PostInstance, { through: FavInstance, foreignKey: 'idUser', as: 'favorites' });
UserInstance.belongsToMany(ConversationInstance, { through: UsersConversationsInstance, foreignKey: 'idUser', as: 'conversations' });

// Post Associations
PostInstance.belongsTo(UserInstance, { foreignKey: 'idUser' });
PostInstance.hasMany(CommentInstance, { foreignKey: 'idPost', as: 'comments' });
PostInstance.belongsToMany(UserInstance, { through: FavInstance, foreignKey: 'idPost', as: 'users' });

// Comment Associations
CommentInstance.belongsTo(PostInstance, { foreignKey: 'idPost' });
CommentInstance.belongsTo(UserInstance, { foreignKey: 'idUser' });

// Message Associations
MessageInstance.belongsTo(UserInstance, { foreignKey: 'idUser' });
MessageInstance.belongsTo(ConversationInstance, { foreignKey: 'idConversation' });

// Conversation Associations
UsersConversationsInstance.belongsTo(ConversationInstance, { foreignKey: 'idConversation' });
ConversationInstance.hasMany(UsersConversationsInstance, { foreignKey: 'idConversation' });


// UsersConversations Associations
UsersConversationsInstance.belongsTo(UserInstance, { foreignKey: 'idUser' });
UsersConversationsInstance.belongsTo(ConversationInstance, { foreignKey: 'idConversation' });

// Fav Associations
FavInstance.belongsTo(UserInstance, { foreignKey: 'idUser' });
FavInstance.belongsTo(PostInstance, { foreignKey: 'idPost' });
