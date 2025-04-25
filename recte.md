## join queue
``` json
{
  "event": "join_queue",
  "format": {
    "playersPerTeam": 2,
    "teams": 2
  }
}
```
retoure
``` json
{
  "event": "match_found",
  "gameId": "xyz-123",
  "format": { "playersPerTeam": 2, "teams": 2 },
  "teamId": 1,
  "teams": [
    {
      "id": 1,
      "players": [
        { "id": "p1", "name": "Alice" },
        { "id": "p2", "name": "Bob" }
      ]
    },
    {
      "id": 2,
      "players": [
        { "id": "p3", "name": "Charlie" },
        { "id": "p4", "name": "David" }
      ]
    }
  ]
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



## game_result
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

