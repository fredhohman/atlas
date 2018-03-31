import numpy as np
import pandas as pd
import sys
import json
import os
import igraph as ig
import pprint
import copy

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
    print('graph-decomposition-info:', graph_decomposition_info)

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
    print('peels:', peels)

    # iterate through graph layer json files, create igraph, computer stats for each layer
    for peel in peels:
        print('-----')
        print('peel ', peel)

        graph_layer_data_path = '../data/' + args['-data'] + '/' + args['-data'] + '-layer-' + str(peel) + '.json'
        graph_layer = json.load(open(graph_layer_data_path))

        g_layer = ig.Graph.DictList(directed=False,
                                    vertices=graph_layer['nodes'],
                                    vertex_name_attr='id',
                                    edges=graph_layer['links'],
                                    edge_foreign_keys=('source', 'target'))
        print(g_layer.summary())

        # compute stats
        clone_count = 0
        for v in g_layer.vs:
            if len(v['peels']) > 1:
                clone_count += 1

        clustering = g_layer.transitivity_undirected()

        print('computing graph layer layout')
        if g_layer.vcount() < 5000:
            layout = g_layer.layout("fr", maxiter=100)
            for i, coords in enumerate(layout):
                graph_layer['nodes'][i]['fdx'] = coords[0]
                graph_layer['nodes'][i]['fdy'] = coords[1]

        if (g_layer.vcount() > 5000) and (g_layer.vcount() < 25000):
            # layout = g_layer.layout("drl")
            layout = g_layer.layout("fr", maxiter=50)
            for i, coords in enumerate(layout):
                graph_layer['nodes'][i]['fdx'] = coords[0]
                graph_layer['nodes'][i]['fdy'] = coords[1]

        if (g_layer.vcount() > 25000) and (g_layer.vcount() < 52000):
            # layout = g_layer.layout("drl")
            layout = g_layer.layout("fr", maxiter=10)
            for i, coords in enumerate(layout):
                graph_layer['nodes'][i]['fdx'] = coords[0]
                graph_layer['nodes'][i]['fdy'] = coords[1]

        if g_layer.vcount() > 52000:
            # layout = g_layer.layout("drl")
            pass

        largest_component = g_layer.subgraph(max(g_layer.components(),key=len))

        # add connected component ids to each node
        print('adding connected component ids')
        comp_list = list(g_layer.components())
        comp_list.sort(key=len)
        for i, cl in enumerate(comp_list):
            for j, n in enumerate(cl):
                cl[j] = g_layer.vs[n]['id']

        for node in graph_layer['nodes']:
            for i, cmpt in enumerate(comp_list):
                if int(node['id']) in cmpt:
                    node['cmpt'] = i
                    break

        # define layer data
        print('computing layer data')
        layer = {}
        layer['peel'] = peel
        layer['edges'] = g_layer.ecount()
        layer['vertices'] = g_layer.vcount()
        layer['clones'] = clone_count
        layer['components'] = len(comp_list)
        layer['clustering'] = clustering
        layer['largest-component-edges'] = largest_component.ecount()
        layer['largest-component-vertices'] = largest_component.vcount()

        # add layer data to data
        data['layers'].append(layer)
        data['peels'].append(peel)

        # save data as json
        print('saving layer data with component ids')
        with open(graph_layer_data_path, 'w') as outfile:
            json.dump(graph_layer, outfile)
    
    # pprint.pprint(data)

    with open('../data/' + args['-data'] + '/' + args['-data'] + '.json' , 'w') as outfile:
        json.dump(data, outfile)



