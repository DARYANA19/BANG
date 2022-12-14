import numpy as np  # linear algebra
import pandas as pd  # data processing, CSV file I/O (e.g. pd.read_csv)
import matplotlib.pyplot as plt  # data visualization purposes
import seaborn as sns  # statistical data visualization


import pandas as pd

df = pd.read_csv('spam.csv', encoding="ISO-8859-1")
df = df.drop(df.columns[range(2, 5)], axis=1)
df.head()

# Проверка на пустые значения

df_value_counts = df['v1'].value_counts()
df_value_counts
df_value_counts.isnull().sum()

# Количество значений каждой категории:

df_value_counts.plot.bar(color=['green', 'red'])

# Далее можно посмотреть 30 самых популярных слов в этих категориях


from collections import Counter

ham_ct = Counter(" ".join(df[df['v1'] == 'ham']["v2"]).split()).most_common(30)
spam_ct = Counter(" ".join(df[df['v1'] == 'spam']["v2"]).split()).most_common(30)

df_ham = pd.DataFrame.from_dict(ham_ct)
df_ham = df_ham.rename(columns={0: "word", 1: "count"})
df_spam = pd.DataFrame.from_dict(spam_ct)
df_spam = df_spam.rename(columns={0: "word", 1: "count"})

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
df_ham.plot.bar(x='word', y='count', legend=False, ax=axes[0])
df_spam.plot.bar(x='word', y='count', color='red', legend=False, ax=axes[1])

axes[0].set_title('Non-Spam')
axes[1].set_title('Spam')

plt.show()

# Как мы видим, наиболее распространенными словами являются предлоги. Они не должны иметь никакого влияния на процесс классификации.
#
# Разработка признаков
# В этой части, называемой разработкой признаков, нам нужно преобразовать необработанные данные набора данных в полезные функции.
# При работе с текстовыми данными из любого источника (электронная почта, SMS и т. д.) необходимо преобразовать эти входные данные в представление, называемое Bag of words.
# Это превращает входные документы (корпус) в числовые представления, описываемые количеством вхождений слов.
# Как мы видели ранее, в этих документах есть различные слова, которые должны иметь минимальное влияние, называемые стоп-словами. Нам нужно повторно взвесить эти числовые представления в значения с плавающей запятой, которые больше подходят для классификатора.
# Этот метод называется преобразованием tf-idf и вместе со счетчиком вхождений объединяется в единый вектор sklearn.

from sklearn.feature_extraction.text import TfidfVectorizer

transformer = TfidfVectorizer(stop_words='english')
X = transformer.fit_transform(df["v2"])
np.shape(X)

# Пришло время разделить набор данных на обучающие и тестовые наборы. Прежде чем мы это сделаем, мы должны заменить слова «спам» и «неспам» на двоичные.

from sklearn.model_selection import train_test_split

# Extract features and prediction vectors
y = df['v1'].map({'ham': 0, 'spam': 1})
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0)
X_train.shape, X_test.shape

# # Создание модели и обучение
#
# Давайте инициализируем две наши модели, MultinomialNB и BernoulliNB. После инициализации мы подгоняем модели к данным и записываем их оценки для прогнозного анализа.

# In[9]:


from sklearn.naive_bayes import MultinomialNB, BernoulliNB

mnb = MultinomialNB()
mnb.fit(X_train, y_train)
score_train_mnb = mnb.score(X_train, y_train)
score_test_mnb = mnb.score(X_test, y_test)

bnb = BernoulliNB()
bnb.fit(X_train, y_train)
score_train_bnb = bnb.score(X_train, y_train)
score_test_bnb = bnb.score(X_test, y_test)

# # Прогнозный анализ
#

print(f'{y_test.value_counts()}\n')

null_accuracy = (1434 / (1434 + 238))
print('Null accuracy score: {0:0.4f}\n'.format(null_accuracy))

print("MultinomialNB:\n-> Train set: {}\n-> Test set:  {}".format(score_train_mnb, score_test_mnb))
print("BernoulliNB:\n-> Train set: {}\n-> Test set:  {}".format(score_train_bnb, score_test_bnb))

# Как мы видим, обе модели действительно хорошо справляются с классификацией спама от не спама, причем модель Бернулли работает немного лучше. Также точность обеих моделей выше нулевого значения точности, что означает, что они хорошо классифицируют конкретную задачу.



print("proverka:")
input_vectorized = transformer.transform(["Free entry in 2 a wkly comp to win FA Cup final tkts 21st May 2005. Text FA to 87121 to receive entry question(std txt rate)T&C's apply 08452810075over18's"])
print(bnb.predict(input_vectorized))

