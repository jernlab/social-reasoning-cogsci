#  ------------------------------------------
#  Generates scatter and dummbell plots for
#  the Guess Friends or Enemies experiment
#  with collected response and generated
#  model data
#
#  Anna Scott
#  2017-09-14
#  ------------------------------------------

# clear environment
rm(list = ls())

# load libraries
library(tidyverse)
library(ggpmisc)
library(ggalt)
library(gridExtra)

# --------------------------- Scatterplot ---------------------------

# load initial data
d.model <- read_csv("modelData.csv")
d.responses <- read_csv("dataOutput-tidy.csv")

# groupby, then mean and standard deviation calculations
data_summary <- function(data, varname, groupnames){
  require(plyr)
  summary_func <- function(x, col){
    c(mean = mean(x[[col]], na.rm=TRUE),
      sd = sd(x[[col]], na.rm=TRUE))
  }
  data_sum <- ddply(data, groupnames, .fun=summary_func, varname)
  data_sum <- rename(data_sum, c("mean" = varname))
  return(data_sum)
}

# get mean and sd for each group
d.responses.summary <- data_summary(d.responses, varname="rating",
                                    groupnames=c("game",
                                                 "firstPlayer",
                                                 "phase"))

# add sd column to main dataframe
d.all <- merge(d.model, d.responses.summary,
                 by = c("game", "firstPlayer", "phase"))

# get sample sizes for each group
d.all$count <- count(d.responses, c("game", "firstPlayer", "phase"))$freq

# calculate standard errors
d.all$se <- (d.all$sd * 1.96) / sqrt(d.all$count)

# make the scatterplot with error bars
# correlation coefficient not shown
p.scatter <- ggplot(data = d.all,
            aes(x = rating.x,
                y = rating.y,
                color = phase)) +
  # geom_text(x = 0.10, y = 95,
  #           aes(label = paste("paste(italic(R) ==",
  #                             cor(d.all$rating.y, d.all$rating.x), ")",
  #                             sep=" ")),
  #           parse = TRUE,
  #           color = "black",
  #           size = 5, hjust = 0) +
  geom_errorbar(aes(ymin=rating.y-se, ymax=rating.y+se), width = 0.02) +
  geom_point(size = 3) +
  scale_x_continuous(limits = c(-0.01,1.01),
                     breaks = seq(0,1,by=0.20)) +
  scale_y_continuous(limits = c(0,100),
                     breaks = seq(0,100,by=20)) +
  theme_light() +
  theme(legend.position = "bottom", strip.text.x = element_text(size = 14)) +
  scale_color_brewer(palette = "Dark2",
                     name = "Phase",
                     labels = c("Judgment 1", "Judgment 2")) +
  # geom_linerange(aes(ymin=rating.y-se, ymax=rating.y+se, width=0.02),
  #                color = "black") +
  labs(x = "Model Predictions",
       y = "Experiment Response Means",
       color = "Judgment")

# print(p.scatter)

# --------------------------- Dumbbells ---------------------------
# load just responses data and change format
d2.responses <- read_csv("responseData.csv")
d2.responses <- spread(d2.responses, key = "phase", value = "mean") %>%
  mutate(d2.responses, game = reorder(game, -rangeProb2))

# change model data format
d2.model <- spread(d.model, key = "phase", value = "rating") %>%
  mutate(d2.model, game = reorder(game, -d2.responses$rangeProb2))

# create responses dumbbell plot
p2.responses <- ggplot(data = d2.responses,
             aes(x = rangeProb1,
                 xend = rangeProb2,
                 y = firstPlayer)) +
  theme_minimal() +
  geom_vline(xintercept = 50, color = "#4d4d4d") +
  scale_x_continuous(limits = c(-1,101),
                     breaks = seq(0,100,by=50),
                     minor_breaks = seq(0,100,by=10)) +
  geom_dumbbell(size=2.5,
                color = "#e6ab02",
                colour_x = "#7570b3",
                colour_xend = "#e6ab02") +
  theme(panel.grid.minor.y = element_blank(),
        panel.grid.major.y = element_blank(),
        axis.title.y = element_text(angle = 0, vjust = 0.5),
        panel.grid.minor.x = element_line(color = "#cccccc")) +
  facet_wrap(~ game, ncol = 1) +
  labs(x = "Mean Rating",
       y = "First Player",
       title = "Experiment Responses")

# print(p2.responses)

# create model dummbell plot (inherits from responses plot)
p2.model <- p2.responses %+% d2.model +
  geom_vline(xintercept = 0.50, color = "#4d4d4d") +
  scale_x_continuous(limits = c(-0.01,1.01),
                     breaks = seq(0,1,by=0.50),
                     minor_breaks = seq(0,1,by=0.10)) +
  geom_dumbbell(size=2.5,
                color = "#e6ab02",
                colour_x = "#7570b3",
                colour_xend = "#e6ab02") +
  labs(x = "Rating",
       y = "First Player",
       title = "Model Predictions")

# print(p2.model)

# print both plots in a nice layout
# grid.arrange(p2, p2.m, ncol = 2)

# -------------------------- Export PNGs --------------------------
png(filename = "scatter.png"
    , width = 7.5
    , height = 7.5
    , units = "in"
    , res = 1200)
p.scatter
dev.off()

png(filename = "dumbbells.png"
    , width = 8
    , height = 7.5
    , units = "in"
    , res = 1200)
grid.arrange(p2.responses, p2.model, ncol = 2)
dev.off()
