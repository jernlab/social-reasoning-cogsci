from sqlalchemy import create_engine, MetaData, Table
import json
import pandas as pd
pd.options.mode.chained_assignment = None  # default='warn'

db_url = "mysql://user:password@127.0.0.1:3306/database"
table_name = 'table'
data_column_name = 'datastring'  # do not change

# boilerplace sqlalchemy setup
engine = create_engine(db_url)
metadata = MetaData()
metadata.bind = engine
table = Table(table_name, metadata, autoload=True)

# make a query and loop through
s = table.select()
rows = s.execute()

data = []

# status codes of subjects who completed experiment
statuses = [3, 4, 5, 7]

# if you have workers you wish to exclude, add them here
exclude = []
for row in rows:
    # only use subjects who completed experiment and aren't excluded
    # automatically excludes debug accounts
    if row['status'] in statuses and row['uniqueid'] not in exclude \
       and 'debug' not in row['uniqueid']:
        data.append(row[data_column_name])

# Now we have all participant datastrings in a list.
# Let's make it a bit easier to work with:

# parse each participant's datastring as json object
# and take the 'data' sub-object
data = [json.loads(part)['data'] for part in data]

# insert anonymous id field into trialdata:
newid = -1
for part in data:
    newid = newid + 1
    for record in part:
        record['trialdata']['uniqueid'] = newid

# flatten nested list so we just have a list of the trialdata recorded
# each time psiturk.recordTrialData(trialdata) was called.
data = [record['trialdata'] for part in data for record in part]

# Put all subjects' trial data into a dataframe object from the
# 'pandas' python library: one option among many for analysis
data_frame = pd.DataFrame(data)

# keep only trial (question) rows
d = data_frame[data_frame['phase'] == 'TRIAL']

# make list of participants that passed attention check
d_attention = d[d['game'] == 'attentionGame']
d_attention = d_attention[['uniqueid', 'judgements1', 'judgements2']]

d_attention.set_index('uniqueid', inplace=True)
d_attention['passed?'] = (d_attention['judgements1'] == '0') & \
                         (d_attention['judgements2'] == '0')

ids = d_attention.index[d_attention['passed?']].tolist()

# column names to keep (with judgements)
column_names_wj = ["uniqueid", "time", "leftLabel",
                   "game", "outcome", "firstPlayer",
                   "choice1", "rangeProb1", "judgements1",
                   "choice2", "rangeProb2", "judgements2"]

# column names to keep (without judgements)
# column_names_noj = ["uniqueid", "time", "leftLabel",
#                     "game", "outcome", "firstPlayer",
#                     "choice1", "rangeProb1",
#                     "choice2", "rangeProb2"]

# cleaning and final setup
d1 = d[column_names_wj]
d1 = d1[d1['uniqueid'].isin(ids)]
d1 = d1[d1['game'] != 'attentionGame']

d1.outcome.fillna(0, inplace=True)
d1['game'] = d1['game'] + d1['outcome'].astype('int').map(str)
d1.drop('outcome', axis=1, inplace=True)
d1['firstPlayer'] = d1['firstPlayer'].map({'_h': "row", '_v': "column"})

# converting all responses to enemies->friends scale
d1.leftLabel = d1.leftLabel.astype(str)
d1['rangeProb1'] = d1.apply(
    lambda x: 100 - int(x['rangeProb1'])
    if "friends" in x['leftLabel'].lower()
    else x['rangeProb1'],
    axis=1
)
d1['rangeProb2'] = d1.apply(
    lambda x: 100 - int(x['rangeProb2'])
    if "friends" in x['leftLabel'].lower()
    else x['rangeProb2'],
    axis=1
)
d1.drop('leftLabel', axis=1, inplace=True)

# melt data into tidy format
d2 = pd.melt(d1, id_vars=["uniqueid", "game", "firstPlayer", "choice1", "choice2"],
             value_vars=["rangeProb1", "rangeProb2"],
             var_name="phase", value_name="rating"
             )

# export to csv
#    data_frame: raw data
#    d: raw question-only data
#    d1: clean output (table, w/ j)
#    d2: tidy output (w/o j)
d.to_csv("dataOutput-raw.csv", index=False)
d1.to_csv("dataOutput-clean.csv", index=False)
d2.to_csv("dataOutput-tidy.csv", index=False)
