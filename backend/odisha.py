import xarray as xr
import pandas as pd
import matplotlib.pyplot as plt

# ==========================================
# LOAD IMD NETCDF FILE
# ==========================================

print("\nLoading IMD Rainfall Dataset...")

ds = xr.open_dataset("RF25_ind2024_rfp25.nc")

# ==========================================
# EXTRACT ODISHA REGION
# ==========================================

odisha = ds.sel(
    LATITUDE=slice(17.5, 22.5),
    LONGITUDE=slice(81.5, 87.5)
)

print("\nOdisha Dataset Loaded Successfully")

# ==========================================
# CONVERT TO DATAFRAME
# ==========================================

df = odisha.to_dataframe().reset_index()

print("\n===== FIRST 5 RECORDS =====")
print(df.head())

print("\n===== DATASET SHAPE =====")
print(df.shape)

# ==========================================
# EXPORT CSV
# ==========================================

df.to_csv("odisha_rainfall_2024.csv", index=False)

print("\nCSV file saved as:")
print("odisha_rainfall_2024.csv")

# ==========================================
# DAILY RAINFALL ANALYSIS
# ==========================================

daily_avg = df.groupby("TIME")["RAINFALL"].mean()

print("\n===== DAILY AVERAGE RAINFALL =====")
print(daily_avg.head())

plt.figure(figsize=(12, 5))

daily_avg.plot()

plt.title("Average Daily Rainfall in Odisha - 2024")
plt.xlabel("Date")
plt.ylabel("Rainfall (mm)")
plt.grid(True)

plt.savefig(
    "daily_rainfall_trend.png",
    dpi=300,
    bbox_inches="tight"
)

plt.show()

print("\nSaved:")
print("daily_rainfall_trend.png")

# ==========================================
# MONTHLY RAINFALL ANALYSIS
# ==========================================

df["MONTH"] = df["TIME"].dt.month

monthly = df.groupby("MONTH")["RAINFALL"].mean()

print("\n===== MONTHLY AVERAGE RAINFALL =====")
print(monthly)

plt.figure(figsize=(10, 5))

monthly.plot(kind="bar")

plt.title("Average Monthly Rainfall in Odisha (2024)")
plt.xlabel("Month")
plt.ylabel("Average Rainfall (mm)")
plt.grid(True)

plt.savefig(
    "monthly_rainfall.png",
    dpi=300,
    bbox_inches="tight"
)

plt.show()

print("\nSaved:")
print("monthly_rainfall.png")

# ==========================================
# EXTREME RAINFALL ANALYSIS
# ==========================================

print("\n===== EXTREME RAINFALL ANALYSIS =====")

print("Maximum Rainfall:", df["RAINFALL"].max(), "mm")
print("Minimum Rainfall:", df["RAINFALL"].min(), "mm")

max_row = df.loc[df["RAINFALL"].idxmax()]

print("\n===== LOCATION OF MAXIMUM RAINFALL =====")
print(max_row)

# ==========================================
# TOP 10 RAINFALL EVENTS
# ==========================================

top10 = df.nlargest(10, "RAINFALL")

print("\n===== TOP 10 RAINFALL EVENTS =====")
print(top10)

top10.to_csv(
    "top10_rainfall_events.csv",
    index=False
)

print("\nSaved:")
print("top10_rainfall_events.csv")

# ==========================================
# BASIC STATISTICS
# ==========================================

print("\n===== BASIC STATISTICS =====")

print(df["RAINFALL"].describe())

# ==========================================
# ANNUAL RAINFALL HEATMAP
# ==========================================

print("\nGenerating Odisha Rainfall Heatmap...")

mean_rainfall = odisha["RAINFALL"].mean(dim="TIME")

plt.figure(figsize=(8, 6))

mean_rainfall.plot(
    cmap="Blues"
)

plt.title("Average Rainfall Distribution in Odisha (2024)")

plt.savefig(
    "odisha_rainfall_heatmap.png",
    dpi=300,
    bbox_inches="tight"
)

plt.show()

print("\nSaved:")
print("odisha_rainfall_heatmap.png")

# ==========================================
# WETTEST LOCATION
# ==========================================

mean_df = mean_rainfall.to_dataframe().reset_index()

wettest = mean_df.loc[
    mean_df["RAINFALL"].idxmax()
]

print("\n===== WETTEST GRID LOCATION =====")

print(wettest)

# ==========================================
# DRIEST LOCATION
# ==========================================

driest = mean_df.loc[
    mean_df["RAINFALL"].idxmin()
]

print("\n===== DRIEST GRID LOCATION =====")

print(driest)

# ==========================================
# SAVE SPATIAL ANALYSIS
# ==========================================

mean_df.to_csv(
    "odisha_spatial_rainfall_analysis.csv",
    index=False
)

print("\nSaved:")
print("odisha_spatial_rainfall_analysis.csv")

# ==========================================
# PROJECT SUMMARY
# ==========================================

print("\n===================================")
print("TwinNetra Rainfall Analysis Complete")
print("===================================")

print("\nGenerated Files:")

print("1. odisha_rainfall_2024.csv")
print("2. daily_rainfall_trend.png")
print("3. monthly_rainfall.png")
print("4. odisha_rainfall_heatmap.png")
print("5. top10_rainfall_events.csv")
print("6. odisha_spatial_rainfall_analysis.csv")

print("\nAnalysis Completed Successfully")