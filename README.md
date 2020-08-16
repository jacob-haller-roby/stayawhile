Useful stuff:

Monitor redis commands with:

```docker run -it --network stay_a_while --rm redis redis-cli -h stay_a_while_redis monitor```

Verify redis pubsub events with:

```docker run -it --network stay_a_while --rm redis redis-cli -h stay_a_while_redis config get notify-keyspace-events```