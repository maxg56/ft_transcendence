
/*
class GameWebSocketClient
    - Client WebSocket pour gérer la connexion au serveur de jeu.
    - Gère la reconnexion automatique et les messages envoyés/recus.
*/
class GameWebSocketClient 
{
    private socket: WebSocket | null = null;
    private url: string;
    private token: string;
    private reconnectTimeout: number;
    private reconnectInterval: number;
    private reconnectAttempts: number;
    private isConnected: boolean = false;
  
    // Callback functions
    private onOpenCallback: () => void = () => {};
    private onCloseCallback: () => void = () => {};
    private onErrorCallback: (error: Event) => void = () => {};
    private onMessageCallback: (message: any) => void = () => {};
  
    constructor(url: string, token: string, reconnectInterval: number = 3000, reconnectAttempts: number = 5) {
      this.url = url;
      this.token = token;
      this.reconnectInterval = reconnectInterval;
      this.reconnectAttempts = reconnectAttempts;
      this.reconnectTimeout = 0;
    }
  
    // Méthodes pour enregistrer les callbacks
    public onOpen(callback: () => void): void {
      this.onOpenCallback = callback;
    }
  
    public onClose(callback: () => void): void {
      this.onCloseCallback = callback;
    }
  
    public onError(callback: (error: Event) => void): void {
      this.onErrorCallback = callback;
    }
  
    public onMessage(callback: (message: any) => void): void {
      this.onMessageCallback = callback;
    }
  
    // Démarre la connexion WebSocket
    public connect(): void {
      if (this.socket) {
        this.close();
      }
  
      const wsUrl = `${this.url}?token=${this.token}`;
      this.socket = new WebSocket(wsUrl);
  
      this.socket.onopen = () => {
        this.isConnected = true;
        this.onOpenCallback();
      };
  
      this.socket.onclose = () => {
        this.isConnected = false;
        this.onCloseCallback();
        this.reconnect();
      };
  
      this.socket.onerror = (error) => {
        this.onErrorCallback(error);
      };
  
      this.socket.onmessage = (event) => {
        this.onMessageCallback(JSON.parse(event.data));
      };
    }
  
    // Envoie un message via le WebSocket
    public sendMessage(event: string, payload: object): void {
      if (this.socket && this.isConnected) {
        const message = JSON.stringify({ event, ...payload });
        this.socket.send(message);
      } else {
        console.error("WebSocket is not connected.");
      }
    }
  
    // Ferme la connexion WebSocket proprement
    public close(): void {
      if (this.socket) {
        this.socket.close();
        this.isConnected = false;
      }
    }
  
    // Logique de reconnexion
    private reconnect(): void {
      if (this.reconnectAttempts > 0) {
        console.log(`Reconnecting in ${this.reconnectInterval / 1000} seconds...`);
        this.reconnectTimeout = window.setTimeout(() => {
          this.reconnectAttempts -= 1;
          this.connect();
        }, this.reconnectInterval);
      } else {
        console.log("Max reconnection attempts reached.");
      }
    }
  
    // Méthodes pour envoyer des événements spécifiques
    public joinQueue(): void {
      this.sendMessage('join_queue', {});
    }
  
    public gameUpdate(gameId: string, sender: string, position: { x: number, y: number }, ball: { x: number, y: number }): void {
      const payload = {
        gameId,
        sender,
        payload: {
          action: "move",
          position,
          ball
        }
      };
      this.sendMessage('game_update', payload);
    }
  
    public createPrivateGame(nbPlayers: number, isFriend: boolean): void {
      const payload = {
        nb_players: nbPlayers,
        isFriend
      };
      this.sendMessage('create_private_game', payload);
    }
  
    public joinPrivateGame(gameCode: string): void {
      const payload = { gameCode };
      this.sendMessage('join_private_game', payload);
    }
  
    public gameResult(gameId: string, winner: string, isPongGame: boolean, durationSeconds: number, winnerScore: number, loserScore: number): void {
      const payload = {
        gameId,
        winner,
        isPongGame,
        durationSeconds,
        winnerScore,
        loserScore
      };
      this.sendMessage('game_result', payload);
    }
  }
  
  export default GameWebSocketClient;
  