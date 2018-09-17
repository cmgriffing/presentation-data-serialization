##

<h1>Summary</h1>

## Browser Speed

![](./assets/jason-dancing-2.gif)

Nothing beats JSON

<div class="notes">
Browsers are heavily optimized for json, even mobile browsers
</div>

## Desktop Browser Inbound Data

![](./assets/jason-unimpressed.gif)

You can save 8% with Avro (after gzip)

<div class="notes">
Using the earlier Netflix BS math, using numbers from 2011:
- They could save $700 per month

Protobuf is slightly heavier than json.
</div>

## Desktop Browser Outbound Data

![](./assets/jason-blowing-up.gif)

You can save up to ~30% with Avro <br>
but that data is free anyway

<div class="notes">
Protobuf saves about 24% compared to JSON
</div>

## Mobile Data

Data is not free for the user (in most cases)

- mobile games
- realtime stock or cryptocurrency data
- bandwidth limited IoT

## Server to Server

- Speed\* depends on your server languages
- AWS still charges for outbound "Inter-region" data transfer
- Gzip can almost always help (when the source is trusted)

<div class="notes">
The server speed should not matter too much.

(serialization takes up ~5% of cpu overhead for a server)

</div>

---