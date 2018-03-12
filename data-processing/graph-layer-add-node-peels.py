import numpy as np
import pandas as pd
import sys
import json


def getopts(argv):
    opts = {}
    while argv:
        if argv[0][0] == '-':
            opts[argv[0]] = argv[1]
        argv = argv[1:]
    return opts

if __name__ == '__main__':

    args = getopts(sys.argv)
    print(args)

    # load decomposition and edges
    print('loading decomposition')
    decomposition = pd.io.parsers.read_csv(
        '../data/' + args['-data'] + '/' + args['-data'] + '-decomposition.csv', 
        delimiter=',',
        header=None,
        names=['source', 'target', 'peel']
        )
    print('decomposition:', decomposition.shape)
    node_peels = {}

    # get clones for each node in a list
    print('get clones')
    for edge in decomposition.itertuples(name=None):
        # tuple(id, source, target, peel)

        if edge[1] not in node_peels:
            node_peels[edge[1]] = set()
            node_peels[edge[1]].add(int(edge[3]))
        else:
            node_peels[edge[1]].add(int(edge[3]))

        if edge[2] not in node_peels:
            node_peels[edge[2]] = set()
            node_peels[edge[2]].add(int(edge[3]))
        else:
            node_peels[edge[2]].add(int(edge[3]))

    peels = sorted(decomposition['peel'].unique())
    print('peels:', peels)

    for i, peel in enumerate(peels):
        print('-----')
        print('peel ', peel)

        # graph layer json
        graph_layer_data_path = '../data/' + args['-data'] + '/' + args['-data'] + '-layer-' + str(peel) + '.json'
        graph_layer_data = json.load(open(graph_layer_data_path))

        # save clones to 'peels' key
        for node in graph_layer_data['nodes']:
            node['peels'] = sorted(list(node_peels[node['id']]), reverse=True)

        # save graph as json
        with open(graph_layer_data_path, 'w') as outfile:
            json.dump(graph_layer_data, outfile)
