# Atlas

*Atlas: Local Graph Exploration in a Global Context*

Atlas is an interactive graph exploration system that wields a fast and scalable edge decomposition algorithm, based on iterative vertex-edge peeling, that decomposes million-edge graphs in seconds, scaling to graphs with up to hundreds of millions of edges. Atlas introduces a new approach for exploring large graphs that simultaneously reveals (1) peculiar subgraph structure discovered through the decomposition’s layers, (e.g., quasi-cliques), and (2) possible vertex roles in linking such subgraph patterns across layers.

[Watch the demo video][video].

For the Atlas edge decomposition algorithm, go to [github.com/fredhohman/atlas-algorithm][atlas-algorithm].

***

<!-- ![UI](images/github-ui-fig.png) -->


## Installation

First, clone this repository:

```bash
git clone https://github.com/fredhohman/atlas.git
```

Within the cloned repo, install the required packages with npm:

```bash
npm install
```


## Usage

To run Atlas:

```bash
npm run start
```


### Requirements

Atlas requires [npm][npm] to run


## Atlas Edge Decomposition Algorithm

Atlas uses a fast, scalable edge decomposition to split graphs into graph layers for visualizaion.
For the edge decomposition algorithm, go to [github.com/fredhohman/atlas-algorithm][atlas-algorithm].

## License

MIT License. See [`LICENSE.md`](LICENSE.md).

## Credits 

For questions and support contact [Fred Hohman][fred].


[atlas-algorithn]: https://github.com/fredhohman/atlas-algorithm
[npm]: https://www.npmjs.com
[video]: http://www.fredhohman.com 
[fred]: http://www.fredhohman.com