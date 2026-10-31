import numpy as np
import pandas as pd
import matplotlib.pyplot as plt


adn = ("GGGAGTGTBTATTAABTBBGAABTBBBAGBGBTAGBTBGBGBGGAGTGABBGAGBB"
"TABATGAGGGTABTGTBAATAABGBATGTTABBAGAAGGA")
serie = pd.Series(list(adn)) # une lettre = un individu
n_i = serie.value_counts().sort_index()
tab = pd.DataFrame({"n_i": n_i})
tab["f_i"] = tab["n_i"] / tab["n_i"].sum()
tab["p_i"] = 100 * tab["f_i"]
tab["angle"] = 360 * tab["f_i"]
print(tab.round(4))
print("n =", tab["n_i"].sum(), "| mode :", n_i.idxmax())
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
ax1.bar(tab.index, tab["n_i"], width=0.6)
ax1.set_xlabel("Base"); ax1.set_ylabel("Effectif")
ax2.pie(tab["n_i"], labels=tab.index, autopct="%1.1f %%", startangle=90)
plt.tight_layout(); plt.show()