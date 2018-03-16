# Computational Models of How People Infer Relationships

The model and experiment were based on the process of playing a simple [normal-form](https://en.wikipedia.org/wiki/Normal-form_game#An_example) game, where:
- there are two players, and
- the choices are sequential; one player chooses first, the other chooses second.
- The first player does not know what the second player will choose. However, the second player does know the first player's choice.
- Lastly, each player takes the other player’s options into account while making their own
choice.

## Model
The [current model](Model/prediction_exp2.ipynb) defines the Friend and Enemy relationships in terms of combinations of three parameters. We quantified the assumptions above to generate predictions for each condition.

## Experiment
Each of the 81 subjects were shown a series of 11 randomized game-and-outcome conditions and made two judgments per condition:
- how likely it was that the players were friends or enemies based only on the first
choice, and
- how likely it was that the players were friends or enemies based on both choices.

We took averages of this raw data by condition to generate the final [response data](Data/responseData.csv).
