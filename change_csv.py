import pandas as pd 

# read in football csv
df = pd.read_csv('./data/football.csv')

## GRAPH ONE DATA 
yearCount = []
year_col = df.loc[:,"date"]

year2000 = 0
year2001 = 0
year2002 =0
year2003 =0
year2004 = 0

for year in year_col: 
    # first 4 characters - year
    parsed = year[0:4]
    if parsed == "2000":
        year2000 += 1
    if parsed == "2001":
        year2001 += 1
    if parsed == "2002":
        year2002 += 1
    if parsed == "2003":
        year2003 += 1
    if parsed == "2004":
        year2004 += 1

yearCount.append(["2000", str(year2000)])
yearCount.append(["2001", str(year2001)])
yearCount.append(["2002", str(year2002)])
yearCount.append(["2003", str(year2003)])
yearCount.append(["2004", str(year2004)])

numberOfGames = pd.DataFrame(yearCount, columns=['year', 'count'])
numberOfGames.to_csv('graphOne.csv', index=False)

#-----------------------------



#GRAPH TWO DATA

graph_two_cols = df.loc[:,[ "year","home_team","away_team","home_score","away_score", "neutral", "tournament"]]

# Country to Total Matches
countryToTotal=dict()

# Country to Numbers of Wins
countryToWin = dict()

# Country to Number of Neutral 
countryToNeutrals = dict() 

for index, row in graph_two_cols.iterrows():
    home_team = row["home_team"]
    away_team = row["away_team"]
    home_score = row["home_score"]
    away_score = row["away_score"]
    neutral = row["neutral"]
    
    #Update Total number of matches 
    if home_team in countryToTotal:
        countryToTotal[home_team] += 1
    else:
        countryToTotal[home_team] = 1
        
    if away_team in countryToTotal:
        countryToTotal[away_team] += 1
    else:
        countryToTotal[away_team] = 1
    
    #Check for a neutral match, increase count of number of neutral matches, update win by 1/2 
    if neutral == True:
        # Update Neutral to +1
        if home_team in countryToNeutrals:
            countryToNeutrals[home_team] += 1
        else:
            countryToNeutrals[home_team] = 1
        
        if away_team in countryToNeutrals:
            countryToNeutrals[away_team] += 1
        else:
            countryToNeutrals[away_team] = 1
        
    else:
        
        # Home Team Won 
        if home_score > away_score:
            if home_team in countryToWin:
                countryToWin[home_team] += 1
            else:
                countryToWin[home_team] = 1
        # Away Team Won 
        else:
            if away_team in countryToWin:
                countryToWin[away_team] += 1
            else:
                countryToWin[away_team] = 1
                
# Country, Winning Percentage, Number of Wins, Number of Neutrals, Total Number of Matches From 1872-2020 
# Exclude from data with Total number of matches <=20 
winningPerc = []

                
for country in countryToTotal:
    total = countryToTotal[country]
    win = 0
    neutral = 0
    
    if country in countryToWin:
        win = countryToWin[country]
    
    if country in countryToNeutrals:
        neutral = countryToNeutrals[country]
    
    neutralVal = neutral * .5    
    # IGNORE countrys that have less than 20 matches in total 
    if total <20:
        continue
    else:
        winPerc = (win + neutralVal) / total
        update = winPerc * 100 
        input = [country, str(round(update, 2)), str(total), str(win), str(neutral)]
        winningPerc.append(input)    
        
        

#GRAPH 2 To CSV

topWinning = pd.DataFrame(winningPerc, columns=['country', 'winningPerc', 'total', 'wins', 'neutrals'])
topWinning.to_csv('graphTwo.csv', index=False)       

##-------------------

##GRAPH 3

        
graph_three_cols = df.loc[:,[ "date","home_team","away_team","home_score","away_score", "neutral", "tournament"]]

#Country to All their opponents - when calculating victory strength, ignore countries who played less than 5 matches
countryToOpponents = dict()

graphThree_countryToTotal=dict()

graphThree_countryToWin = dict()

graphThree_countryToNeutrals = dict() 

countryToWinningPerc = dict()

yearsToConsider = dict()
yearsToConsider["2011"] = True
yearsToConsider["2012"] = True
yearsToConsider["2013"] = True
yearsToConsider["2014"] = True
yearsToConsider["2015"] = True
yearsToConsider["2016"] = True
yearsToConsider["2017"] = True
yearsToConsider["2018"] = True

tournamentsConsider = dict()
tournamentsConsider["FIFA World Cup qualification"] = True 
tournamentsConsider["FIFA World Cup"] = True 


for index, row in graph_three_cols.iterrows():
    home_team = row["home_team"]
    away_team = row["away_team"]
    home_score = row["home_score"]
    away_score = row["away_score"]
    neutral = row["neutral"]
    tournament = row["tournament"]
    year = row["date"][0:4]
    
    # Only include world cup from 2011-2014 and 2015-2018 
    if year in yearsToConsider:
        if tournament in tournamentsConsider:
            
            #Add Opponents
            
            #Update Total number of matches 
            if home_team in graphThree_countryToTotal:
                graphThree_countryToTotal[home_team] += 1
            else:
                graphThree_countryToTotal[home_team] = 1
        
            if away_team in graphThree_countryToTotal:
                graphThree_countryToTotal[away_team] += 1
            else:
                graphThree_countryToTotal[away_team] = 1
    
            #Update Total number of matches 
            if home_team in graphThree_countryToTotal:
                graphThree_countryToTotal[home_team] += 1
            else:
                graphThree_countryToTotal[home_team] = 1
        
            if away_team in graphThree_countryToTotal:
                graphThree_countryToTotal[away_team] += 1
            else:
                graphThree_countryToTotal[away_team] = 1
    
    #Check for a neutral match, increase count of number of neutral matches, update win by 1/2 
            if neutral == True:
                # Update Neutral to +1
                if home_team in graphThree_countryToNeutrals:
                    graphThree_countryToNeutrals[home_team] += 1
                else:
                    graphThree_countryToNeutrals[home_team] = 1
        
                if away_team in graphThree_countryToNeutrals:
                    graphThree_countryToNeutrals[away_team] += 1
                else:
                    graphThree_countryToNeutrals[away_team] = 1
        
            else:
        
        # Home Team Won 
                if home_score > away_score:
                    if home_team in graphThree_countryToWin:
                        graphThree_countryToWin[home_team] += 1
                    else:
                        graphThree_countryToWin[home_team] = 1
                    
                    # Add opponent of home team 
                    if home_team in countryToOpponents:
                        countryToOpponents[home_team].add(away_team)
                    else:
                        opponentSet = set()
                        opponentSet.add(away_team)
                        countryToOpponents[home_team] = opponentSet
                    
        # Away Team Won 
                else:
                    if away_team in graphThree_countryToWin:
                        graphThree_countryToWin[away_team] += 1
                    else:
                        graphThree_countryToWin[away_team] = 1
                    
                    #Add opponent of away team 
                    if away_team in countryToOpponents:
                        countryToOpponents[away_team].add(home_team)
                    else:
                        opponentSet = set()
                        opponentSet.add(home_team)
                        countryToOpponents[away_team] = opponentSet

## Country, Winning Percentage, Victory Percentage 

for country in graphThree_countryToTotal:
    total = graphThree_countryToTotal[country]
    win = 0
    neutral = 0
    
    if country in graphThree_countryToWin:
        win = graphThree_countryToWin[country]
    
    if country in graphThree_countryToNeutrals:
        neutral = graphThree_countryToNeutrals[country]
    
    neutralVal = neutral * .5    
    # IGNORE countrys that have less than 5 matches in total 
    if total <5:
        continue
    else:
        winPerc = (win + neutralVal) / total
        update = winPerc * 100 
        countryToWinningPerc[country] = update

victoryAndWinning = []


for country in countryToWinningPerc:
    winningP = countryToWinningPerc[country]
    
    victoryStrength = 0
    opponents = []
    if country in countryToOpponents:
        opponents = countryToOpponents[country]
    else:
        continue
    
    count = 0
    #exclude opponents that are not in countryToWinningPerc
    for o in opponents: 
        if o in countryToWinningPerc:
            score = countryToWinningPerc[o]
            victoryStrength += score
            count += 1
            
    ## implies opponents they played played less than 5 matches
    if count == 0:
        victoryStrength = 0
    else:
        victoryStrength = victoryStrength / count 
    input = [country, str(round(winningP, 2)), str(round(victoryStrength, 2))]
    victoryAndWinning.append(input)
    
    
## Graph 3 TO CSV 
topVictoryAndWinning = pd.DataFrame(victoryAndWinning, columns=['country', 'winningPerc', 'victoryStrength'])
topVictoryAndWinning.to_csv('graphThree.csv', index=False)      









