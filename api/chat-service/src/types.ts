export interface Message {
    id: number;
    groupId: number;
    senderId: number;
    content: string;
    createdAt: string;
  }
  
export interface Group {
    id: number;
    name: string;
    ownerId: number;
    createdAt: string;
  }
  
export interface FriendStatus {
    id: number;
    username: string;
    online: boolean;
  }
  