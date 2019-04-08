# -*- coding: utf-8 -*-
"""
Created on Sat Apr 21 12:00:39 2018

@author: jrang
"""

import csv


class Utility(object):
    def __init__(self):
        pass

    def getWordAromaDict(self):
            with open('dictionary/aromas.csv', 'rU') as csvFile:
                aromaReader = csv.reader(csvFile, delimiter=',')
                wordAroma = {}
                next(aromaReader)
                for line in aromaReader:
                    if line[0] in wordAroma.keys():
                        wordAroma[line[0]].append(line[1])
                    else:
                        wordAroma[line[0]] = [line[1]]
                return wordAroma