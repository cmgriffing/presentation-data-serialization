##

<h1>Testing Methodology</h1>

## Different Object Sizes

- medium (~10kb)
- large (~100kb)

## Metrics

## Content-Length

graph: *pre-gzip* and *post-gzip*

## Library overhead

graph: *file size*

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


---
