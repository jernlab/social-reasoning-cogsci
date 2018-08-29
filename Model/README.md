# Models

## [Relationship Model](Relationship_Model.ipynb)
This model depends on explicit definitions for “friends” and “enemies” through three parameters. We define friends as two players who want the highest possible payouts for each other, and care about the other person more than him or herself. Enemies want the lowest possible payout for the opposite player; however, they care more about their own payout. Based on these definitions, we form a model on the premise that each player considers the other player’s set of options while making their choice.

## [Parameter Model](Parameter_Model.ipynb)
In this model, we abandon the idea of specific relationship definitions for friends and enemies, and instead focus on the values of the parameters themselves by creating a three-value tuple for each possible combination. We enumerate these triples and take a weighted average to find the expected value of the ranking index given the first player’s choice. Higher values on this scale represent “friendly” relationships, while the lower end represents “unfriendly” relationships. Values close to the middle represent pure selfishness as opposed to neutral.