# -*- coding: utf-8 -*-
"""
Created on Sat Apr 21 11:32:29 2018

@author: jrang
"""

import csv
import operator
from utility import Utility

class GetAroma(object):
    def __init__(self):
        #Input
        self.input = open('data/wine-processed.csv', 'r')
        self.data = self.input.readlines()
        self.util = Utility()
        self.wordAroma = self.util.getWordAromaDict()
        #output
        self.output = open('data/wine_aroma.csv', 'w', newline='', encoding='utf-8')
        self.writer = csv.writer(self.output)
    def process(self):
        for i, line in enumerate(self.data):
            if (len(line.split(','))) == 13:
                #self.bar.update(i)
                # Assigning values for all variables
                country, description, designation, points, \
                price, province, region_1, region_2, taster_name, taster_twitter_handle, title, variety,\
                winery = line.split(',')
                # Empty dictionary for recording emotion scores
                aromaDict = {"chemical": 0, "earthy": 0, "wood": 0, "caramel": 0, "nutty": 0, "herbaceous": 0,
                                "fruit": 0,"spice": 0, "floral": 0, "microbiological": 0, "oxidized":0,"pungent":0}
                for token in description.split(" "):
                    #print(token)
                    if token in self.wordAroma.keys():
                        for aroma in self.wordAroma[token]:
                            aromaDict[aroma] = aromaDict[aroma] + 1
                finalAroma = max(aromaDict.items(), key=operator.itemgetter(1))[0]
                if aromaDict[finalAroma] is not 0:
                    # Writing all the variables to the file
                    seq = [finalAroma, country, description, designation, points,
                           price, province, region_1, region_2, taster_name, taster_twitter_handle, 
                           title, variety, winery ]
                    self.writer.writerow(seq)

if __name__ == '__main__':
    obj = GetAroma()
    obj.process()
