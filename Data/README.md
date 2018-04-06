# Data

## Experiment Responses
- **dataOutput-clean.csv:** human-readable format; includes judgment explanations
- **dataOutput-tidy.csv:** key-value format; useful for analysis
- **dataOutput-raw.csv:** raw experiment output
- **responseData.csv:** reports response averages for each condition in tidy format

## Model Predictions
- **modelData.csv:** model predictions for each condition produced by the [second model](../Model/prediction_exp2.ipynb)
- **finalData.csv:** response and model prediction averages reported together in tidy format

## Visualizations
- **visualization.R:** data formatting and visual generation
- **scatter.PNG:** scatterplot of the experiment response averages versus the model predictions for each condition; includes 95% confidence interval bars
- **dumbbells.PNG:** dumbbell plots of the experiment response averages and model predictions at each stage of the game, separated by first player

## Clean and Tidy Schemas
- **uniqueid:** anonymous participant id
- **time:** total length of experiment at the end of each trial in milliseconds
- **game:** name and outcome index of displayed game; outcomes numbered right-to-left, top-to-bottom, and indexed from 0
- **firstPlayer:** first player to make a choice; row player chooses top or bottom, column player chooses right from left
- **choice1:** first player's choice
- **choice2:** second player's choice
- **phase:** choice/judgment phase on 0-100, definitely enemies to definitely friends scale
  - _rangeProb1:_ participant's first judgment after the first player's choice
  - _rangeProb2:_ participant's second judgment after both players' choices
- **rating:** participant's rating for the according phase
