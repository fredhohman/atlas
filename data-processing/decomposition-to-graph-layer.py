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

    boundary = 500

    # load vertices and positions
    positions = pd.io.parsers.read_csv(
        '../data/' + args['-data'] + '/' + args['-data'] + '-positions.csv',
        delimiter=',',
        header=None,
        names=['id','x','y']
        )
    print(positions.shape)

    # zero center
    max = positions.max()
    min = positions.min()
    x_max = max['x']
    y_max = max['y']
    x_min = min['x']
    y_min = min['y']
    x_midpoint = (x_max - x_min)/2
    y_midpoint = (y_max - y_min)/2
    positions['x'] = positions['x'] - (x_min + x_midpoint)
    positions['y'] = positions['y'] - (y_min + y_midpoint)

    # scale to boundary
    max = positions.max()
    min = positions.min()
    x_max = max['x']
    y_max = max['y']
    x_min = min['x']
    y_min = min['y']
    max_cord = np.max([x_max, y_max])
    scale_factor = boundary / max_cord
    positions['x'] = positions['x'] * scale_factor
    positions['y'] = positions['y'] * scale_factor

    # load decomposition and edges
    decomposition = pd.io.parsers.read_csv(
        '../data/' + args['-data'] + '/' + args['-data'] + '-decomposition.csv',
        delimiter=',',
        header=None,
        names=['source', 'target', 'peel']
        )
    print(decomposition.shape)

    peels = sorted(decomposition['peel'].unique())
    print('peels:', peels)

    for peel in peels:
        print('-----')
        print('peel ', peel)

        # define graph to be saved
        graph = {}
        graph['nodes'] = []
        graph['links'] = []

        temp_v_ids = set()

        for edge in decomposition.itertuples(name=None):
            # tuple(id, source, target, peel)

            if edge[3] == peel:
                graph['links'].append( { 'source': int(edge[1]), 'target': int(edge[2]), 'p': int(edge[3]) } )
                temp_v_ids.add(edge[1])
                temp_v_ids.add(edge[2])

        # print(len(temp_v_ids))
        
        for v in temp_v_ids:
            v_idx = positions.index[positions['id'] == int(v)].tolist()[0]
            graph['nodes'].append( { 'id': int(v),'x': positions.loc[v_idx]['x'], 'y': -1*positions.loc[v_idx]['y'] } )

        print('links: ', len(graph['links']))
        print('nodes: ', len(graph['nodes']))

        # save graph as json
        # num_of_leading_zeros = len(str(np.max(peels)))
        with open('../data/' + args['-data'] + '/'  + args['-data'] + '-layer-' + str(peel) + '.json', 'w') as outfile:
            json.dump(graph, outfile)
