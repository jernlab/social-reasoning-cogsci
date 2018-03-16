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
