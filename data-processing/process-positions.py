import numpy as np
import pandas as pd
import sys
import json
import os
import igraph as ig
import pprint
import matplotlib.pyplot as plt

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

    boundary = 500

    for peel in graph_data['peels']:
        print('-----')
        print('peel ', peel)

        graph_layer_data_path = '../data/' + args['-data'] + '/' + args['-data'] + '-layer-' + str(peel) + '.json'
        graph_layer = json.load(open(graph_layer_data_path))

        print(len(graph_layer['nodes']))

        # zero center points
        x = [ node['x'] for node in graph_layer['nodes'] ]
        y = [ node['y'] for node in graph_layer['nodes'] ] 
        fdx = [ node['fdx'] for node in graph_layer['nodes'] ]
        fdy = [ node['fdy'] for node in graph_layer['nodes'] ]
        
        x_max = np.max(x)
        y_max = np.max(y)
        x_min = np.min(x)
        y_min = np.min(y)
        
        fdx_max = np.max(fdx)
        fdy_max = np.max(fdy)
        fdx_min = np.min(fdx)
        fdy_min = np.min(fdy)
        
        x_midpoint = (x_max - x_min)/2
        y_midpoint = (y_max - y_min)/2
        fdx_midpoint = (fdx_max - fdx_min)/2
        fdy_midpoint = (fdy_max - fdy_min)/2

        for node in graph_layer['nodes']:
            node['x'] = node['x'] - (x_min + x_midpoint)
            node['y'] = node['y'] - (y_min + y_midpoint)
            node['fdx'] = node['fdx'] - (fdx_min + fdx_midpoint)
            node['fdy'] = node['fdy'] - (fdy_min + fdy_midpoint)

        # scaling
        x = [ node['x'] for node in graph_layer['nodes'] ]
        y = [ node['y'] for node in graph_layer['nodes'] ] 
        fdx = [ node['fdx'] for node in graph_layer['nodes'] ]
        fdy = [ node['fdy'] for node in graph_layer['nodes'] ]

        x_max = np.max(x)
        y_max = np.max(y)
        x_min = np.min(x)
        y_min = np.min(y)
        
        fdx_max = np.max(fdx)
        fdy_max = np.max(fdy)
        fdx_min = np.min(fdx)
        fdy_min = np.min(fdy)

        max_cord = np.max([x_max, y_max])
        max_fd_cord = np.max([fdx_max, fdy_max])
        
        scale_factor = boundary/max_cord
        scale_factor_fd = boundary/max_fd_cord

        for node in graph_layer['nodes']:
            node['x'] = scale_factor * node['x']
            node['y'] = scale_factor * node['y']
            node['fdx'] = scale_factor_fd * node['fdx']
            node['fdy'] = scale_factor_fd * node['fdy']

        # plotting checks
        # plt.figure(figsize=(6,6))
        # plt.scatter(x=[node['x'] for node in graph_layer['nodes']],y=[node['y'] for node in graph_layer['nodes']])
        # plt.xlim([-boundary,boundary])
        # plt.ylim([-boundary,boundary])
        # plt.show()
        # plt.figure(figsize=(6,6))
        # plt.scatter(x=[node['fdx'] for node in graph_layer['nodes']],y=[node['fdy'] for node in graph_layer['nodes']])
        # plt.xlim([-boundary,boundary])
        # plt.ylim([-boundary,boundary])
        # plt.show()

        with open(graph_layer_data_path, 'w') as outfile:
            json.dump(graph_layer, outfile)
