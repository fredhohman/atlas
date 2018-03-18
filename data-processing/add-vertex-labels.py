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

    graph_data_path = '../data/' + args['-data'] + '/' + args['-data'] + '.json'
    graph_data = json.load(open(graph_data_path))

    word_to_id_map = json.load(open('../data/' + args['-data'] + '/' + args['-data'] + '-map.json'))

    for peel in graph_data['peels']:
        print('-----')
        print('peel ', peel)

        graph_layer_data_path = '../data/' + args['-data'] + '/' + args['-data'] + '-layer-' + str(peel) + '.json'
        graph_layer = json.load(open(graph_layer_data_path))

        for node in graph_layer['nodes']:
            # print(str(node['id']))
            # print(word_to_id_map[str(node['id'])])
            node['name'] = word_to_id_map[str(node['id'])]

        with open(graph_layer_data_path, 'w') as outfile:
            json.dump(graph_layer, outfile)
