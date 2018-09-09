<!--

Synopsis: There are alternatives to JSON for sending data from client to server or between servers. What do they do and what do they look like? What are their benefits?Payload size? Encoding or Decoding speed? Let's find out. JSON is probably sufficient for most cases, but let's try and find the edge cases where you might want improvement.

-->


##

<h1>Testing Methodology</h1>

## Different Object Sizes

- medium (~10kb)
- large (~100kb)

## Metrics

## Content-Length (Uncompressed)


<div class="col-2">
  ![](./assets/size-10k.svg)
</div>
<div class="col-2">
  ![](./assets/size-100k.svg)
</div>

## Content-Length (Gzipped)

<div class="col-2">
  ![](./assets/gzip-size-10k.svg)
</div>
<div class="col-2">
  ![](./assets/gzip-size-100k.svg)
</div>

## Library overhead

<div class="col-2">
  ![](./assets/lib-size.svg)
</div>
<div class="col-2">
  ![](./assets/lib-gzip-size.svg)
</div>

##

<h1>Browser Runtimes</h1>

<div class="notes">

Chrome only so far

Take these with a grain of salt.
</div>

## Browser: Encoding 10K

![](./assets/browser-encoding-10k.svg)

## Browser: Encoding 100K

![](./assets/browser-encoding-100k.svg)

## Browser: Decoding 10K

![](./assets/browser-decoding-10k.svg)

## Browser: Decoding 100K

![](./assets/browser-decoding-100k.svg)



##

<h1>Node CPU Runtime</h1>

<div class="notes">
Its important to note that Node optimizes for JSON.

Other platforms might see results that favor JSON much less.
</div>

## Node: Encoding 10K

![](./assets/encoding-10k.svg)

## Node: Encoding 100K

![](./assets/encoding-100k.svg)

## Node: Decoding 10K

![](./assets/decoding-10k.svg)

## Node: Decoding 100K

![](./assets/decoding-100k.svg)


##

<h1>Other Languages</h1>

## Go

[https://github.com/alecthomas/go_serialization_benchmarks](https://github.com/alecthomas/go_serialization_benchmarks)

## Java

![](./assets/java-performance.png)

[https://dzone.com/articles/is-protobuf-5x-faster-than-json](https://dzone.com/articles/is-protobuf-5x-faster-than-json)

<div class="notes">
- 2-part series
- shows Java has some JSON libraries that are faster than protobuf for general data
</div>

---
