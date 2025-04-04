## join queue
``` json
{
  "event": "join_queue"
}
```


## game_update

``` json
{
  "event": "game_update",
  "gameId": "game-xyz",
  "sender": "player1-id",
  "payload": {
    "action": "move",
    "position": { "x": 100, "y": 200 },
    "ball": { "x": 250, "y": 250 }
  }
}
```
## create_private_game
``` json
{
  "event": "create_private_game",
  "nb_players":2,
  "isFriend":false
}
```

## join_private_game
``` json
{
  "event": "join_private_game",
  "gameCode": "gameCode"
}
```



## 
``` json
{
  "event": "game_result",
  "gameId": "game-xyz",
  "winner": "player1-id",
  "isPongGame": false,
  "durationSeconds": 100000,
  "winnerScore":5,
  "loserScore":2
}
```

