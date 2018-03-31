# Using Your Own Graph Data

[Atlas][atlas] and the [Atlas Edge Decomposition Algorithm][atlas-algorithm] use plain text edge lists where sources adn targets are numbers as input. For edge lists with labels instead of numbers, see adding [Vertex Labels](#vertex-labels).

Say your edge list is named `myGraph.txt`. To use your own graph data, create the new directory `data/myGraph`.

This directory will contain all the data needed to load your graph into Atlas.

Inside of `data/myGraph` place the following files:

* `myGraph-decomposition.csv` (to get this file, see [github.com/fredhohman/atlas-algorithm][atlas-algorithm])
* `myGraph-decomposition-info.json` (to get this file, see [github.com/fredhohman/atlas-algorithm][atlas-algorithm])
* `myGraph-positions.csv`

`myGraph-positions.csv` contain x and y coordinates for each vertex in your graph. The file should have three columns: the vertex ID, x coordinate, and the y coordinate. You can obtain coordinates from any graph layout of your choosing (for large graphs, we use a [GPU layout][gpu-layout]). If your graph had only three vertices, then your file would look like this:

```csv
1,811.958,-217.099
2,737.26,-173.93
3,559.598,-165.009
```

With these three files, change directories to `data-processing`:

```
cd data-processing/
```

Now run 

```bash
./data-processing myGraph
```

`data-processing.sh` is a bash script that simply calls Python scripts to generate `.json` files to be read by Atlas.

Once `data-processing.sh` is finished, you should now have one file called `myGraph.json` with metadata about your graph, and one `.json` file for each layer from the decomposition. These files will be named `myGraph-layer-X.json` where `X` is the layer number from the decomposition.

All that is left to do is point Atlas at this directory. To do so, open `js/index.js`, uncomment the current graph being used, and add yours:

```javascript
// comment out old graph
// const dataDirName = 'lesmis';

// add your new graph data
const dataDirName = 'myGraph';
```

You are all done! Run Atlas as you normally would. For instructions, see [github.com/fredhohman/atlas][atlas].


## Vertex Labels

Bonus: if you have vertex labels associated with your graph, include a file called `myGraph-map.json` that is a dictionary whose keys are vertex IDs (numbers) and values are the vertex labels. The file should look like this (if your graph has 3 vertices):

```json
{
	"1": "Euclid",
	"2": "Pythagoras",
	"3": "Archimedes",
}
```

Once you have run `data-process.sh` from above, run the following command to add the labels to your `.json` data:

```bash
python add-vertex-labels.py -data myGraph
```


## Example Graph Data

We've included a complete example of a graph to be visualized in Atlas as an example to follow. You can find it in `data/lesmis`.


## Contact

For questions and support contact [Fred Hohman][fred].


[atlas]: https://github.com/fredhohman/atlas
[atlas-algorithm]: https://github.com/fredhohman/atlas-algorithm
[gpu-layout]: https://github.com/govertb/GPUGraphLayout
[fred]: http://www.fredhohman.com