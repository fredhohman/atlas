import numpy as np
import pandas as pd
import sys
import json
import os
import igraph as ig
import pprint


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

    # open graph decomposition info json
    graph_decomposition_info_path = '../data/' + args['-data'] + '/' + args['-data'] + '-decomposition-info.json'
    graph_decomposition_info = json.load(open(graph_decomposition_info_path))
    print(graph_decomposition_info)

    # define our data
    data = {}
    data['name'] = args['-data']
    data['description'] = ''
    data['vertices'] = graph_decomposition_info['vertices']
    data['edges'] = graph_decomposition_info['edges']
    data['peels'] = []
    data['layers'] = []
    
    # get peels form graph layer json files
    peels = []

    for file in os.listdir('../data/' + args['-data']):
        if file.startswith(args['-data'] + '-layer-'):
            peel = int(file.split('-')[-1].split('.')[0])
            peels.append(peel)

    peels = sorted(peels)
    print(peels)

    # iterate through graph layer json files, create igraph, computer stats for each layer
    for peel in peels:
        print('-----')
        print('peel ', peel)

        graph_layer = json.load(open('../data/' + args['-data'] + '/' + args['-data'] + '-layer-' + str(peel) + '.json'))
        g_layer = ig.Graph.DictList(directed=False,
                                    vertices=graph_layer['nodes'],
                                    vertex_name_attr='id',
                                    edges=graph_layer['links'],
                                    edge_foreign_keys=('source', 'target')
                                    )
        print(g_layer.summary())

        # compute stats
        clone_count = 0
        for v in g_layer.vs:
            if len(v['peels']) > 1:
                clone_count += 1

        clustering = g_layer.transitivity_undirected()

        # define layer data
        layer = {}
        layer['peel'] = peel
        layer['edges'] = g_layer.ecount()
        layer['vertices'] = g_layer.vcount()
        layer['clones'] = clone_count
        layer['components'] = len(g_layer.components())
        layer['clustering'] = clustering

        # add layer data to data
        data['layers'].append(layer)
        data['peels'].append(peel)
    
    # pprint.pprint(data)

    # save data as json
    with open('../data/' + args['-data'] + '/' + args['-data'] + '.json' , 'w') as outfile:
        json.dump(data, outfile)



